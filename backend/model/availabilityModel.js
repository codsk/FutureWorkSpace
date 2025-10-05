import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  placeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
  spaceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Space', required: true },
  date: { type: Date, required: true },
  slotType: { type: String, required: true}, //  ['hourly', 'daily', 'weekly', 'monthly']
  slots: [{
    time: String, // e.g. '10:00 - 11:00'
    isBooked: Boolean,
  }]
});

export const availabilityModel = mongoose.model('Availability', availabilitySchema);