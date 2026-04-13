"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { IconChevronDown, IconChevronRight, IconFile, IconFolder as IconFolderIcon } from "@tabler/icons-react"
import { MoveCodeModal } from "@/components/move-code-modal"
import { cn } from "@/lib/utils"

interface CodeItem {
  _id: string
  title: string
  language: string
}

interface FolderItem {
  _id: string
  name: string
  color: string
}

interface FolderContent {
  codes: CodeItem[]
  folders: FolderItem[]
}

interface FolderExplorerProps {
  folderId: string
  currentCodeId: string
  folderName?: string
}

interface ExpandedState {
  [folderId: string]: boolean
}

export function FolderExplorer({ folderId, currentCodeId, folderName }: FolderExplorerProps) {
  const [folderContents, setFolderContents] = useState<Map<string, FolderContent>>(new Map())
  const [expandedFolders, setExpandedFolders] = useState<ExpandedState>({
    [folderId]: true,
  })
  const [loading, setLoading] = useState(true)
  const [hoveredCodeId, setHoveredCodeId] = useState<string | null>(null)

  useEffect(() => {
    fetchFolderContents(folderId)
  }, [folderId])

  const fetchFolderContents = async (folderIdToFetch: string) => {
    try {
      const response = await fetch(`/api/folders/${folderIdToFetch}`)

      if (!response.ok) {
        throw new Error("Failed to fetch folder contents")
      }

      const data = await response.json()
      setFolderContents((prev) => new Map(prev).set(folderIdToFetch, {
        codes: data.codes || [],
        folders: data.folders || [],
      }))
    } catch (error) {
      console.error("Error fetching folder contents:", error)
      setFolderContents((prev) => new Map(prev).set(folderIdToFetch, {
        codes: [],
        folders: [],
      }))
    } finally {
      if (folderIdToFetch === folderId) {
        setLoading(false)
      }
    }
  }

  const toggleFolder = async (folderIdToToggle: string) => {
    const newExpanded = {
      ...expandedFolders,
      [folderIdToToggle]: !expandedFolders[folderIdToToggle],
    }
    setExpandedFolders(newExpanded)

    // Fetch contents if not already fetched
    if (!folderContents.has(folderIdToToggle)) {
      await fetchFolderContents(folderIdToToggle)
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

  const FolderTreeNode = ({ 
    folder, 
    level = 0 
  }: { 
    folder: FolderItem
    level?: number 
  }) => {
    const isExpanded = expandedFolders[folder._id]
    const contents = folderContents.get(folder._id)
    const hasChildren = contents && (contents.codes.length > 0 || contents.folders.length > 0)

    return (
      <div key={folder._id} className="select-none">
        <button
          onClick={() => toggleFolder(folder._id)}
          className={cn(
            "flex items-center gap-1 w-full px-3 py-1.5 rounded text-sm transition-colors hover:bg-muted",
            "text-muted-foreground hover:text-foreground"
          )}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          {hasChildren || contents?.folders.length ? (
            isExpanded ? (
              <IconChevronDown size={14} className="flex-shrink-0" />
            ) : (
              <IconChevronRight size={14} className="flex-shrink-0" />
            )
          ) : (
            <div className="w-3.5" />
          )}
          <div
            className="w-3 h-3 rounded flex-shrink-0"
            style={{ backgroundColor: folder.color }}
            title={folder.name}
          />
          <span className="truncate text-xs">{folder.name}</span>
        </button>

        {isExpanded && contents && (
          <>
            {/* Nested Folders */}
            {contents.folders.map((nestedFolder) => (
              <FolderTreeNode
                key={nestedFolder._id}
                folder={nestedFolder}
                level={level + 1}
              />
            ))}

            {/* Files in this folder */}
            {contents.codes.map((code) => (
              <div
                key={code._id}
                className="flex items-center group"
                onMouseEnter={() => setHoveredCodeId(code._id)}
                onMouseLeave={() => setHoveredCodeId(null)}
              >
                <Link
                  href={`/code/${code._id}/edit`}
                  className={cn(
                    "flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors",
                    currentCodeId === code._id
                      ? "bg-primary/20 text-primary font-semibold"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                  style={{ paddingLeft: `${12 + (level + 1) * 16}px` }}
                  title={code.title}
                >
                  <span>{getLanguageIcon(code.language)}</span>
                  <span className="truncate flex-1">{code.title}</span>
                </Link>
                {hoveredCodeId === code._id && (
                  <div className="flex-shrink-0">
                    <MoveCodeModal
                      codeId={code._id}
                      currentFolderId={folderId}
                      codeName={code.title}
                    />
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    )
  }

  const rootContents = folderContents.get(folderId)

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-border">
        <button
          onClick={() => toggleFolder(folderId)}
          className={cn(
            "flex items-center gap-2 w-full hover:bg-muted p-2 rounded transition-colors",
            "text-foreground"
          )}
        >
          {expandedFolders[folderId] ? (
            <IconChevronDown size={16} className="flex-shrink-0" />
          ) : (
            <IconChevronRight size={16} className="flex-shrink-0" />
          )}
          <IconFolderIcon size={16} className="flex-shrink-0" />
          <span className="font-semibold text-sm truncate">{folderName || "Folder"}</span>
        </button>
      </div>

      {/* Tree Content */}
      {expandedFolders[folderId] && (
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <span className="text-xs text-muted-foreground">Loading...</span>
            </div>
          ) : rootContents && (rootContents.codes.length > 0 || rootContents.folders.length > 0) ? (
            <div className="py-1">
              {/* Nested Folders */}
              {rootContents.folders.map((folder) => (
                <FolderTreeNode key={folder._id} folder={folder} level={0} />
              ))}

              {/* Root level files */}
              {rootContents.codes.map((code) => (
                <div
                  key={code._id}
                  className="flex items-center group mx-2 my-0.5 rounded hover:bg-muted"
                  onMouseEnter={() => setHoveredCodeId(code._id)}
                  onMouseLeave={() => setHoveredCodeId(null)}
                >
                  <Link
                    href={`/code/${code._id}/edit`}
                    className={cn(
                      "flex-1 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors",
                      currentCodeId === code._id
                        ? "bg-primary/20 text-primary font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                    title={code.title}
                  >
                    <span>{getLanguageIcon(code.language)}</span>
                    <span className="truncate flex-1">{code.title}</span>
                  </Link>
                  {hoveredCodeId === code._id && (
                    <div className="flex-shrink-0">
                      <MoveCodeModal
                        codeId={code._id}
                        currentFolderId={folderId}
                        codeName={code.title}
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-8">
              <span className="text-xs text-muted-foreground">No files or folders</span>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
