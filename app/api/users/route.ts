import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

export async function GET() {
    try {
        await connectDB()

        const users = await User.find()

        return NextResponse.json({
            success: true,
            data: users
        })
    } catch (error) {
        return NextResponse.json(
            { success: false, message: "Failed to fetch users"},
            { status: 500 }
        )
    }
}