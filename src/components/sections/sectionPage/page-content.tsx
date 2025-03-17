"use client"

import { useEffect, useState } from "react"
import { PlateEditor } from "@/components/editor/plate-editor"
import { useYear } from "@/components/context/YearContext"
import { Button } from "@/components/ui/button"
import { useModal } from "@/hooks/use-modal-store"
import { savePage } from "@/app/action"
import { Spinner } from "@/components/global/spinner"
import { Check, Edit, Save } from 'lucide-react'
import { motion } from "framer-motion"

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

// Default content to use if none exists
const DEFAULT_CONTENT = [
  {
    type: 'p',
    children: [{ text: 'Add your content here...' }],
  },
];

export default function PageContent({ fiscalYear, slug }: PageContentProps) {
  const { currentYear } = useYear()
  const { onOpen } = useModal()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [editorContent, setEditorContent] = useState<any[]>(DEFAULT_CONTENT)

  useEffect(() => {
    if (currentYear) {
      const foundPage = currentYear.pages.find((p) => p.slug === slug)
      if (foundPage) {
        setPage(foundPage as Page)

        // Parse the content if it exists
        if (foundPage.content) {
          try {
            const parsedContent = JSON.parse(foundPage.content)
            
            // Ensure we have an array of content
            if (Array.isArray(parsedContent)) {
              setEditorContent(parsedContent)
            } else if (parsedContent && parsedContent.editor && Array.isArray(parsedContent.editor.children)) {
              setEditorContent(parsedContent.editor.children)
            } else {
              console.warn("Content is not in expected format, using default")
              setEditorContent(DEFAULT_CONTENT)
            }
          } catch (e) {
            console.error("Error parsing page content:", e)
            // Fallback to default content
            setEditorContent(DEFAULT_CONTENT)
          }
        } else {
          // No content, use default
          setEditorContent(DEFAULT_CONTENT)
        }
      }
      setLoading(false)
    }
  }, [currentYear, slug])

  const handleEditClick = () => {
    setIsEditing(true)
  }

  const handleSaveClick = async () => {
    if (!page) return

    setIsSaving(true)
    try {
      const contentToSave = Array.isArray(editorContent) ? editorContent : DEFAULT_CONTENT
    
      const contentString = JSON.stringify(contentToSave)

      const result = await savePage(page.id, contentString)

      if (result.success) {
        setPage({
          ...page,
          content: contentString,
        })

        setSaveSuccess(true)
        setTimeout(() => {
          setSaveSuccess(false)
          setIsEditing(false)
        }, 1500)
      }
    } catch (error) {
      console.error("Error saving page:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handlePublishClick = () => {
    if (!page) return

    onOpen("confirmSaveAndPublishPage", { page })
  }

  const handleEditorChange = (value: any) => {
    console.log("Editor onChange value:", value)
    
    if (Array.isArray(value)) {
      setEditorContent(value)
    } else {
      console.warn("Editor returned non-array value:", value)
      if (value && Array.isArray(value.children)) {
        setEditorContent(value.children)
      }
    }
  }

  if (loading || !page) {
    return (
      <div className="min-h-screen w-full bg-background text-white flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  const projectName = page.projectName || "AI Art"
  const date = page.date || `${fiscalYear}`


  const translate = {
    initial: {
      y: "100%",
      opacity: 0,
    },
    enter: (i: never[]) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: i[0] },
    }),
    exit: (i: never[]) => ({
      y: "100%",
      opacity: 0,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: i[1] },
    }),
  }

  return (
    <div className="min-h-screen w-full bg-background dark:bg-foreground">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-start pt-6">
          <div className="space-y-3">
            <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
                <span className="text-[#9f9689] text-lg">Fiscal Year:</span> {fiscalYear}
            </motion.li>
            {/* <motion.li custom={[0.3, 0]} variants={translate} initial="initial" animate="enter" exit="exit">
                <span className="text-[#9f9689] text-lg">Fiscal Year:</span> {fiscalYear}
            </motion.li> */}
          </div>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSaveClick}
                  variant="outline"
                  size="sm"
                  className="rounded-full px-6"
                  disabled={isSaving || saveSuccess}
                >
                  {isSaving ? (
                    <Spinner className="mr-2 h-4 w-4" />
                  ) : saveSuccess ? (
                    <Check className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSaving ? "Saving..." : saveSuccess ? "Saved" : "Save"}
                </Button>
                {!page.isPublished && (
                  <Button onClick={handlePublishClick} variant="primary" size="sm" className="rounded-full px-6">
                    Publish
                  </Button>
                )}
              </>
            ) : (
              <Button
                onClick={handleEditClick}
                variant="outline"
                size="sm"
                className="rounded-full px-6"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </div>

        <div className="mt-24 mb-12">
          <h1 className="text-7xl font-bold tracking-tight">{page.title}</h1>
        </div>

        <div className="min-h-[50vh] bg-background dark:bg-foreground">
          <PlateEditor content={editorContent} editable={isEditing} onChange={handleEditorChange} />
        </div>
      </div>
    </div>
  )
}
