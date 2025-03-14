"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlateEditor } from "@/components/editor/plate-editor"
import { useYear } from "@/components/context/YearContext"
import { updatePage } from "@/action"
import { Button } from "@/components/ui/button"

interface Page {
  id: string
  title: string
  slug: string
  content?: string | null
  isPublished: boolean
  yearId: string
  initialPromotionalImage?: string | null
  projectName?: string
  date?: string
}

interface PageContentProps {
  fiscalYear: string
  slug: string
}

export default function PageContent({ fiscalYear, slug }: PageContentProps) {
  const { currentYear } = useYear()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditable, setIsEditable] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [editorContent, setEditorContent] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    if (currentYear) {
      const foundPage = currentYear.pages.find((p) => p.slug === slug)
      if (foundPage) {
        setPage(foundPage as Page)

        // Parse content if it exists
        if (foundPage.content) {
          try {
            const parsedContent = JSON.parse(foundPage.content)
            setEditorContent(parsedContent)
          } catch (e) {
            // If content is not valid JSON, use it as a simple text
            setEditorContent([
              {
                type: "p",
                children: [{ text: foundPage.content }],
              },
            ])
          }
        }
      }
      setLoading(false)
    }
  }, [currentYear, slug])

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isEditable && hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ""
        return ""
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [isEditable, hasUnsavedChanges])

  const handleSaveContent = async () => {
    if (!page) return

    try {
      const contentString = JSON.stringify(editorContent)

      await updatePage(page.id, {
        title: page.title,
        content: contentString,
      })

      setHasUnsavedChanges(false)
      setIsEditable(false)
      router.refresh()
    } catch (error) {
      console.error("Error saving page content:", error)
    }
  }

  const toggleEditMode = () => {
    if (isEditable && hasUnsavedChanges) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to exit edit mode?")
      if (!confirm) return
    }

    setIsEditable(!isEditable)
    if (!isEditable) {
      setHasUnsavedChanges(false)
    }
  }

  if (loading || !page) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  // Default project data if not available in the page object
  const projectName = page.projectName || "AI Art"
  const date = page.date || `${fiscalYear}`

  return (
    <div className="min-h-screen w-full bg-black text-white">
      {/* Header with project info and edit button */}
      <div className="container mx-auto pt-12 px-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-sm text-gray-400">Project</p>
            <p className="text-white">{projectName}</p>
            <p className="text-sm text-gray-400">Date</p>
            <p className="text-white">{date}</p>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="rounded-full bg-white text-black hover:bg-gray-200 px-6"
            onClick={isEditable ? handleSaveContent : toggleEditMode}
          >
            {isEditable ? "Save" : "Edit"}
          </Button>
        </div>

        {/* Main title section */}
        <div className="mt-24 mb-12">
          <h1 className="text-7xl font-bold tracking-tight">{page.title}</h1>
        </div>

        {/* Editor section */}
        <div className="mt-12 pb-24">
          <div className="prose prose-invert max-w-none">
            <h2 className="text-3xl font-medium mb-8">Editor</h2>

            {editorContent && (
              <PlateEditor
                initialValue={editorContent}
                onChange={(content) => {
                  setEditorContent(content)
                  setHasUnsavedChanges(true)
                }}
                readOnly={!isEditable}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

