import mongoose from "mongoose"

const postSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
        minlength: 5, 
        maxlength: 100,
    },
    text: {
        type: String,
        required: true,
        minlength: 10,
        unique: true
    },
    tags: {
        type: Array,
        default: [],
    },
    viewsCount: {
        type: Number,
        default: 0,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",
        required: true
    },
    imageUrl: String
})

export default mongoose.model("Post", postSchema)