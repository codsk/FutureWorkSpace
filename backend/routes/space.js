import express from 'express';
import { space } from '../model/spaceModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, './uploads/spaceImages');
    },
    filename: function (req,file, cb){
      cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer ({storage});

const spaceRouter = express.Router();

// Add or append a space
spaceRouter.post('/addSpace/:propertyId',upload.array('images',10),  async (req, res) => {
  const { propertyId } = req.params;
  const spaceDetails = req.body;
  const images = req.files.map((file)=>({
    path: `uploads/spaceImages/${file.filename}`,
    filename: file.originalname
  })) 
  try {
    let spaceDoc = await space.findOne({ id: propertyId });
    const newSpace = {
      ...spaceDetails,
      images:images
    };
    if (!spaceDoc) {
      spaceDoc = await space.create({
        id: propertyId,
        spaces: [newSpace]
      });
    } else {
      spaceDoc.spaces.push(newSpace);
      await spaceDoc.save();
    }

    res.status(200).json(spaceDoc);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// GET spaces by propertyId
spaceRouter.get('/getSpaces/:propertyId', async (req, res) => {
  const { propertyId } = req.params;

  try {
    const spaceDoc = await space.findOne({ id: propertyId });

    if (!spaceDoc) {
      return res.status(404).json({ message: 'No spaces found for this property' });
    }
    const imageBaseUrl = process.env.NODE_ENV === 'production'? 'https://your-production-url.com/uploads/'
      : 'http://localhost:5000/uploads/';
    
    const spaceWithImageUrls = {
      ...spaceDoc,
      images: spaceDoc?.spaces.images?.map(img => ({
        ...img,
        path: `${imageBaseUrl}spaceImages/${img.filename}`
      }))
    }

    res.status(200).json({
      message: "All spaces fetched successfully",
      spaces: spaceWithImageUrls
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update a space
spaceRouter.put('/updateSpace/:propertyId/:spaceId', async (req, res) => {
  const { propertyId, spaceId } = req.params;
  const updates = req.body;

  try {
    const spaceDoc = await space.findOneAndUpdate(
      { id: propertyId, "spaces._id": spaceId },
      { $set: { "spaces.$": { _id: spaceId, ...updates } } },
      { new: true }
    );

    if (!spaceDoc) {
      return res.status(404).json({ message: 'Space not found' });
    }

    res.json(spaceDoc);
  } catch (err) {
    res.status(500).json({ message: "Update error", error: err.message });
  }
});


// Delete a space
spaceRouter.delete('/deleteSpace/:propertyId/:spaceId', async (req, res) => {
  const { propertyId, spaceId } = req.params;

  try {
    const spaceDoc = await space.findOneAndUpdate(
      { id: propertyId },
      { $pull: { spaces: { _id: spaceId } } },
      { new: true }
    );

    if (!spaceDoc) {
      return res.status(404).json({ message: 'Space not found' });
    }

    res.json({ message: "Space deleted", data: spaceDoc });
  } catch (err) {
    res.status(500).json({ message: "Delete error", error: err.message });
  }
});
export default spaceRouter;
