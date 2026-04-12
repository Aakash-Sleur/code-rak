# Code Editor System

## Overview
A complete code management system with an integrated code editor featuring a collapsible sidebar and Monaco-compatible editor area.

## Features

### Pages

#### 1. **Code Creation Page** - `/code/create`
- Create new code snippets
- Accessible from folder detail pages with `?folderId=<id>` parameter
- Full form with title, description, language, and tags
- Auto-redirects to edit page after creation

**Query Parameters:**
- `folderId` (required) - The folder ID where the code will be created

**Route:** `/code/create?folderId=<folder_id>`

#### 2. **Code Editor Page** - `/code/[id]/edit`
- Full-featured code editor for existing codes
- Auto-save capability
- Version tracking
- 30% sidebar (collapsible) + 70% editor area
- Real-time stats (lines, characters)
- Unsaved changes indicator

**Route:** `/code/{codeId}/edit`

### Components

#### CodeEditorSidebar
Located in `components/code-editor-sidebar.tsx`

**Features:**
- Collapsible sidebar (30% width on desktop, full mobile overlay)
- Title input
- Description textarea
- Language selector (18+ languages)
- Tag management (add/remove tags)
- Version display (read-only)
- Public/Private toggle
- Save button

**Props:**
```typescript
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
}
```

### API Endpoints

#### POST `/api/codes`
Create a new code snippet

**Request:**
```json
{
  "title": "String (required)",
  "description": "String (required)",
  "code": "String (required)",
  "language": "String (required)",
  "folderId": "String (required)",
  "tags": ["String"],
  "isPublic": "Boolean"
}
```

**Response:** `201 Created`
```json
{
  "message": "Code created successfully",
  "code": { ...CodeObject }
}
```

#### GET `/api/codes`
Get all codes for current user

**Response:** `200 OK`
```json
{
  "message": "Codes fetched successfully",
  "codes": [{ ...CodeObject }]
}
```

#### GET `/api/codes/[id]`
Get specific code details

**Response:** `200 OK`
```json
{
  "message": "Code fetched successfully",
  "code": { ...CodeObject }
}
```

#### PUT `/api/codes/[id]`
Update code snippet

**Request:** Same as POST (all fields optional, only provided fields update, version auto-increments)

**Response:** `200 OK`
```json
{
  "message": "Code updated successfully",
  "code": { ...CodeObject }
}
```

#### DELETE `/api/codes/[id]`
Delete code snippet

**Response:** `200 OK`
```json
{
  "message": "Code deleted successfully"
}
```

### Editor Features

#### Current Implementation
- Textarea-based editor with monospace font
- Syntax highlighting-ready (can integrate Monaco Editor)
- Tab support (configurable via `tabSize`)
- Real-time line and character count
- Auto-detection of language

#### Planned Enhancements
- Monaco Editor integration for proper syntax highlighting
- Code snippets/emmet support
- Keyboard shortcuts (Ctrl+S for save, etc.)
- Diff viewer for versions
- Code formatting and linting
- Collaboration features

### Navigation Flow

```
Folders Page
    ↓
    └─→ Create Folder Button → Create Folder Modal
    
Folder Detail Page
    ↓
    ├─→ "Add Code" Button → Code Create Page → Code Editor Page
    │
    └─→ Code Card → Code Editor Page (Edit)
            ↓
        "Edit" Button → Code Editor Page
```

### Usage Example

#### Creating a Code
1. Navigate to `/folders`
2. Click on a folder
3. Click "Add Code" button
4. Fill in the sidebar (title, description, language, etc.)
5. Write code in the editor
6. Click "Create Code"
7. Redirected to edit page at `/code/{id}/edit`

#### Editing a Code
1. Navigate to folder containing code
2. Click "Edit" on code card
3. Modify code, metadata, or tags
4. Click "Save" button
5. Version auto-increments

### Styling
- Follows existing design system
- Uses Tailwind CSS
- Consistent with CustomModal and CustomInput
- Responsive layout with mobile sidebar overlay
- Dark mode support

### Browser Compatibility
- Modern browsers with ES6+ support
- Requires JavaScript enabled
- Works on mobile, tablet, and desktop

### Future Enhancements
- [ ] Monaco Editor integration
- [ ] Code snippet marketplace
- [ ] Collaborative editing
- [ ] Git integration
- [ ] Code execution/testing
- [ ] Version history/diff viewer
- [ ] Code review comments
