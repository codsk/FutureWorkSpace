import mongoose from 'mongoose';
const imageSchema = mongoose.Schema({
  path: { type: String, require: true},
  filename: { type: String, require: true}
})

const detailSchema = new mongoose.Schema({
  spaceType:{
    type: String,
    // enum: ['meetingRoom', 'privateOffice', 'coworkingSpace', 'eventSpace', 'virtualOffice'],
    required: true,
  },
  floor:{
    type: String,
    required: true,
  },
  roomNumber:{
    type: String,
    required: true,
  },
  capacity: { type: Number, required: true },
  amenities: [{
    type: String,
    required: true
  }],
  pricePerSeat: {
    perHour: Number,
    perDay: Number,
    perWeek: Number,
    perMonth: Number,
    perThreeMonths: Number,
    perSixMonths: Number,
    perOneYear: Number
  },
  discountPercentage:{
    perHour: Number,
    perDay: Number,
    perWeek: Number,
    perMonth: Number,
    perThreeMonths: Number,
    perSixMonths: Number,
    perOneYear: Number
  },
  images: [imageSchema], 
  description: { type: String, required: true },
  availableDays: [String], // ['Monday', 'Tuesday', ...]
  availableTimes: {
    start: String, // e.g. '09:00'
    end: String    // e.g. '18:00'
  },
  availability: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Availability' }],
  isActive: { type: Boolean, default: true }
});
const spaceSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  spaces: {
    type: [detailSchema],
    default: [],
  }
});

export const space = mongoose.model('Space', spaceSchema);
