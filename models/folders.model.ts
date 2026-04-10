import mongoose from "mongoose"

const FolderSchema = new mongoose.Schema({
    name: {
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
    color: {
        type: String,
        required: true,
    },
    isPublic: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});

const Folder = mongoose.model("Folder", FolderSchema)
export default Folder