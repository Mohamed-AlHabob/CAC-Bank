"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { PlateEditor } from "@/components/editor/plate-editor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useYear } from "@/components/context/YearContext"
import { updatePage } from "@/action"
import { UserButton } from "@clerk/nextjs"

interface PageContentProps {
  fiscalYear: string
  title: string
}

export default function PageContent({ fiscalYear, title }: PageContentProps) {
  const { currentYear } = useYear()
  const [page, setPage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isEditable, setIsEditable] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (currentYear) {
      const foundPage = currentYear.pages.find((p) => p.title === title)
      setPage(foundPage)
      setLoading(false)
    }
  }, [currentYear, title])

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

      // Refresh the page to get the updated data
      router.refresh()
    } catch (error) {
      console.error("Error saving page content:", error)
      throw error
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
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
      <div className="container mx-auto py-8">
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Page Not Found</h2>
              <p className="text-muted-foreground">
                The page &quot;{title}&quot; could not be found in the {fiscalYear} fiscal year.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{page.title}</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsEditable(!isEditable)}
            className="text-sm px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isEditable ? "View Mode" : "Edit Mode"}
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {fiscalYear} - {page.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PlateEditor
            initialContent={page.content}
            pageId={page.id}
            readOnly={!isEditable}
            onSave={isEditable ? handleSaveContent : undefined}
          />
        </CardContent>
      </Card>
    </div>
  )
}

