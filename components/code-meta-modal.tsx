"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/custom"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface FolderInfo {
  _id: string
  name: string
  description: string
  color: string
}

interface CodeMetaModalProps {
  title: string
  description: string
  language: string
  tags: string[]
  version: number
  isPublic: boolean
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onLanguageChange: (language: string) => void
  onTagsChange: (tags: string[]) => void
  onIsPublicChange: (isPublic: boolean) => void
  folderInfo?: FolderInfo | null
  onNavigateToFolder?: (folderId: string) => void
  onNavigateToFolders?: () => void
}

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "csharp",
  "go",
  "rust",
  "php",
  "ruby",
  "sql",
  "html",
  "css",
  "json",
  "xml",
  "yaml",
  "bash",
  "markdown",
]

export function CodeMetaModal({
  title,
  description,
  language,
  tags,
  version,
  isPublic,
  onTitleChange,
  onDescriptionChange,
  onLanguageChange,
  onTagsChange,
  onIsPublicChange,
  folderInfo,
  onNavigateToFolder,
  onNavigateToFolders,
}: CodeMetaModalProps) {
  const [tagInput, setTagInput] = useState("")
  const [open, setOpen] = useState(false)

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      onTagsChange([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((t) => t !== tagToRemove))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button variant="outline" size="sm" className="gap-2">
          Edit Meta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Code Metadata</DialogTitle>
          <DialogDescription>
            Edit code details, tags, language, and visibility settings
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Folder Info */}
          {folderInfo && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span>📁 Folder</span>
              </div>
              <div className="pl-6 space-y-2">
                <div>
                  <p className="font-semibold text-sm text-foreground">{folderInfo.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {folderInfo.description}
                  </p>
                </div>
                {folderInfo.color && (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: folderInfo.color }}
                    />
                    <span className="text-xs text-muted-foreground">{folderInfo.color}</span>
                  </div>
                )}
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => {
                    onNavigateToFolder?.(folderInfo._id)
                    setOpen(false)
                  }}
                >
                  📁 Open Folder
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs"
                  onClick={() => {
                    onNavigateToFolders?.()
                    setOpen(false)
                  }}
                >
                  📂 All Folders
                </Button>
              </div>
            </div>
          )}

          {!folderInfo && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-dashed border-border">
              <p className="text-xs text-muted-foreground">
                This code is not in a folder
              </p>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs"
                onClick={() => {
                  onNavigateToFolders?.()
                  setOpen(false)
                }}
              >
                📂 Go to Folders
              </Button>
            </div>
          )}

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Title</label>
            <CustomInput
              placeholder="Enter code title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <textarea
              placeholder="Describe your code..."
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background transition-colors hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none h-24"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Language</label>
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-border rounded-md bg-background transition-colors hover:border-border/80 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">Select language</option>
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.charAt(0).toUpperCase() + lang.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tags</label>
            <div className="flex gap-2">
              <CustomInput
                placeholder="Add tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleAddTag()
                  }
                }}
              />
              <Button
                size="sm"
                variant="outline"
                onClick={handleAddTag}
                className="whitespace-nowrap"
              >
                Add
              </Button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags.map((tag) => (
                  <div
                    key={tag}
                    className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-primary/80"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Version */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Version</label>
            <div className="px-3 py-2 text-sm border border-border rounded-md bg-muted/50 text-muted-foreground">
              v{version}
            </div>
          </div>

          {/* Public Toggle */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Visibility</label>
            <button
              onClick={() => onIsPublicChange(!isPublic)}
              className={cn(
                "w-full px-3 py-2 text-sm border rounded-md transition-colors",
                isPublic
                  ? "border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400"
                  : "border-border bg-muted/50 text-muted-foreground"
              )}
            >
              {isPublic ? "🌐 Public" : "🔒 Private"}
            </button>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
