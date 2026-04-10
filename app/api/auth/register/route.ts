import bcrypt from "bcrypt";
import User from "@/models/user.model";
import RefreshToken from "@/models/refresh_token.model";
import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken, generateRefreshToken } from "@/lib/token";
import { connectDB } from "@/lib/db";
import { generateDeviceId, getDeviceName, getClientIp } from "@/lib/device";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { email, username, password, confirmPassword } = await request.json();

        // Validation
        if (!email || !username || !password || !confirmPassword) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        if (password !== confirmPassword) {
            return NextResponse.json(
                { message: "Passwords do not match" },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { message: "Password must be at least 6 characters" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }],
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User with this email or username already exists" },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = await User.create({
            email,
            username,
            password: hashedPassword,
            isVerified: false,
        });

        // Generate access token
        const accessToken = generateAccessToken({
            id: newUser._id.toString(),
            email: newUser.email,
            username: newUser.username,
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

        // Store refresh token in DB with device info
        await RefreshToken.create({
            userId: newUser._id,
            token: refreshTokenHash,
            expiresAt: refreshTokenExpiry,
            deviceId,
            deviceName,
            ipAddress,
            userAgent,
        });

        return NextResponse.json(
            {
                message: "User registered successfully",
                user: {
                    id: newUser._id.toString(),
                    email: newUser.email,
                    username: newUser.username,
                    isVerified: newUser.isVerified,
                },
                accessToken,
                refreshToken,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Register error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
