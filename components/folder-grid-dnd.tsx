"use client"

import { useState } from "react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { showNotification } from "@/components/custom"
import { IconArrowRight, IconTrash, IconGripVertical } from "@tabler/icons-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Folder {
  _id: string
  name: string
  description: string
  color: string
  createdAt: string
}

interface DraggableFolderItemProps {
  folder: Folder
  onDelete: (id: string) => void
}

function DraggableFolderItem({ folder, onDelete }: DraggableFolderItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: folder._id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md",
        isDragging && "opacity-50 shadow-lg"
      )}
    >
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="flex-shrink-0 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing pt-1"
          title="Drag to reorder"
        >
          <IconGripVertical size={18} />
        </button>

        {/* Folder Color Indicator */}
        <div
          className="h-8 w-4 rounded flex-shrink-0"
          style={{ backgroundColor: folder.color }}
        />

        {/* Content */}
        <div className="flex-1 min-w-0">
          <h3 className="line-clamp-1 font-semibold text-foreground">
            {folder.name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {folder.description}
          </p>
        </div>

        {/* Footer with actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(folder.createdAt).toLocaleDateString()}
          </p>
          <Link href={`/folders/${folder._id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <IconArrowRight size={16} />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(folder._id)}
            className="text-destructive hover:text-destructive"
          >
            <IconTrash size={16} />
          </Button>
        </div>
      </div>
    </div>
  )
}

interface FolderGridProps {
  folders: Folder[]
  onDelete: (id: string) => void
  onReorder?: (folders: Folder[]) => void
}

export function FolderGridDnd({ folders, onDelete, onReorder }: FolderGridProps) {
  const [items, setItems] = useState<Folder[]>(folders)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item._id === active.id)
      const newIndex = items.findIndex((item) => item._id === over.id)

      const newItems = arrayMove(items, oldIndex, newIndex)
      setItems(newItems)
      onReorder?.(newItems)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((f) => f._id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-4">
          {items.map((folder) => (
            <DraggableFolderItem
              key={folder._id}
              folder={folder}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
