import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Folder from "@/models/folders.model";
import User from "@/models/user.model";

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)

        const { name, description, color = "#3b82f6", isPublic = false } = await request.json()

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", message: "No active session found" },
                { status: 401 }
            );
        }

        if (!name || !description) {
            return NextResponse.json(
                { error: "Bad Request", message: "Name and description are required" },
                { status: 400 }
            );
        }

        await connectDB()

        const folder = await Folder.create({
            name,
            description,
            createdBy: session.user.id,
            color,
            isPublic
        })

        return NextResponse.json(
            {
                message: "Folder created successfully",
                folder,
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Folder creation error:", error);
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

        const folders = await Folder.find({ createdBy: session.user.id })

        return NextResponse.json(
            {
                message: "Folders fetched successfully",
                folders
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Folders fetch error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}