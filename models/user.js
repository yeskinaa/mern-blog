import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String, 
        required: true,
        unique: true, 
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true,
        minlength: 5
    },
    avatarUrl: String
})

export default mongoose.model("User", userSchema)