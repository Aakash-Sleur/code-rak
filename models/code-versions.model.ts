import mongoose from "mongoose"

const CodeVersionSchema = new mongoose.Schema({
    codeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Code",
        required: true,
        index: true
    },

    versionNumber: {
        type: Number,
        required: true
    },

    code: {
        type: String,
        required: true
    },

    // optional but VERY useful
    message: {
        type: String // like git commit message
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },

    isMajor: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

const CodeVersion = mongoose.model("CodeVersions", CodeVersionSchema)
export default CodeVersion