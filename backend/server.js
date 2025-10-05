import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import userRouter from './routes/user.js';
import propertyRouter from './routes/property.js';
import spaceRouter from './routes/space.js';
import bookingRouter from './routes/booking.js';
import availabilityRouter from './routes/availability.js'
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({path: 'config.env'});

let app= express(); 
app.use(cors());
app.use(express.json());
app.use('/user', userRouter);  
app.use('/api/property', propertyRouter);
app.use('/api/space', spaceRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/availability', availabilityRouter);
// app.use('/api/review', spaceRouter);

app.use('/uploads/propertyImages', express.static(path.join(__dirname, 'uploads/propertyImages')));

const PORT=process.env.PORT || 3001; 
app.listen(PORT,()=>{ 
    connectDB();
    console.log(`Server is running on port ${PORT}`);
}) 