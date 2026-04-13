"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { showNotification } from "@/components/custom"
import { IconChevronDown, IconChevronRight, IconFolderOpen } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface FolderStructure {
  _id: string
  name: string
  color: string
  folders?: FolderStructure[]
}

interface MoveCodeModalProps {
  codeId: string
  currentFolderId?: string
  codeName: string
  onMove?: (newFolderId?: string) => void
}

interface ExpandedFolders {
  [folderId: string]: boolean
}

export function MoveCodeModal({
  codeId,
  currentFolderId,
  codeName,
  onMove,
}: MoveCodeModalProps) {
  const [open, setOpen] = useState(false)
  const [folders, setFolders] = useState<FolderStructure[]>([])
  const [expandedFolders, setExpandedFolders] = useState<ExpandedFolders>({})
  const [loading, setLoading] = useState(false)
  const [selectedFolderId, setSelectedFolderId] = useState<string | undefined>(
    currentFolderId
  )

  useEffect(() => {
    if (open) {
      fetchFolders()
    }
  }, [open])

  const fetchFolders = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/folders")

      if (!response.ok) {
        throw new Error("Failed to fetch folders")
      }

      const data = await response.json()
      // Build nested folder structure
      const folderMap = new Map<string, FolderStructure>()
      const rootFolders: FolderStructure[] = []

      // Initialize all folders
      data.folders.forEach((folder: any) => {
        folderMap.set(folder._id, {
          _id: folder._id,
          name: folder.name,
          color: folder.color,
          folders: [],
        })
      })

      // Build parent-child relationships
      data.folders.forEach((folder: any) => {
        const folderNode = folderMap.get(folder._id)!
        if (folder.parentFolder) {
          const parentNode = folderMap.get(folder.parentFolder)
          if (parentNode) {
            parentNode.folders?.push(folderNode)
          }
        } else {
          rootFolders.push(folderNode)
        }
      })

      setFolders(rootFolders)
      // Expand all root folders by default
      const expanded: ExpandedFolders = {}
      rootFolders.forEach((folder) => {
        expanded[folder._id] = true
      })
      setExpandedFolders(expanded)
    } catch (error) {
      showNotification("Error fetching folders", { type: "error" })
      console.error("Error:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleFolderExpand = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const handleMove = async () => {
    if (selectedFolderId === currentFolderId) {
      showNotification("Please select a different folder", { type: "error" })
      return
    }

    try {
      const response = await fetch(`/api/codes/${codeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          folder: selectedFolderId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to move code")
      }

      showNotification("Code moved successfully", { type: "success" })
      setOpen(false)
      onMove?.(selectedFolderId)
    } catch (error) {
      showNotification("Error moving code", { type: "error" })
      console.error("Error:", error)
    }
  }

  const FolderTreeNode = ({
    folder,
    level = 0,
  }: {
    folder: FolderStructure
    level?: number
  }) => {
    const isExpanded = expandedFolders[folder._id]
    const hasChildren = (folder.folders?.length || 0) > 0

    return (
      <div key={folder._id}>
        <button
          onClick={() => {
            setSelectedFolderId(folder._id)
            if (hasChildren) {
              toggleFolderExpand(folder._id)
            }
          }}
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition-colors",
            selectedFolderId === folder._id
              ? "bg-primary/20 text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          style={{ paddingLeft: `${12 + level * 16}px` }}
        >
          <div className="w-4">
            {hasChildren ? (
              isExpanded ? (
                <IconChevronDown size={14} />
              ) : (
                <IconChevronRight size={14} />
              )
            ) : (
              <div />
            )}
          </div>
          <div
            className="w-3 h-3 rounded flex-shrink-0"
            style={{ backgroundColor: folder.color }}
          />
          <span className="truncate flex-1">{folder.name}</span>
        </button>

        {isExpanded && hasChildren && (
          <div>
            {folder.folders?.map((nestedFolder) => (
              <FolderTreeNode
                key={nestedFolder._id}
                folder={nestedFolder}
                level={level + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="ghost" size="sm" className="gap-2">
          <IconFolderOpen size={16} />
          Move
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Move Code</DialogTitle>
          <DialogDescription>
            Move "{codeName}" to a different folder
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Folder Tree */}
          <div className="border border-border rounded-md p-3 max-h-80 overflow-y-auto bg-muted/30">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-sm text-muted-foreground">Loading folders...</span>
              </div>
            ) : folders.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <span className="text-sm text-muted-foreground">No folders found</span>
              </div>
            ) : (
              <div className="space-y-1">
                {/* Option to remove from folder */}
                <button
                  onClick={() => setSelectedFolderId(undefined)}
                  className={cn(
                    "flex items-center gap-2 w-full px-3 py-2 rounded text-sm transition-colors",
                    selectedFolderId === undefined
                      ? "bg-primary/20 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span>📄 No folder (Root)</span>
                </button>

                {/* Root folders */}
                {folders.map((folder) => (
                  <FolderTreeNode key={folder._id} folder={folder} level={0} />
                ))}
              </div>
            )}
          </div>

          {/* Selected info */}
          {selectedFolderId && (
            <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
              ✓ Selected: {folders.find((f) => f._id === selectedFolderId)?.name || selectedFolderId}
            </div>
          )}
          {selectedFolderId === undefined && (
            <div className="text-xs text-muted-foreground p-2 bg-muted/50 rounded">
              ✓ Selected: Root (no folder)
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleMove}
              className="gap-2 bg-primary hover:bg-primary/90"
            >
              Move
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
