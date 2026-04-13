import { connectDB } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Code from "@/models/codes.model";
import Folder from "@/models/folders.model";
import User from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", message: "No active session found" },
                { status: 401 }
            );
        }

        await connectDB()
        const { id } = await params

        const folder = await Folder.findById(id);

        if (!folder) {
            return NextResponse.json(
                { message: "Folder not found" },
                { status: 404 }
            );
        }

        // Check if user owns this folder
        if (folder.createdBy.toString() !== session.user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        const codes = await Code.find({ folder: id });

        const folders = await Folder.find({ parentFolder: id });

        return NextResponse.json(
            {
                message: "Folder fetched successfully",
                folder,
                codes,
                folders
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Folder fetch error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", message: "No active session found" },
                { status: 401 }
            );
        }

        const { name, description, color = "#3b82f6" } = await request.json()

        if (!name || !description) {
            return NextResponse.json(
                { error: "Bad Request", message: "Name and description are required" },
                { status: 400 }
            );
        }

        await connectDB()
        const { id } = await params

        // Verify parent folder exists and belongs to user
        const parentFolder = await Folder.findById(id);

        if (!parentFolder) {
            return NextResponse.json(
                { message: "Parent folder not found" },
                { status: 404 }
            );
        }

        if (parentFolder.createdBy.toString() !== session.user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        // Create nested folder
        const newFolder = await Folder.create({
            name,
            description,
            parentFolder: id,
            createdBy: session.user.id,
            color,
        })

        return NextResponse.json(
            {
                message: "Folder created successfully",
                folder: newFolder
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

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json(
                { error: "Unauthorized", message: "No active session found" },
                { status: 401 }
            );
        }

        await connectDB()
        const { id } = await params

        const folder = await Folder.findById(id);

        if (!folder) {
            return NextResponse.json(
                { message: "Folder not found" },
                { status: 404 }
            );
        }

        // Check if user owns this folder
        if (folder.createdBy.toString() !== session.user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        // Delete all codes in this folder
        await Code.deleteMany({ folder: id });

        // Delete folder
        await Folder.findByIdAndDelete(id);

        return NextResponse.json(
            {
                message: "Folder deleted successfully"
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Folder delete error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}