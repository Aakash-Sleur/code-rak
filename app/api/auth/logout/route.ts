import RefreshToken from "@/models/refresh_token.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateDeviceId } from "@/lib/device";

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const { userId, logoutAllDevices } = await request.json();

        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        if (logoutAllDevices) {
            // Logout from ALL devices - delete all refresh tokens for this user
            await RefreshToken.deleteMany({ userId });
            return NextResponse.json(
                { message: "Logged out from all devices" },
                { status: 200 }
            );
        } else {
            // Logout from current device only
            const deviceId = generateDeviceId(request);
            const result = await RefreshToken.deleteOne({ userId, deviceId });
            
            if (result.deletedCount === 0) {
                return NextResponse.json(
                    { error: "No active session found for this device" },
                    { status: 404 }
                );
            }

            return NextResponse.json(
                { message: "Logged out successfully" },
                { status: 200 }
            );
        }
    } catch (error) {
        console.error("Logout error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
