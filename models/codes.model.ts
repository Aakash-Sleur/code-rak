import mongoose from "mongoose"

const CodesSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    code: {
        type: String,
        required: true,
    },
    version: {
        type: Number,
        required: true
    },
    language: {
        type: String,
        required: true,
    },
    tags: {
        type: [String],
        default: [],
    },
    folder: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Folder",
    },
    views: {
        type: Number,
        default: 0
    },
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    isPublic: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

const Code = mongoose.models.Code || mongoose.model("Code", CodesSchema)
export default Code