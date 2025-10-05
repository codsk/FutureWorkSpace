import express from 'express';
import { propertyModel } from '../model/propertyModel.js';
import { availabilityModel } from '../model/availabilityModel.js';
const availabilityRouter = express.Router();

// upload availability details
availabilityRouter.post('/upload/availabilityDetails/:placeId/:spaceId', async (req, res) => {
  const { placeId, spaceId } = req.params;
  const { date, slotType, slots } = req.body;
  try {
    const place = await propertyModel.findOne({
      _id: placeId,
      "space._id": spaceId
    });

    if (!place) {
      return res.status(404).json({ message: "Place or Space not found" });
    }

    const roomIndex = place.space.findIndex(room => room._id.toString() === spaceId);
    if (roomIndex === -1) {
      return res.status(404).json({ message: "Space ID not found in Place" });
    }

    const newAvailability = await availabilityModel.create({
      placeId: placeId,
      spaceId: spaceId,
      date,
      slotType,
      slots
    });

    place.space[roomIndex].availability.push(newAvailability._id);
    await place.save();

    res.status(201).json({
      message: 'Availability details uploaded successfully',
      availability: newAvailability
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update availability by availability ID
availabilityRouter.put('/update/:availabilityId', async (req, res) => {
  const { availabilityId } = req.params;
  const { date, slotType, slots } = req.body;

  try {
    const availability = await availabilityModel.findById(availabilityId);
    if (!availability) {
      return res.status(404).json({ message: "Availability not found" });
    }

    if (date) availability.date = date;
    if (slotType) availability.slotType = slotType;
    if (slots) availability.slots = slots;

    await availability.save();

    res.status(200).json({
      message: 'Availability updated successfully',
      availability
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete availability by availability ID
availabilityRouter.delete('/delete/:availabilityId', async (req, res) => {
  const { availabilityId } = req.params;

  try {
    const deleted = await availabilityModel.findByIdAndDelete(availabilityId);
    if (!deleted) {
      return res.status(404).json({ message: "Availability not found" });
    }

    res.status(200).json({ message: "Availability deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get availability by space ID
availabilityRouter.get('/get/:spaceId/:roomIndex', async (req, res) => {
  const { spaceId, roomIndex } = req.params;

  try {
    const space = await propertyModel.findById(spaceId).populate('space.availability');
    if (!space) return res.status(404).json({ message: 'Space not found' });

    const room = space.space[roomIndex];
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const availabilityList = await availabilityModel.find({ _id: { $in: room.availability } });

    res.status(200).json({ availability: availabilityList });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// get availability by date 
availabilityRouter.get('/getByDate/:spaceId/:date', async (req, res) => {
  const { spaceId, date } = req.params;
  try {
    const availability = await availabilityModel.find({
      space: spaceId,
      date: new Date(date)
    });

    res.status(200).json({ availability });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



export default availabilityRouter;