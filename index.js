import express from 'express'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

import { registerValidation } from './validations/auth.js'
import { validationResult } from 'express-validator'

import UserModel from './models/user.js'

import checkAuth from './utils/checkAuth.js'

const app = express();
const port = 4445

mongoose
    .connect("mongodb+srv://yeskina_anna:r9uvb83b@cluster0.5wkcdvr.mongodb.net/blog?retryWrites=true&w=majority")
    .then(() => console.log("DB is OK!"))
    .catch((err) => console.log("DB is error!", err))

app.use(express.json())

//Регістрація
app.post('/auth/register', registerValidation, async (req, res) => {
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
})

//Авторизація
app.post('/auth/login', async (req,res) => {
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
})

//Отримання інформації про користувача
app.get('/auth/user-info', checkAuth, async (req, res) => {
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
})

app.listen(port, (err) => {
    if (err) {
       return console.log(err)
    }

    console.log(`The server is running on port ${port}`)
})

