import express from 'express';
import { propertyModel } from '../model/propertyModel.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
    destination: function (req, file, cb){
      cb(null, './uploads/propertyImages');
    },
    filename: function (req,file, cb){
      cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer ({storage});

const propertyRouter = express.Router();

propertyRouter.post("/upload/propertyDetails/:ownerId",upload.array("images", 10),async (req, res) => {
    try {
      // Ensure that form data and files are properly parsed
      const { name, address, geo, contact, description } = req.body;
      const owner = req.params.ownerId;
      const images = req.files.map((file) => ({
        path: `uploads/propertyImages/${file.filename}`, 
        filename: file.originalname,                    
      }));
      const newProperty = new propertyModel({
        name,
        address: {
          street: address.street,
          city: address.city,
          state: address.state,
          pincode: address.pincode,
        },
        geo: {
          lat: geo.lat,
          lng: geo.lng,
        },
        contact: {
          email: contact.email,
          phone: contact.phone,
        },
        image: images, 
        description,
        rating: 0, 
        owner, 
      });
      const savedProperty = await newProperty.save();

      res.status(201).json({
          message: "Property added successfully",
          property: savedProperty,
        });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
  
);

propertyRouter.get('/get/propertyDetailsByOwnerId/:ownerId', async (req,res)=>{
    const { ownerId } = req.params;
    try{
        if(!ownerId){
            return res.status(400).json({message: "Owner ID is not found"});
        }
        const properties = await propertyModel.find({owner: ownerId});

        if(!properties || properties.length === 0){
            return res.status(404).json({message: "No properties found for this owner"});
        }

        const imageBaseUrl = process.env.NODE_ENV === 'production'? 'https://your-production-url.com/uploads/'
      : 'http://localhost:5000/uploads/';

      const propertyWithImageUrls = {
        ...properties,
        images:properties?.images?.map(img => ({
          ...img,
          path: `${imageBaseUrl}/${img.filename}`
      }))
    };
    res.status(200).json({
      message: "All properties fetched successfully",
      properties: propertyWithImageUrls
    });
  }catch(error){
    res.status(500).json({message: error.message});
  }
})

propertyRouter.get('/get/propertyDetailsByCity/:city', async (req, res) => {
    const { city } = req.params;
    try {
        if (!city) {
            return res.status(400).json({ message: "City is required" });
        }
        const properties = await propertyModel.find({
            'address.city': { $regex: city, $options: 'i' } // Case-insensitive search
        });
        if (!properties || properties.length === 0) {
            return res.status(404).json({ message: "No properties found for this city" });
        }
        const imageBaseUrl = process.env.NODE_ENV === 'production' 
            ? 'https://your-production-url.com/uploads/' 
            : 'http://localhost:5000/uploads/';

        const propertiesWithImageUrls = properties.map(property => {
            return {
                ...property.toObject(),
                images: property.image.map(img => ({
                    ...img,
                    path: `${imageBaseUrl}${img.path}`
                }))
            };
        });
        res.status(200).json({
            message: "Properties fetched successfully",
            properties: propertiesWithImageUrls
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

propertyRouter.delete('/delete/property/:propertyId', async (req,res)=>{
  const { propertyId } = req.params;
  try{
    if(!propertyId){
      return res.status(400).json({message: 'Property Id is required'});
    }
    const deleteProperty = await propertyModel.findByIdAndDelete(propertyId);
    if(!deleteProperty){
      return res.status(404).json({message: 'Property not found'});
    }
    res.status(200).json({message: 'Property deleted successfully' });
  }catch (error) {
    res.status(500).json({message: error.message});
  }
})

propertyRouter.put('/update/property/:propertyId', upload.array('images', 10), async (req, res) => {
  try {
    const { name, address, geo, contact, description } = req.body;
    const propertyId = req.params.propertyId;
    // Parse existing images to keep
    const existingImages = JSON.parse(req.body.existingImages || '[]');

    // New uploaded images
    const uploadedImages = req.files.map(file => ({
      path: `uploads/propertyImages/${file.filename}`,
      filename: file.originalname,
    }));

    // Get current property
    const property = await propertyModel.findById(propertyId);
    if (!property) return res.status(404).json({ message: "Property not found" });

    // 🔥 Delete removed images from disk
    const removedImages = property.image.filter(
      (img) => !existingImages.some(ei => ei.path === img.path)
    );
    removedImages.forEach(img => {
      const filePath = path.join(process.cwd(), img.path);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    // Final images list
    const finalImages = [...existingImages, ...uploadedImages];

    // Update property
    const updated = await propertyModel.findByIdAndUpdate(propertyId, {
      name,
      address,
      geo,
      contact,
      description,
      image: finalImages,
    }, { new: true });

    res.status(200).json({ message: "Property updated successfully", property: updated });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});
export default propertyRouter;