import { authOptions } from "@/lib/auth";
import bcrypt from "bcrypt"
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import RefreshToken from "@/models/refresh_token.model";
import { generateAccessToken, generateRefreshToken } from "@/lib/token";
import { connectDB } from "@/lib/db";
import { generateDeviceId, getDeviceName, getClientIp } from "@/lib/device";

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            )
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 400 }
            )
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 403 }
            )
        }

        // Generate access token
        const accessToken = generateAccessToken({
            id: user._id.toString(),
            email: user.email,
            username: user.username,
        });

        // Get device information
        const deviceId = generateDeviceId(request);
        const userAgent = request.headers.get("user-agent");
        const deviceName = getDeviceName(userAgent);
        const ipAddress = getClientIp(request);

        // Generate refresh token
        const refreshToken = generateRefreshToken();
        const refreshTokenHash = await bcrypt.hash(refreshToken, 12);
        const refreshTokenExpiry = new Date();
        refreshTokenExpiry.setDate(refreshTokenExpiry.getDate() + 30);

        // Delete old token for this device if exists (device re-login)
        // This ensures only one active token per device per user
        await RefreshToken.deleteOne({ userId: user._id, deviceId });

        // Store refresh token in DB with device info
        await RefreshToken.create({
            userId: user._id,
            token: refreshTokenHash,
            expiresAt: refreshTokenExpiry,
            deviceId,
            deviceName,
            ipAddress,
            userAgent,
        })

        const result = {
            id: user._id.toString(),
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            accessToken,
            refreshToken,
        }

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}