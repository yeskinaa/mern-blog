import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { validationResult } from 'express-validator'

import UserModel from '../models/User.js'

export const register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if(!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        }
    
        const salt = await bcrypt.genSalt(10)
        const password = req.body.password
        const passwordHash = await bcrypt.hash(password, salt) 

        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            passwordHash,
            avatarUrl: req.body.avatarUrl,
        })
        const user = await doc.save()

        const token = jwt.sign(
            {
                _id: user._id
            },
            "kio76fg",
            {
                expiresIn: "30d"
            }
        )

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.passwordHash;
    
        res.json({user: userWithoutPassword, 
                token})
    } catch (err) {
        res.status(500).json({
            message: "Unable to register"
        })
    }
}

export const login = async (req,res) => {
    try {
        const { email, password } = req.body
        const user = await UserModel.findOne({ email })
        if(!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
        if(!isPasswordValid) {
            return res.status(400).json({
                message: "Wrong login or password"
            })
        }

        const token = jwt.sign(
            {
                _id: user._id
            },
            "kio76fg",
            {
                expiresIn: "30d"
            }
        )

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.passwordHash;
    
        res.json({user: userWithoutPassword, 
                token})
    } catch (err) {
        res.status(500).json({
            message: "Unable to login"
        })
    }
}

export const userInfo = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if (!user) {
            return res.status(404).json({
                message: 'User not found' 
            });
        }

        const userWithoutPassword = { ...user._doc };
        delete userWithoutPassword.passwordHash;
      
        res.json({ user: userWithoutPassword })
    } catch (err) {
        console.log(err)
        res.status(500).json({
            message: "Error while getting user information"
        
        })
    }
}