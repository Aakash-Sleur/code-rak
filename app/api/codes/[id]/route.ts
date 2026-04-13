import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import "@/models/user.model";
import "@/models/folders.model";
import Code from "@/models/codes.model";

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

        const code = await Code.findById(id).populate("folder").populate("createdBy", "username email");

        if (!code) {
            return NextResponse.json(
                { message: "Code not found" },
                { status: 404 }
            );
        }

        // Check if user owns this code
        if (code.createdBy._id.toString() !== session.user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        return NextResponse.json(
            {
                message: "Code fetched successfully",
                code
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Code fetch error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}

export async function PUT(
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

        const { title, description, code, language, tags, isPublic, folder } = await request.json()

        await connectDB()
        const { id } = await params

        const existingCode = await Code.findById(id);

        if (!existingCode) {
            return NextResponse.json(
                { message: "Code not found" },
                { status: 404 }
            );
        }

        // Check if user owns this code
        if (existingCode.createdBy.toString() !== session.user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        // If moving to a different folder, verify ownership of target folder
        if (folder && folder !== existingCode.folder?.toString()) {
            const Folder = require("@/models/folders.model").default;
            const targetFolder = await Folder.findById(folder);

            if (!targetFolder) {
                return NextResponse.json(
                    { message: "Target folder not found" },
                    { status: 404 }
                );
            }

            if (targetFolder.createdBy.toString() !== session.user.id) {
                return NextResponse.json(
                    { message: "Unauthorized - Cannot move to this folder" },
                    { status: 403 }
                );
            }
        }

        // Update code
        const updatedCode = await Code.findByIdAndUpdate(
            id,
            {
                title: title || existingCode.title,
                description: description || existingCode.description,
                code: code || existingCode.code,
                language: language || existingCode.language,
                tags: tags !== undefined ? tags : existingCode.tags,
                isPublic: isPublic !== undefined ? isPublic : existingCode.isPublic,
                folder: folder !== undefined ? folder : existingCode.folder,
                version: existingCode.version + 1,
            },
            { new: true }
        ).populate("folder").populate("createdBy", "username email");

        return NextResponse.json(
            {
                message: "Code updated successfully",
                code: updatedCode
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Code update error:", error);
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

        const code = await Code.findById(id);

        if (!code) {
            return NextResponse.json(
                { message: "Code not found" },
                { status: 404 }
            );
        }

        // Check if user owns this code
        if (code.createdBy.toString() !== session.user.id) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 403 }
            );
        }

        await Code.findByIdAndDelete(id);

        return NextResponse.json(
            {
                message: "Code deleted successfully"
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Code delete error:", error);
        return NextResponse.json(
            {
                error: "Internal Server Error",
                message: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
