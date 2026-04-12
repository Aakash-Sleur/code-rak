"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconChevronDown, IconChevronRight, IconFile, IconFolder as IconFolderIcon } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface CodeItem {
  _id: string
  title: string
  language: string
}

interface FolderExplorerProps {
  folderId: string
  currentCodeId: string
  folderName?: string
}

export function FolderExplorer({ folderId, currentCodeId, folderName }: FolderExplorerProps) {
  const [codes, setCodes] = useState<CodeItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(true)

  useEffect(() => {
    fetchFolderContents()
  }, [folderId])

  const fetchFolderContents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/folders/${folderId}`)

      if (!response.ok) {
        throw new Error("Failed to fetch folder contents")
      }

      const data = await response.json()
      setCodes(data.codes || [])
    } catch (error) {
      console.error("Error fetching folder contents:", error)
      setCodes([])
    } finally {
      setLoading(false)
    }
  }

  const getLanguageIcon = (language: string) => {
    const icons: Record<string, string> = {
      javascript: "📜",
      typescript: "📘",
      python: "🐍",
      java: "☕",
      cpp: "⚙️",
      csharp: "🛡️",
      go: "🐹",
      rust: "🦀",
      php: "🐘",
      ruby: "💎",
      sql: "🗄️",
      html: "🌐",
      css: "🎨",
      json: "📋",
      xml: "📦",
      yaml: "📄",
      bash: "⌨️",
      markdown: "📝",
    }
    return icons[language] || "📄"
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 w-full hover:bg-muted p-2 rounded transition-colors"
        >
          {expanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
          <IconFolderIcon size={16} />
          <span className="font-semibold text-sm truncate">{folderName || "Folder"}</span>
        </button>
      </div>

      {/* Files List */}
      {expanded && (
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-xs text-muted-foreground">Loading...</span>
            </div>
          ) : codes.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-xs text-muted-foreground">No files in folder</span>
            </div>
          ) : (
            <div className="space-y-1">
              {codes.map((code) => (
                <Link
                  key={code._id}
                  href={`/code/${code._id}/edit`}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
                    currentCodeId === code._id
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  title={code.title}
                >
                  <span className="text-sm">{getLanguageIcon(code.language)}</span>
                  <span className="truncate flex-1">{code.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
