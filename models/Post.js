import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    text: {
        type: String,
        require: true,
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
        require: true,
    },
    imageUrl: String,
}, {
    timestamps: true
});

export default mongoose.model('Post', postSchema);