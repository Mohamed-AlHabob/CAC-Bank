"use client";

import { Plate } from "@udecode/plate/react";
import { useCreateEditor } from "@/components/editor/use-create-editor";
import { Editor, EditorContainer } from "@/components/plate-ui/editor";
import { FixedToolbar } from "../plate-ui/fixed-toolbar";
import { FixedToolbarButtons } from "../plate-ui/fixed-toolbar-buttons";
import { FloatingToolbar } from "../plate-ui/floating-toolbar";
import { FloatingToolbarButtons } from "../plate-ui/floating-toolbar-buttons";
import type { Value } from "@udecode/plate";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";

interface PlateEditorProps {
  content?: Value; // Change to `Value` instead of `Value[]`
  editable?: boolean;
  onChange?: (content: Value) => void;
}

function PlateEditor({ content = [], editable = true, onChange }: PlateEditorProps) {
  const editor = useCreateEditor({
    value: content,
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <Plate
        editor={editor}
        onChange={({ value }) => onChange?.(value)}
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
            variant={"demo"}
            placeholder="Type..."
            readOnly={!editable}
            className={!editable ? "cursor-default" : ""}
          />
        </EditorContainer>
      </Plate>
    </DndProvider>
  );
}

export default PlateEditor;