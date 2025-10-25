import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  notice: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Notice',
    required: true
  }
}, { timestamps: true });

// Prevent duplicate registrations
registrationSchema.index({ user: 1, notice: 1 }, { unique: true });

export default mongoose.model('Registration', registrationSchema);
