import mongoose from 'mongoose';
const imageSchema = mongoose.Schema({
  path:{ type: String, required: true},
  filename:{ type: String, required: true}
})
const propertySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String,
  },
  geo: {
    lat: Number,
    lng: Number
  },
  contact: {
    email: String,
    phone: String,
  },
  image: [imageSchema],
  description: {type:String, required:true},
  rating: { type: Number, default: 0 },

}, { timestamps: true });

export const propertyModel = mongoose.model('Property', propertySchema);