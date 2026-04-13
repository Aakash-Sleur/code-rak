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
    parentFolder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Folder"
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

// Indexes
FolderSchema.index({ createdBy: 1 });
FolderSchema.index({ parentFolder: 1 });

const Folder = mongoose.models.Folder || mongoose.model("Folder", FolderSchema)
export default Folder