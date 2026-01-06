import mongoose from 'mongoose';

const VerificationTokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' },
});

export default mongoose.models.VerificationToken || mongoose.model('VerificationToken', VerificationTokenSchema);