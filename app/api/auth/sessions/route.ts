import RefreshToken from "@/models/refresh_token.model";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { generateDeviceId } from "@/lib/device";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Get userId from query params or header
        const userId = request.nextUrl.searchParams.get("userId");
        
        if (!userId) {
            return NextResponse.json(
                { error: "userId is required" },
                { status: 400 }
            );
        }

        // Fetch all active sessions for this user
        const sessions = await RefreshToken.find(
            { userId },
            { token: 0 } // Don't return the actual token hash
        ).sort({ createdAt: -1});

        // Get current device ID
        const currentDeviceId = generateDeviceId(request);

        // Format sessions response
        const formattedSessions = sessions.map((session: any) => ({
            id: session._id.toString(),
            deviceId: session.deviceId,
            deviceName: session.deviceName || "Unknown Device",
            ipAddress: session.ipAddress || "Unknown",
            isCurrent: session.deviceId === currentDeviceId,
            expiresAt: session.expiresAt,
            createdAt: session.createdAt,
        }));

        return NextResponse.json(
            {
                sessions: formattedSessions,
                totalSessions: formattedSessions.length,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Get sessions error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

/**
 * DELETE - Logout from a specific device
 * Pass sessionId in request body to delete that specific session
 */
export async function DELETE(request: NextRequest) {
    try {
        await connectDB();

        const { sessionId, userId } = await request.json();

        if (!sessionId || !userId) {
            return NextResponse.json(
                { error: "sessionId and userId are required" },
                { status: 400 }
            );
        }

        // Delete specific session
        const result = await RefreshToken.deleteOne({
            _id: sessionId,
            userId,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Session not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Session deleted successfully" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Delete session error:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
