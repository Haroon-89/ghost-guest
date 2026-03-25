import mongoose from 'mongoose';

const vaultItemSchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  label: { type: String, required: true },
  platform: String,
  accountEmail: String,
  instructions: String, // stored as encrypted JSON string
  category: { type: String, enum: ['subscription', 'social', 'banking', 'photos', 'other'], default: 'other' },
}, { timestamps: true });

export default mongoose.model('VaultItem', vaultItemSchema);
