import nodemailer from 'nodemailer';
import User from '../models/User.js';
import VaultItem from '../models/VaultItem.js';
import Notification from '../models/Notification.js';
import { decrypt } from '../utils/encryption.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const items = await VaultItem.find({ owner: user._id });
    const decryptedItems = items.map((item) => {
      const obj = item.toObject();
      try { obj.instructions = decrypt(obj.instructions); } catch { /* leave as-is */ }
      return obj;
    });

    res.json({ user, vaultItems: decryptedItems });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const releaseVault = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

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

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.legacyContact.email,
        subject: `Ghost-Guest: Vault of ${user.name}`,
        html: `<p>The vault of <b>${user.name}</b> has been released to you.</p><ul>${itemList}</ul>`,
      });
    }

    await Notification.create({ userId: user._id, message: 'Vault manually released by admin.', type: 'vault_released' });
    res.json({ message: 'Vault released' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('userId', 'name email')
      .sort({ sentAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
