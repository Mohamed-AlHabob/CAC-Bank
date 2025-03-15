"use client"

import { Plate } from "@udecode/plate/react"
import { useCreateEditor } from "@/components/editor/use-create-editor"
import { Editor, EditorContainer } from "@/components/plate-ui/editor"
import { FixedToolbar } from "../plate-ui/fixed-toolbar"
import { FixedToolbarButtons } from "../plate-ui/fixed-toolbar-buttons"
import { FloatingToolbar } from "../plate-ui/floating-toolbar"
import { FloatingToolbarButtons } from "../plate-ui/floating-toolbar-buttons"

interface PlateEditorProps {
  content?: any[]
  editable?: boolean
  onChange?: (value: any[]) => void
}

// Default content if none is provided
const DEFAULT_EDITOR_CONTENT = [
  {
    type: "p",
    children: [{ text: "Add your content here..." }],
  },
]

export function PlateEditor({ content, editable = true, onChange }: PlateEditorProps) {
  // Ensure content is an array
  const initialValue = Array.isArray(content) && content.length > 0 ? content : DEFAULT_EDITOR_CONTENT

  const editor = useCreateEditor({
    initialValue,
  })

  return (
    <Plate
      editor={editor}
      onChange={(newValue) => {
        console.log("Plate onChange value:", newValue)

        // Ensure we're passing an array to the parent component
        if (onChange && Array.isArray(newValue)) {
          onChange(newValue)
        } else if (onChange) {
          console.warn("Plate editor returned non-array value:", newValue)
          // Fallback to default content
          onChange(DEFAULT_EDITOR_CONTENT)
        }
      }}
      initialValue={initialValue}
    >
        {editable && (
          <>
            <FixedToolbar>
              <FixedToolbarButtons />
            </FixedToolbar>
            <FloatingToolbar>
              <FloatingToolbarButtons />
            </FloatingToolbar>
          </>
        )}
      <EditorContainer>
        <Editor
          variant="default"
          placeholder="Type..."
          readOnly={!editable}
          className={!editable ? "cursor-default" : ""}
        />
      </EditorContainer>
    </Plate>
  )
}

