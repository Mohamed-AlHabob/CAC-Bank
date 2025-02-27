"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import { useState } from 'react';
import { Widget } from '@uploadcare/react-widget';

const TiptapEditor = () => {
  const [widgetOpen, setWidgetOpen] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        inline: true,
        allowBase64: false,
      }),
    ],
    content: '<p>Hello World!</p>',
    editorProps: {
      handleDOMEvents: {
        // Open Uploadcare widget when clicking on an image
        click: (view, event) => {
          if ((event.target as HTMLElement).tagName === 'IMG') {
            setWidgetOpen(true);
          }
        },
      },
    },
  });

  const handleUpload = (fileInfo: any) => {
    if (fileInfo && fileInfo.cdnUrl) {
      editor?.chain().focus().setImage({ src: fileInfo.cdnUrl }).run();
    }
    setWidgetOpen(false);
  };

  return (
    <div>
      <EditorContent editor={editor} />
      {/* {widgetOpen && (
        <Widget
          publicKey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY!}
          onChange={handleUpload}
          onClose={() => setWidgetOpen(false)}
        />
      )} */}
      <button onClick={() => setWidgetOpen(true)}>Upload Image</button>
    </div>
  );
};

export default TiptapEditor;