import VaultItem from '../models/VaultItem.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export const addItem = async (req, res) => {
  try {
    const { label, platform, accountEmail, instructions, category } = req.body;
    const item = await VaultItem.create({
      owner: req.user.id,
      label, platform, accountEmail, category,
      instructions: instructions ? encrypt(instructions) : '',
    });
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await VaultItem.find({ owner: req.user.id });
    const decrypted = items.map((item) => {
      const obj = item.toObject();
      try { obj.instructions = decrypt(obj.instructions); } catch { /* leave as-is */ }
      return obj;
    });
    res.json(decrypted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const item = await VaultItem.findOne({ _id: req.params.id, owner: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });

    const { label, platform, accountEmail, instructions, category } = req.body;
    if (label !== undefined) item.label = label;
    if (platform !== undefined) item.platform = platform;
    if (accountEmail !== undefined) item.accountEmail = accountEmail;
    if (category !== undefined) item.category = category;
    if (instructions !== undefined) item.instructions = encrypt(instructions);

    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await VaultItem.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
