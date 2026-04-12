"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CustomInput } from "@/components/custom"
import { IconChevronLeft, IconChevronRight, IconFolder, IconFolders } from "@tabler/icons-react"
import { cn } from "@/lib/utils"

interface FolderInfo {
  _id: string
  name: string
  description: string
  color: string
}

interface CodeEditorSidebarProps {
  title: string
  description: string
  language: string
  tags: string[]
  version: number
  isPublic: boolean
  isOpen: boolean
  onToggle: (open: boolean) => void
  onTitleChange: (title: string) => void
  onDescriptionChange: (description: string) => void
  onLanguageChange: (language: string) => void
  onTagsChange: (tags: string[]) => void
  onIsPublicChange: (isPublic: boolean) => void
  onSave: () => void
  isSaving?: boolean
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

export function CodeEditorSidebar({
  title,
  description,
  language,
  tags,
  version,
  isPublic,
  isOpen,
  onToggle,
  onTitleChange,
  onDescriptionChange,
  onLanguageChange,
  onTagsChange,
  onIsPublicChange,
  onSave,
  isSaving = false,
  folderInfo,
  onNavigateToFolder,
  onNavigateToFolders,
}: CodeEditorSidebarProps) {
  const [tagInput, setTagInput] = useState("")

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
    <>
      {/* Sidebar */}
      <div
        className={cn(
          "fixed left-0 top-0 h-full bg-card border-r border-border transition-all duration-300 ease-in-out overflow-y-auto z-40",
          isOpen ? "w-[30%] md:w-80" : "w-0"
        )}
      >
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Code Details</h2>
          </div>

          {/* Folder Navigation */}
          {folderInfo && (
            <div className="space-y-2 p-3 bg-muted/50 rounded-lg border border-border">
              <div className="flex items-center gap-2 text-sm font-medium">
                <IconFolder size={16} />
                <span>Current Folder</span>
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
                  className="flex-1 gap-2 text-xs"
                  onClick={() => onNavigateToFolder?.(folderInfo._id)}
                >
                  <IconFolder size={14} />
                  Open Folder
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 gap-2 text-xs"
                  onClick={() => onNavigateToFolders?.()}
                >
                  <IconFolders size={14} />
                  All Folders
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
                className="w-full gap-2 text-xs"
                onClick={() => onNavigateToFolders?.()}
              >
                <IconFolders size={14} />
                Go to Folders
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

          {/* Save Button */}
          <Button
            onClick={onSave}
            disabled={isSaving}
            className="w-full bg-primary hover:bg-primary/90 gap-2"
          >
            {isSaving ? "Saving..." : "Save Code"}
          </Button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => onToggle(!isOpen)}
        className={cn(
          "fixed left-0 top-1/2 -translate-y-1/2 z-50 p-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-r-lg transition-all duration-300",
          isOpen && "ml-[30%] md:ml-80"
        )}
      >
        {isOpen ? <IconChevronLeft size={20} /> : <IconChevronRight size={20} />}
      </button>

      {/* Content Offset */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => onToggle(false)} />
      )}
    </>
  )
}
