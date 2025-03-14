"use client"

import { useEffect } from "react"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

import { Plate } from "@udecode/plate/react"

import { useCreateEditor } from "@/components/editor/use-create-editor"
import { Editor, EditorContainer } from "@/components/plate-ui/editor"

interface PlateEditorProps {
  initialValue?: any
  onChange?: (value: any) => void
  readOnly?: boolean
}

export function PlateEditor({ initialValue, onChange, readOnly = false }: PlateEditorProps = {}) {
  const editor = useCreateEditor({
    readOnly,
    value: initialValue ? initialValue : undefined,
  })

  // Set up effect to handle content changes
  useEffect(() => {
    if (onChange && editor) {
      const unsubscribe = editor.history.subscribe(() => {
        const value = editor.children
        onChange(value)
      })

      return () => unsubscribe()
    }
  }, [editor, onChange])

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate editor={editor}>
        <EditorContainer>
          <Editor variant={"comment"} />
        </EditorContainer>
      </Plate>
    </DndProvider>
  )
}

