import bcrypt from "bcrypt";
import RefreshToken from "@/models/refresh_token.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/lib/token";
import { connectDB } from "@/lib/db";
import { generateDeviceId, getDeviceName, getClientIp } from "@/lib/device";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { refreshToken, userId } = await request.json();

        if (!refreshToken || !userId) {
            return NextResponse.json(
                { error: "Refresh token and userId are required" },
                { status: 400 }
            );
        }

        // Get device ID to find the correct token for this device
        const deviceId = generateDeviceId(request);

        // Find the refresh token for this specific device
        const storedToken = await RefreshToken.findOne({ userId, deviceId });

        if (!storedToken) {
            return NextResponse.json(
                { error: "Refresh token not found for this device" },
                { status: 401 }
            );
        }

        // Check if token has expired
        if (new Date() > storedToken.expiresAt) {
            await RefreshToken.deleteOne({ _id: storedToken._id });
            return NextResponse.json(
                { error: "Refresh token expired" },
                { status: 401 }
            );
        }

        // Verify the refresh token
        const isValid = await bcrypt.compare(refreshToken, storedToken.token);
        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid refresh token" },
                { status: 401 }
            );
        }

        // Get the user
        const user = await User.findById(userId);
        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Generate new access token
        const newAccessToken = generateAccessToken({
            id: user._id.toString(),
            email: user.email,
            username: user.username,
        });

        // Generate new refresh token and update DB
        const newRefreshToken = generateRefreshToken();
        const newRefreshTokenHash = await bcrypt.hash(newRefreshToken, 12);
        const newRefreshTokenExpiry = new Date();
        newRefreshTokenExpiry.setDate(newRefreshTokenExpiry.getDate() + 30);

        // Update the token for this device
        await RefreshToken.updateOne(
            { _id: storedToken._id },
            {
                token: newRefreshTokenHash,
                expiresAt: newRefreshTokenExpiry,
            }
        );

        return NextResponse.json(
            {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Refresh token error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
