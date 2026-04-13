"use client"

import { useState, useEffect } from "react"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { CustomModal, showNotification } from "@/components/custom"
import { CustomInput } from "@/components/custom"
import { PageLoader } from "@/components/page-loader"
import { FolderGridDnd } from "@/components/folder-grid-dnd"
import { IconFolderPlus } from "@tabler/icons-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface Folder {
  _id: string
  name: string
  description: string
  color: string
  createdAt: string
}

export default function FoldersPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const { data: session } = useSession()
  const router = useRouter()

  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading) {
      fetchFolders()
    }
  }, [authLoading])

  const fetchFolders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/folders", {
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch folders")
      }

      const data = await response.json()
      setFolders(data.folders || [])
    } catch (error) {
      showNotification("Error fetching folders", { type: "error" })
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateFolder = async () => {
    if (!formData.name.trim() || !formData.description.trim()) {
      showNotification("Please fill in all fields", { type: "error" })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch("/api/folders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to create folder")
      }

      const data = await response.json()
      setFolders([...folders, data.folder])
      setFormData({ name: "", description: "", color: "#3b82f6" })
      setCreateModalOpen(false)
      showNotification("Folder created successfully", { type: "success" })
    } catch (error) {
      showNotification("Error creating folder", { type: "error" })
      console.error("Error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteFolder = async (id: string) => {
    if (!confirm("Are you sure you want to delete this folder?")) {
      return
    }

    try {
      const response = await fetch(`/api/folders/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete folder")
      }

      setFolders(folders.filter((f) => f._id !== id))
      showNotification("Folder deleted successfully", { type: "success" })
    } catch (error) {
      showNotification("Error deleting folder", { type: "error" })
      console.error("Error:", error)
    }
  }

  if (authLoading || loading) {
    return <PageLoader fullPage message="Loading folders..." />
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Folders</h1>
          <p className="text-sm text-muted-foreground">
            Organize your code snippets into folders
          </p>
        </div>
        <Button
          onClick={() => setCreateModalOpen(true)}
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <IconFolderPlus size={18} />
          Create Folder
        </Button>
      </div>

      {/* Folders Grid with Drag & Drop */}
      {folders.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
          <div className="text-center">
            <IconFolderPlus
              size={48}
              className="mx-auto mb-3 text-muted-foreground"
            />
            <p className="text-muted-foreground">No folders yet</p>
            <p className="text-sm text-muted-foreground">
              Create your first folder to get started
            </p>
          </div>
        </div>
      ) : (
        <FolderGridDnd
          folders={folders}
          onDelete={handleDeleteFolder}
          onReorder={(reorderedFolders) => {
            setFolders(reorderedFolders)
          }}
        />
      )}

      {/* Create Folder Modal */}
      <CustomModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        title="Create New Folder"
        description="Create a new folder to organize your code snippets"
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setCreateModalOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={submitting}
              className="bg-primary hover:bg-primary/90"
            >
              {submitting ? "Creating..." : "Create"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Folder Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Folder Name</label>
            <CustomInput
              placeholder="e.g., React Components"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={submitting}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Describe what this folder contains..."
              className="h-24 w-full resize-none rounded-md border border-border bg-background px-3 py-2 text-sm transition-colors hover:border-border/80 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={submitting}
            />
          </div>

          {/* Color Picker */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Color</label>
            <div className="flex gap-2">
              {[
                "#3b82f6",
                "#ef4444",
                "#10b981",
                "#f59e0b",
                "#8b5cf6",
                "#ec4899",
              ].map((color) => (
                <button
                  key={color}
                  onClick={() => setFormData({ ...formData, color })}
                  className={`h-8 w-8 rounded-full ring-2 transition-all ${
                    formData.color === color ? "ring-foreground" : "ring-border"
                  }`}
                  style={{ backgroundColor: color }}
                  disabled={submitting}
                />
              ))}
            </div>
          </div>
        </div>
      </CustomModal>
    </div>
  )
}
