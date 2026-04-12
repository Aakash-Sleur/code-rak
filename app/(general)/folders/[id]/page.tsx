"use client"

import { useState, useEffect } from "react"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CustomModal, showNotification } from "@/components/custom"
import { PageLoader } from "@/components/page-loader"
import { IconArrowLeft, IconCodePlus, IconTrash } from "@tabler/icons-react"
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
  const [loading, setLoading] = useState(true)

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
    </div>
  )
}
