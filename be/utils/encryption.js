import dotenv from 'dotenv';
dotenv.config();

import crypto from 'crypto';

const ALGORITHM = 'aes-256-cbc';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY.padEnd(32, '0').slice(0, 32));

export const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return JSON.stringify({ iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') });
};

export const decrypt = (encryptedJSON) => {
  const { iv, encryptedData } = JSON.parse(encryptedJSON);
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData, 'hex')), decipher.final()]);
  return decrypted.toString('utf8');
};
