import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized", message: "No active session found" },
        { status: 401 }
      );
    }

    // Extract all available JWT token values
    const tokenInfo = {
      user: {
        id: session.user?.id || "N/A",
        email: session.user?.email || "N/A",
        name: session.user?.username || "N/A",
        phone: session.user?.phone || "N/A",
        username: (session.user as any)?.username || "N/A",
        isVerfied: (session.user as any)?.isVerfied || false,
      },
      tokens: {
        accessToken: (session as any)?.accessToken
          ? `${(session as any).accessToken.substring(0, 20)}...${(session as any).accessToken.substring((session as any).accessToken.length - 20)}`
          : "N/A",
        accessTokenType: typeof (session as any)?.accessToken,
      },
      metadata: {
        expires: session?.expires || "N/A",
        sessionCreatedAt: new Date().toISOString(),
      },
    };

    return NextResponse.json(
      {
        success: true,
        message: "JWT Token values available in session",
        data: tokenInfo,
        availableFields: {
          "user.id": "Unique user identifier",
          "user.email": "User email address",
          "user.name": "User's full name",
          "user.image": "User profile image URL",
          "user.username": "User's username",
          "user.isVerfied": "Email verification status",
          "tokens.accessToken": "JWT access token (truncated)",
          "metadata.expires": "Session expiration timestamp",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Token info error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
