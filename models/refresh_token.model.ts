import mongoose from "mongoose"

const RefreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    token: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true
    },
    // Device tracking for multi-device support
    deviceId: {
        type: String,
        required: true, // Unique identifier per device (e.g., UA hash, device UUID)
    },
    deviceName: {
        type: String, // Optional: "iPhone", "Desktop Chrome", etc.
    },
    ipAddress: {
        type: String, // Optional: Track IP for security
    },
    userAgent: {
        type: String, // Optional: Browser/app info
    },
}, {
    timestamps: true,
    // Allow multiple tokens per user (multi-device support)
    // Index by userId and deviceId for fast lookups
});

// Create index for efficient queries
RefreshTokenSchema.index({ userId: 1, deviceId: 1 }, { unique: true });

const RefreshToken = mongoose.model("RefreshToken", RefreshTokenSchema)
export default RefreshToken