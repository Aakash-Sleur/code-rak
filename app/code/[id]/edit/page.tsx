"use client"

import { useState, useEffect } from "react"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Editor from "@monaco-editor/react"
import { FolderExplorer } from "@/components/folder-explorer"
import { CodeMetaModal } from "@/components/code-meta-modal"
import { PageLoader } from "@/components/page-loader"
import { showNotification } from "@/components/custom"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

interface FolderInfo {
  _id: string
  name: string
  description: string
  color: string
}
interface CodeData {
  _id: string
  title: string
  description: string
  code: string
  language: string
  tags: string[]
  version: number
  isPublic: boolean
  folder: FolderInfo
  createdAt: string
}

export default function CodeEditorPage() {
  const { isLoading: authLoading } = useRequireAuth()
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const codeId = params.id as string

  const [codeData, setCodeData] = useState<CodeData>({
    _id: "",
    title: "",
    description: "",
    code: "",
    language: "javascript",
    tags: [],
    version: 0,
    isPublic: false,
    folder: {
      _id: "",
      name: "",
      description: "",
      color: "",
    },
    createdAt: new Date().toISOString(),
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [folderInfo, setFolderInfo] = useState<FolderInfo | null>(null)

  useEffect(() => {
    if (!authLoading && codeId) {
      fetchCode()
    }
  }, [authLoading, codeId])

  const fetchCode = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/codes/${codeId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch code")
      }

      const data = await response.json()
      setCodeData(data.code)

      // Fetch folder information if code has a folder
      if (data.code.folder) {
        try {
          const folderResponse = await fetch(
            `/api/folders/${data.code.folder._id}`
          )
          if (folderResponse.ok) {
            const folderData = await folderResponse.json()
            setFolderInfo(folderData.folder)
          }
        } catch (error) {
          console.error("Error fetching folder info:", error)
          // Don't fail the whole page if folder fetch fails
        }
      }
    } catch (error) {
      showNotification("Error loading code", { type: "error" })
      console.error("Error:", error)
      router.push("/folders")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (
      !codeData.title ||
      !codeData.description ||
      !codeData.code ||
      !codeData.language
    ) {
      showNotification("Please fill in all required fields", { type: "error" })
      return
    }

    try {
      setSaving(true)
      const response = await fetch(`/api/codes/${codeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: codeData.title,
          description: codeData.description,
          code: codeData.code,
          language: codeData.language,
          tags: codeData.tags,
          isPublic: codeData.isPublic,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save code")
      }

      const data = await response.json()
      setCodeData(data.code)
      setHasChanges(false)
      showNotification("Code saved successfully", { type: "success" })
    } catch (error) {
      showNotification("Error saving code", { type: "error" })
      console.error("Error:", error)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading || loading) {
    return <PageLoader fullPage message="Loading code editor..." />
  }

  const handleNavigateToFolder = (folderId: string) => {
    router.push(`/folders/${folderId}`)
  }

  const handleNavigateToFolders = () => {
    router.push("/folders")
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Folder Explorer */}
      {codeData.folder && (
        <FolderExplorer
          folderId={codeData.folder._id}
          currentCodeId={codeId}
          folderName={folderInfo?.name}
        />
      )}

      {/* Main Editor Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card p-4">
          <div className="flex items-center gap-4">
            <Link href="/folders">
              <Button variant="ghost" size="sm" className="gap-2">
                <IconArrowLeft size={18} />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">
                {codeData.title || "Untitled"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {codeData.language} • v{codeData.version}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                Unsaved changes
              </span>
            )}
            <CodeMetaModal
              title={codeData.title}
              description={codeData.description}
              language={codeData.language}
              tags={codeData.tags}
              version={codeData.version}
              isPublic={codeData.isPublic}
              onTitleChange={(title) => {
                setCodeData({ ...codeData, title })
                setHasChanges(true)
              }}
              onDescriptionChange={(description) => {
                setCodeData({ ...codeData, description })
                setHasChanges(true)
              }}
              onLanguageChange={(language) => {
                setCodeData({ ...codeData, language })
                setHasChanges(true)
              }}
              onTagsChange={(tags) => {
                setCodeData({ ...codeData, tags })
                setHasChanges(true)
              }}
              onIsPublicChange={(isPublic) => {
                setCodeData({ ...codeData, isPublic })
                setHasChanges(true)
              }}
              folderInfo={folderInfo}
              onNavigateToFolder={handleNavigateToFolder}
              onNavigateToFolders={handleNavigateToFolders}
            />
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90"
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Editor Container */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Code Editor using Monaco */}
          <Editor
            height="100%"
            language={codeData.language}
            value={codeData.code}
            onChange={(value) => {
              setCodeData({ ...codeData, code: value || "" })
              setHasChanges(true)
            }}
            theme="vs-dark"
            options={{
              minimap: { enabled: true },
              fontSize: 14,
              lineHeight: 1.5,
              tabSize: 4,
              insertSpaces: true,
              formatOnPaste: true,
              formatOnType: true,
              autoClosingBrackets: "always",
              autoClosingQuotes: "always",
              scrollBeyondLastLine: false,
              padding: { top: 16, bottom: 16 },
            }}
          />
        </div>

        {/* Footer Stats */}
        <div className="flex justify-between border-t border-border bg-card px-6 py-3 text-xs text-muted-foreground">
          <span>
            Lines: {codeData.code.split("\n").length} | Characters:{" "}
            {codeData.code.length}
          </span>
          <span>
            Language: <strong>{codeData.language}</strong> • Status:{" "}
            <strong>{codeData.isPublic ? "🌐 Public" : "🔒 Private"}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
