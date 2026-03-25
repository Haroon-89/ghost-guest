import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  legacyContact: {
    name: String,
    email: String,
  },
  lastLogin: { type: Date, default: Date.now },
  isDeceased: { type: Boolean, default: false },
  vaultReleased: { type: Boolean, default: false },
  verificationEmailsSent: { type: Number, default: 0 },
  switchMonths: { type: Number, default: 3 },
}, { timestamps: true });

export default mongoose.model('User', userSchema);
