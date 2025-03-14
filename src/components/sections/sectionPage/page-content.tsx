"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlateEditor } from "@/components/editor/plate-editor"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useYear } from "@/components/context/YearContext"
import { updatePage } from "@/action"
import { UserButton } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Edit, Eye, ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AnimatedTitle from "@/components/global/AnimatedTitle"

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
  const [pageTitle, setPageTitle] = useState(title)
  const router = useRouter()

  useEffect(() => {
    if (currentYear) {
      const foundPage = currentYear.pages.find((p) => p.title === title)
      if (foundPage) {
        setPage(foundPage as Page)
        setPageTitle(foundPage.title)
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

  const handleSaveContent = async () => {
    if (!page || !page.content) return

    try {
      await updatePage(page.id, {
        content: page.content,
        title: pageTitle,
      })

      // Update the local state
      setPage({
        ...page,
        title: pageTitle,
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

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageTitle(e.target.value)
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
                The page &quot;{title}&quot; could not be found in the {fiscalYear} fiscal year.
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
    <div className="min-h-screen w-full">
      {/* Main Content */}
      <div className="container mx-auto py-8 px-4">
        {/* Fiscal Year Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <Label htmlFor="fiscal-year" className="text-sm font-medium whitespace-nowrap">
                fiscal year
              </Label>
              <Select defaultValue={fiscalYear}>
                <SelectTrigger className="w-[180px] bg-muted/50">
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={fiscalYear}>{fiscalYear}</SelectItem>
                  {/* Add more years as needed */}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" className="h-8 px-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              <Input className="bg-muted/50 w-[180px]" placeholder="Section name" value="Section name" readOnly />
            </div>
          </div>
        </div>

        {/* Title Sections */}
        <div className="space-y-4 mb-8">
          <div className="rounded-md px-6 py-3 w-64">
            {isEditable ? (
              <Input value={pageTitle} onChange={handleTitleChange} className="font-bold text-lg" placeholder="Title" />
            ) : (
              <AnimatedTitle title={title} />
            )}
          </div>
        </div>

        {/* Editor Section */}
        <div className="mt-8">
          <Card className="overflow-hidden border shadow-sm">
            <CardContent className="p-0">
              <div className="flex items-center justify-between bg-muted/50 px-4 py-2 border-b">
                <h3 className="font-medium">Editor</h3>
                <div className="flex items-center gap-2">
                  {isEditable && (
                    <Button
                      onClick={handleSaveContent}
                      size="sm"
                      className="flex items-center gap-1"
                      disabled={!hasUnsavedChanges}
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                  )}
                  <Button
                    onClick={toggleEditMode}
                    variant={isEditable ? "outline" : "default"}
                    className="flex items-center gap-1"
                    size="sm"
                  >
                    {isEditable ? (
                      <>
                        <Eye className="h-4 w-4" />
                        View
                      </>
                    ) : (
                      <>
                        <Edit className="h-4 w-4" />
                        Edit
                      </>
                    )}
                  </Button>
                </div>
              </div>
              <div className={`p-6 ${isEditable ? "bg-white dark:bg-gray-950" : "bg-white/50 dark:bg-gray-950/50"}`}>
              <PlateEditor />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Unsaved Changes Notification */}
      {isEditable && hasUnsavedChanges && (
        <div className="fixed bottom-4 right-4 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-100 px-4 py-2 rounded-md shadow-lg">
          You have unsaved changes
        </div>
      )}
    </div>
  )
}

