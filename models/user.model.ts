import mongoose from "mongoose"

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    profile: {
        firstName: {
            type: String,
        },
        lastName: {
            type: String,
        }
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true
});

const User = mongoose.models.User || mongoose.model("User", UserSchema)
export default User