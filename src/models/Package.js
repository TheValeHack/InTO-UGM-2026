import mongoose from 'mongoose';

const PackageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  price: { type: Number, required: true },
  max_participants: { type: Number, required: true },
  created_at: { type: Date, default: Date.now },
});

export default mongoose.models.Package || mongoose.model('Package', PackageSchema);