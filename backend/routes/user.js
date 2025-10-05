import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto'
import { usersModel } from '../model/userModel.js';
import { verifyToken } from '../middleware/auth.js';
import authMiddleware from '../guards/authMiddleware.js';

const userRouter = express.Router();

userRouter.get('/', async (req,res)=>{
    try{
        const userDetails = await usersModel.find({});
        res.status(200).json({
            message: "all users fetched successfully",
            users: userDetails.map(user => ({
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                role: user.role
            }))
        })
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

userRouter.post('/register/EndUser', async (req,res)=>{
    const {name, email, password, phone}=req.body;
    const role = 'client'; // Default role for user registration
    console.log(name, email, password, phone);
    try{
        const existingUser = await usersModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already registered"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = await usersModel.create({name,email,passwordHash,phone,role})

        const token = jwt.sign(
            {id:newUser._id, role:newUser.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        res.status(201).json({message:'User registered successfully',
            token,
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role
            }
        });
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

userRouter.post('/register/host', async (req,res)=>{
    const {name, email, password, phone}=req.body;
    const role = 'host'; // Default role for user registration
    try{
        const existingUser = await usersModel.findOne({email});
        if(existingUser){
            return res.status(400).json({message: "Email already registered"});
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password,salt);

        const newUser = await usersModel.create({name,email,passwordHash,phone,role})

        const token = jwt.sign(
            {id:newUser._id, role:newUser.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );
        res.status(201).json({message:'User registered successfully',
            token,
            user:{
                id:newUser._id,
                name:newUser.name,
                email:newUser.email,
                role:newUser.role
            }
        });
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

userRouter.get('/user/profile', authMiddleware, async (req,res)=>{
    try{
        const user = await usersModel.findById(req.user.id).select('-passwordHash');
        if(!user){
            return res.status(404).json({message: "User not found"});
        }   
        res.json(user);
    }catch(error){
        res.status(500).json({message: error.message}); 
    }
})

userRouter.post('/login', async (req,res)=>{
    const { email, password }= req.body;
    try{
        const user = await usersModel.findOne({email});
        
        if(!user){
            res.status(400).json({message: "Invalid email or password"});
        }
        const isMatch = await bcrypt.compare(password,user.passwordHash);
        if(!isMatch){
            res.status(400).json({message: "Invalid email or password"});
        }

        const token = jwt.sign(
            {id:user._id,role:user.role},
            process.env.JWT_SECRET,
            {expiresIn: '7d'}
        );

        res.status(200).json({
            message:"Login Successful",
            token,
            user:{
                id:user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

userRouter.post('/forgot-password', async (req,res)=>{
    const {email} = req.body;
    try{
        const user = await usersModel.findOne({email});

        if(!user){
            return res.status(404).json({message: 'Email not found'});
        }

        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 1000 * 60 * 10; //10 min

        resetTokens[resetToken]= {userId: user._id, expires: resetTokenExpiry}

        console.log(`Reset token: ${resetToken}`)

        res.status(200).json({message: 'Password reset link sent'})
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

userRouter.post('/reset-password', async (req,res)=>{
    const {token, newPassword}= req.body;
    try{
        const resetData = resetTokens[token];
        if(!resetData || resetData.expires < Date.now()){
            return res.status(400).json({message: 'Invalid or expired token'})
        }
        const user = await usersModel.findById(resetData.userId);
        if(!user){
            res.status(404).json({message: 'User not found'});
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        delete resetTokens[token];

        res.status(200).json({message: 'Password reset successful'});
    }catch(error){
        res.status(500).json({message: error.message})
    }
})

userRouter.put('/update', verifyToken, async (req,res)=>{
    const allowedFields = ['name','phone'];
    const updates = Object.keys(req.body);

    const isValidUpdate = updates.every((fields)=> allowedFields.includes(fields));
    if(!isValidUpdate){
        return res.status(400).json({message: "Invalid update Fields"});
    }
    try{
        const user = await usersModel.findById(req.user.id)
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        updates.forEach((field)=>{user[field]=req.body[field]});
        await user.save();
        res.status(200).json({
            message: "User updated successfully",
            user:{
                id: user._id,
                name: user.name,
                emial: user.email,
                phone: user.phone,
                role: user.role
            }
        });
    }catch(error){
        res.status(500).json({message: error.message});
    }
})


export default userRouter;