"use client"

import { useState, useEffect } from "react"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CustomModal, showNotification, CustomInput } from "@/components/custom"
import { PageLoader } from "@/components/page-loader"
import { IconArrowLeft, IconCodePlus, IconTrash, IconFolderPlus, IconArrowRight } from "@tabler/icons-react"
import Link from "next/link"

interface Folder {
  _id: string
  name: string
  description: string
  color: string
  createdAt: string
}

interface Code {
  _id: string
  title: string
  description: string
  language: string
  code: string
  createdAt: string
}

export default function FolderDetailPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const params = useParams()
  const router = useRouter()
  const folderId = params.id as string

  const [folder, setFolder] = useState<Folder | null>(null)
  const [codes, setCodes] = useState<Code[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [loading, setLoading] = useState(true)
  const [createFolderModalOpen, setCreateFolderModalOpen] = useState(false)
  const [folderFormData, setFolderFormData] = useState({
    name: "",
    description: "",
    color: "#3b82f6",
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!authLoading && folderId) {
      fetchFolder()
    }
  }, [authLoading, folderId])

  const fetchFolder = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/folders/${folderId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch folder")
      }

      const data = await response.json()
      setFolder(data.folder)
      setCodes(data.codes || [])
      setFolders(data.folders || [])
    } catch (error) {
      showNotification("Error loading folder", { type: "error" })
      console.error("Error:", error)
      router.push("/folders")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCode = async (codeId: string) => {
    if (!confirm("Are you sure you want to delete this code?")) {
      return
    }

    try {
      const response = await fetch(`/api/codes/${codeId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete code")
      }

      setCodes(codes.filter((c) => c._id !== codeId))
      showNotification("Code deleted successfully", { type: "success" })
    } catch (error) {
      showNotification("Error deleting code", { type: "error" })
      console.error("Error:", error)
    }
  }

  const handleCreateFolder = async () => {
    if (!folderFormData.name.trim() || !folderFormData.description.trim()) {
      showNotification("Please fill in all fields", { type: "error" })
      return
    }

    try {
      setSubmitting(true)
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(folderFormData),
      })

      if (!response.ok) {
        throw new Error("Failed to create folder")
      }

      const data = await response.json()
      setFolders([...folders, data.folder])
      setFolderFormData({ name: "", description: "", color: "#3b82f6" })
      setCreateFolderModalOpen(false)
      showNotification("Nested folder created successfully", { type: "success" })
    } catch (error) {
      showNotification("Error creating folder", { type: "error" })
      console.error("Error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm("Are you sure you want to delete this folder and all its contents?")) {
      return
    }

    try {
      const response = await fetch(`/api/folders/${folderId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete folder")
      }

      setFolders(folders.filter((f) => f._id !== folderId))
      showNotification("Folder deleted successfully", { type: "success" })
    } catch (error) {
      showNotification("Error deleting folder", { type: "error" })
      console.error("Error:", error)
    }
  }

  if (authLoading || loading) {
    return <PageLoader fullPage message="Loading folder..." />
  }

  if (!folder) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Folder not found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/folders">
            <Button variant="ghost" size="sm" className="gap-2">
              <IconArrowLeft size={18} />
              Back
            </Button>
          </Link>
          <div
            className="h-8 w-4 rounded"
            style={{ backgroundColor: folder.color }}
          />
          <div>
            <h1 className="text-2xl font-bold">{folder.name}</h1>
            <p className="text-sm text-muted-foreground">
              {folder.description}
            </p>
          </div>
        </div>
        <Link href={`/code/create?folderId=${folderId}`}>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <IconCodePlus size={18} />
            Add Code
          </Button>
        </Link>
      </div>

      {/* Nested Folders Section */}
      {folders.length > 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Folders</h2>
            <Button
              onClick={() => setCreateFolderModalOpen(true)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <IconFolderPlus size={16} />
              Add Folder
            </Button>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {folders.map((nestedFolder) => (
              <div
                key={nestedFolder._id}
                className="group rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div
                  className="absolute left-0 top-0 h-8 w-1 rounded-tl-lg"
                  style={{ backgroundColor: nestedFolder.color }}
                />
                <div className="pl-2">
                  <h3 className="line-clamp-1 font-semibold text-foreground">
                    {nestedFolder.name}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                    {nestedFolder.description}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-2">
                  <p className="text-xs text-muted-foreground">
                    {new Date(nestedFolder.createdAt).toLocaleDateString()}
                  </p>
                  <div className="flex gap-1">
                    <Link href={`/folders/${nestedFolder._id}`}>
                      <Button variant="ghost" size="sm">
                        <IconArrowRight size={14} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFolder(nestedFolder._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <IconTrash size={14} />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Folder Button (when no folders) */}
      {folders.length === 0 && (
        <div className="flex items-center gap-4 rounded-lg border border-border bg-muted/30 p-4">
          <IconFolderPlus size={24} className="text-muted-foreground" />
          <div className="flex-1">
            <p className="font-medium">No nested folders</p>
            <p className="text-sm text-muted-foreground">Create a folder to organize your code</p>
          </div>
          <Button
            onClick={() => setCreateFolderModalOpen(true)}
            size="sm"
            className="gap-2"
          >
            <IconFolderPlus size={16} />
            Create Folder
          </Button>
        </div>
      )}

      {/* Codes List */}
      {codes.length === 0 ? (
        <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
          <div className="text-center">
            <IconCodePlus
              size={48}
              className="mx-auto mb-3 text-muted-foreground"
            />
            <p className="text-muted-foreground">No codes in this folder</p>
            <p className="text-sm text-muted-foreground">
              Add your first code snippet to get started
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          <h2 className="text-lg font-semibold">Code Snippets</h2>
          {codes.map((code) => (
            <div
              key={code._id}
              className="rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {code.title}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {code.description}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <span className="rounded bg-primary/10 px-2 py-1 text-xs text-primary">
                      {code.language}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(code.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href={`/code/${code._id}/edit`}>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCode(code._id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <IconTrash size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Folder Modal */}
      <CustomModal
        open={createFolderModalOpen}
        onOpenChange={setCreateFolderModalOpen}
        title="Create Nested Folder"
        description="Add a new folder to organize your code"
      >
        <div className="space-y-4">
          <CustomInput
            placeholder="Folder name"
            value={folderFormData.name}
            onChange={(e) =>
              setFolderFormData({ ...folderFormData, name: e.target.value })
            }
          />
          <CustomInput
            placeholder="Description"
            value={folderFormData.description}
            onChange={(e) =>
              setFolderFormData({
                ...folderFormData,
                description: e.target.value,
              })
            }
          />
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium">Color:</label>
            <input
              type="color"
              value={folderFormData.color}
              onChange={(e) =>
                setFolderFormData({ ...folderFormData, color: e.target.value })
              }
              className="h-10 w-12 cursor-pointer rounded border border-border"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button
              onClick={() => setCreateFolderModalOpen(false)}
              variant="outline"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateFolder}
              disabled={submitting}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
            >
              {submitting ? "Creating..." : "Create Folder"}
            </Button>
          </div>
        </div>
      </CustomModal>
    </div>
  )
}
