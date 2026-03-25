import cron from 'node-cron';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import VaultItem from '../models/VaultItem.js';
import Notification from '../models/Notification.js';
import { decrypt } from './encryption.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

const sendMail = (to, subject, html) =>
  transporter.sendMail({ from: process.env.EMAIL_USER, to, subject, html });

const runSwitch = async () => {
  const users = await User.find({ isDeceased: false, vaultReleased: false });

  for (const user of users) {
    const monthsInactive = (Date.now() - new Date(user.lastLogin)) / (1000 * 60 * 60 * 24 * 30);
    const threshold = user.switchMonths || parseInt(process.env.SWITCH_MONTHS);

    if (monthsInactive < threshold) continue;

    if (user.verificationEmailsSent < 3) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      const link = `http://localhost:${process.env.PORT}/api/auth/verify-alive/${token}`;

      await sendMail(
        user.email,
        'Ghost-Guest: Are you still there?',
        `<p>Hi ${user.name}, we haven't seen you in a while.</p>
         <p><a href="${link}">Click here to confirm you're still active</a></p>`
      );

      user.verificationEmailsSent += 1;
      await user.save();

      await Notification.create({ userId: user._id, message: `Verification email #${user.verificationEmailsSent} sent.`, type: 'verification' });
    } else {
      user.isDeceased = true;
      user.vaultReleased = true;
      await user.save();

      if (user.legacyContact?.email) {
        const items = await VaultItem.find({ owner: user._id });
        const itemList = items.map((item) => {
          let instructions = '';
          try { instructions = decrypt(item.instructions); } catch { instructions = item.instructions; }
          return `<li><b>${item.label}</b> (${item.platform || item.category})<br>Account: ${item.accountEmail || 'N/A'}<br>Instructions: ${instructions}</li>`;
        }).join('');

        await sendMail(
          user.legacyContact.email,
          `Ghost-Guest: Vault of ${user.name}`,
          `<p>You have been designated as the legacy contact for <b>${user.name}</b>.</p>
           <p>Here is their digital vault:</p><ul>${itemList}</ul>`
        );
      }

      await Notification.create({ userId: user._id, message: `Vault released to legacy contact.`, type: 'vault_released' });
    }
  }
};

export default () => {
  cron.schedule('0 0 * * *', async () => {
    try { await runSwitch(); } catch (err) { console.error('Dead man switch error:', err); }
  });
};
