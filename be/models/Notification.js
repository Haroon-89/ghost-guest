import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  message: String,
  type: { type: String, enum: ['warning', 'vault_released', 'verification'] },
  sentAt: { type: Date, default: Date.now },
});

export default mongoose.model('Notification', notificationSchema);
