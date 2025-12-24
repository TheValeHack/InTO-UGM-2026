import mongoose from 'mongoose';

const VoucherSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true },
  type: { type: String, enum: ['nominal', 'percentage'], required: true },
  valid_until: { type: Date, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Voucher || mongoose.model('Voucher', VoucherSchema);
