"use client"

import { useState, useEffect } from "react"
import { useRequireAuth } from "@/hooks/use-require-auth"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import Editor from "@monaco-editor/react"
import { CodeEditorSidebar } from "@/components/code-editor-sidebar"
import { PageLoader } from "@/components/page-loader"
import { showNotification } from "@/components/custom"
import { Button } from "@/components/ui/button"
import { IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface CodeData {
  title: string
  description: string
  code: string
  language: string
  tags: string[]
  isPublic: boolean
  folderId: string
}

export default function CodeCreatePage() {
  const { isLoading: authLoading } = useRequireAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const folderId = searchParams.get("folderId") || ""

  const [codeData, setCodeData] = useState<CodeData>({
    title: "",
    description: "",
    code: "",
    language: "javascript",
    tags: [],
    isPublic: false,
    folderId: folderId,
  })

  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!folderId && !authLoading) {
      showNotification("Please select a folder first", { type: "error" })
      router.push("/folders")
    }
  }, [authLoading, folderId, router])

  const handleCreate = async () => {
    if (!codeData.title || !codeData.description || !codeData.code || !codeData.language || !codeData.folderId) {
      showNotification("Please fill in all required fields", { type: "error" })
      return
    }

    try {
      setSaving(true)
      const response = await fetch("/api/codes", {
        method: "POST",
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
          folderId: codeData.folderId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to create code")
      }

      const data = await response.json()
      showNotification("Code created successfully", { type: "success" })
      router.push(`/code/${data.code._id}/edit`)
    } catch (error) {
      showNotification("Error creating code", { type: "error" })
      console.error("Error:", error)
    } finally {
      setSaving(false)
    }
  }

  if (authLoading) {
    return <PageLoader fullPage message="Loading..." />
  }

  if (!folderId) {
    return null
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <CodeEditorSidebar
        title={codeData.title}
        description={codeData.description}
        language={codeData.language}
        tags={codeData.tags}
        version={1}
        isPublic={codeData.isPublic}
        isOpen={sidebarOpen}
        onToggle={setSidebarOpen}
        onTitleChange={(title) => setCodeData({ ...codeData, title })}
        onDescriptionChange={(description) => setCodeData({ ...codeData, description })}
        onLanguageChange={(language) => setCodeData({ ...codeData, language })}
        onTagsChange={(tags) => setCodeData({ ...codeData, tags })}
        onIsPublicChange={(isPublic) => setCodeData({ ...codeData, isPublic })}
        onSave={handleCreate}
        isSaving={saving}
      />

      {/* Main Editor Area */}
      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "ml-[30%] md:ml-80" : "ml-0"
        )}
      >
        {/* Header */}
        <div className="border-b border-border bg-card p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={`/folders/${codeData.folderId}`}>
              <Button variant="ghost" size="sm" className="gap-2">
                <IconArrowLeft size={18} />
                Back
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-semibold">{codeData.title || "New Code"}</h1>
              <p className="text-xs text-muted-foreground">{codeData.language} • v1</p>
            </div>
          </div>
          <Button
            onClick={handleCreate}
            disabled={saving}
            className="bg-primary hover:bg-primary/90"
          >
            {saving ? "Creating..." : "Create Code"}
          </Button>
        </div>

        {/* Editor Container */}
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Code Editor using Monaco */}
          <Editor
            height="100%"
            language={codeData.language}
            value={codeData.code}
            onChange={(value) => setCodeData({ ...codeData, code: value || "" })}
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
        <div className="border-t border-border bg-card px-6 py-3 text-xs text-muted-foreground flex justify-between">
          <span>Lines: {codeData.code.split("\n").length} | Characters: {codeData.code.length}</span>
          <span>
            Language: <strong>{codeData.language}</strong> • Status:{" "}
            <strong>{codeData.isPublic ? "🌐 Public" : "🔒 Private"}</strong>
          </span>
        </div>
      </div>
    </div>
  )
}
