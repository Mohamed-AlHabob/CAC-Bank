"use client"

import { useEffect, useState } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import type { Value } from "@udecode/plate"
import { Plate } from "@udecode/plate/react"

import { useCreateEditor } from "@/components/editor/use-create-editor"
import { SettingsDialog } from "@/components/editor/settings"
import { Editor, EditorContainer } from "@/components/plate-ui/editor"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/global/spinner"
import { toast } from "sonner"

interface PlateEditorProps {
  initialContent?: string
  pageId?: string
  readOnly?: boolean
  onSave?: (content: string) => Promise<void>
}

export function PlateEditor({ initialContent, pageId, readOnly = false, onSave }: PlateEditorProps) {
  const editor = useCreateEditor()
  const [isSaving, setIsSaving] = useState(false)
  const [initialValue, setInitialValue] = useState<Value>([
    {
      type: "p",
      children: [{ text: "Loading content..." }],
    },
  ])

  useEffect(() => {
    if (initialContent) {
      try {
        // Try to parse the content as JSON if it's stored that way
        const parsedContent = JSON.parse(initialContent)
        setInitialValue(parsedContent)
      } catch (e) {
        // If it's not valid JSON, use it as plain text
        setInitialValue([
          {
            type: "p",
            children: [{ text: initialContent || "Start typing here..." }],
          },
        ])
      }
    } else {
      setInitialValue([
        {
          type: "p",
          children: [{ text: "Start typing here..." }],
        },
      ])
    }
  }, [initialContent])

  const handleSave = async () => {
    if (!onSave) return

    try {
      setIsSaving(true)
      // Get the current content from the editor
      const content = JSON.stringify(editor.children)
      await onSave(content)
      toast.success("Content saved successfully")
    } catch (error) {
      console.error("Error saving content:", error)
      toast.error("Failed to save content")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor} >
        <EditorContainer>
          <Editor variant="fullWidth" readOnly={readOnly}/>
          {!readOnly && onSave && (
            <div className="flex justify-end mt-4">
              <Button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2">
                {isSaving ? <Spinner /> : null}
                {isSaving ? "Saving..." : "Save Content"}
              </Button>
            </div>
          )}
        </EditorContainer>
        <SettingsDialog />
      </Plate>
    </DndProvider>
  )
}

