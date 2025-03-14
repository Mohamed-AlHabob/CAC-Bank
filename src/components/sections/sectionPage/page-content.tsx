"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlateEditor } from "@/components/editor/plate-editor"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useYear } from "@/components/context/YearContext"
import { updatePage } from "@/action"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Edit, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface Page {
  id: string
  title: string
  content?: string | null
  isPublished: boolean
  yearId: string
  initialPromotionalImage?: string | null
}

interface PageContentProps {
  fiscalYear: string
  title: string
}

export default function PageContent({ fiscalYear, title }: PageContentProps) {
  const { currentYear } = useYear()
  const [page, setPage] = useState<Page | null>(null)
  const [loading, setLoading] = useState(true)
  const [isEditable, setIsEditable] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (currentYear) {
      const foundPage = currentYear.pages.find((p) => p.title === title)
      if (foundPage) {
        setPage(foundPage as Page)
      }
      setLoading(false)
    }
  }, [currentYear, title])

  // Handle unsaved changes warning
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

  // Add this after the existing useEffect hooks
  useEffect(() => {
    // Reset hasUnsavedChanges when switching to view mode
    if (!isEditable) {
      setHasUnsavedChanges(false)
    }
  }, [isEditable])

  const handleSaveContent = async (content: string) => {
    if (!page) return

    try {
      await updatePage(page.id, {
        content,
      })

      // Update the local state
      setPage({
        ...page,
        content,
      })

      setHasUnsavedChanges(false)

      // Refresh the page to get the updated data
      router.refresh()
      return Promise.resolve()
    } catch (error) {
      console.error("Error saving page content:", error)
      return Promise.reject(error)
    }
  }

  const toggleEditMode = () => {
    if (isEditable && hasUnsavedChanges) {
      const confirm = window.confirm("You have unsaved changes. Are you sure you want to exit edit mode?")
      if (!confirm) return
    }

    setIsEditable(!isEditable)
    setHasUnsavedChanges(false)
  }

  const handleContentChange = () => {
    setHasUnsavedChanges(true)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-10 w-10 rounded-full" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-1/4 mb-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px] w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!page) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="mb-6">
          <Link href="/" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
              <p className="text-muted-foreground">
                The page "{title}" could not be found in the {fiscalYear} fiscal year.
              </p>
              <Button className="mt-4" asChild>
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <div className="mb-2">
            <Link
              href="/"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Annual Report
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{page.title}</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            onClick={toggleEditMode}
            variant={isEditable ? "outline" : "default"}
            className="flex items-center gap-2"
            size="sm"
          >
            {isEditable ? (
              <>
                <Eye className="h-4 w-4" />
                View Mode
              </>
            ) : (
              <>
                <Edit className="h-4 w-4" />
                Edit Mode
              </>
            )}
          </Button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="bg-muted/50">
          <CardTitle className="flex items-center">
            {fiscalYear} - {page.title}
          </CardTitle>
          <CardDescription>
            {page.isPublished ? "Published" : "Draft"} • Last updated: {new Date().toLocaleDateString()}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className={`p-6 ${isEditable ? "bg-white dark:bg-gray-950" : "bg-white/50 dark:bg-gray-950/50"}`}>
            <PlateEditor
              initialContent={page.content || ""}
              pageId={page.id}
              readOnly={!isEditable}
              onSave={isEditable ? handleSaveContent : undefined}
              className={isEditable ? "editor-mode" : "viewer-mode"}
            />
          </div>
        </CardContent>
      </Card>

      {isEditable && hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-4 py-2 rounded-md shadow-lg">
          You have unsaved changes
        </div>
      )}
    </div>
  )
}

