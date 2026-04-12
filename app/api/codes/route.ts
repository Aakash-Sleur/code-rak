import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import "@/models/user.model";
import "@/models/folders.model";
import Code from "@/models/codes.model";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", message: "No active session found" },
                { status: 401 }
            );
        }

        const { title, description, code, language, folderId, tags = [], isPublic = false } = await request.json()

        if (!title || !description || !code || !language || !folderId) {
            return NextResponse.json(
                { error: "Bad Request", message: "Missing required fields" },
                { status: 400 }
            );
        }

        await connectDB()

        const newCode = await Code.create({
            title,
            description,
            code,
            language,
            folder: folderId,
            createdBy: session.user.id,
            tags,
            isPublic,
            version: 1,
        })

        // Populate folder information
        const populatedCode = await Code.findById(newCode._id).populate("folder").populate("createdBy", "username email")

        return NextResponse.json(
            {
                message: "Code created successfully",
                code: populatedCode,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Code creation error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", message: "No active session found" },
                { status: 401 }
            );
        }

        await connectDB()

        const codes = await Code.find({ createdBy: session.user.id }).populate("folder").populate("createdBy", "username email")

        return NextResponse.json(
            {
                message: "Codes fetched successfully",
                codes
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Codes fetch error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
