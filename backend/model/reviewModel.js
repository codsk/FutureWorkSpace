import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  space: { type: mongoose.Schema.Types.ObjectId, ref: 'Space' },
  rating: { type: Number, min: 1, max: 5 },
  comment: String,
}, { timestamps: true });

export const reviewModel = mongoose.model('Review', reviewSchema);