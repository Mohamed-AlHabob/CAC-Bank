"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { Spinner } from "@/components/global/spinner"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/global/file-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { getAllYears, getParentPages, updatePage } from "@/app/action"

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Page title is required.",
  }),
  content: z.string().optional(),
  initialPromotionalImage: z.string().optional(),
  yearId: z.string().min(1, {
    message: "Fiscal year is required.",
  }),
  parentPageId: z.string().optional(),
  isPublished: z.boolean().default(false),
})

export const EditPageModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()
  const [years, setYears] = useState<{ id: string; fiscalYear: string }[]>([])
  const [parentPages, setParentPages] = useState<{ id: string; title: string }[]>([])

  const isModalOpen = isOpen && type === "editPage"
  const { page } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      initialPromotionalImage: "",
      yearId: "",
      parentPageId: "",
      isPublished: false,
    },
  })

  useEffect(() => {
    if (page) {
      form.setValue("title", page.title)
      form.setValue("content", page.content || "")
      form.setValue("initialPromotionalImage", page.initialPromotionalImage || "")
      form.setValue("yearId", page.yearId)
      form.setValue("parentPageId", page.parentPageId || "")
      form.setValue("isPublished", page.isPublished)
    }

    // Fetch years and parent pages
    const fetchData = async () => {
      try {
        const yearsData = await getAllYears()
        setYears(
          yearsData.map((year) => ({
            id: year.id,
            fiscalYear: year.fiscalYear,
          })),
        )

        const parentPagesData = await getParentPages()
        setParentPages(
          parentPagesData.map((parentPage) => ({
            id: parentPage.id,
            title: parentPage.title,
          })),
        )
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [page, form])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!page?.id) return

    try {
      await updatePage(page.id, {
        title: values.title,
        content: values.content,
        initialPromotionalImage: values.initialPromotionalImage,
        year: {
          connect: { id: values.yearId },
        },
        ...(values.parentPageId && values.parentPageId !== "none"
          ? {
              parentPage: {
                connect: { id: values.parentPageId },
              },
            }
          : {
              parentPage: {
                disconnect: true,
              },
            }),
        isPublished: values.isPublished,
      })

      router.refresh()
      onClose()
    } catch (error) {
      console.error(error)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Edit Page</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Update the details for page <span className="text-indigo-500 font-semibold">{page?.title}</span>.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6 px-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Page Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                        placeholder="Enter page title"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="yearId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Fiscal Year
                    </FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select fiscal year" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year.id} value={year.id}>
                            {year.fiscalYear}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="parentPageId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Parent Page (Optional)
                    </FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select parent page (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (Top-level page)</SelectItem>
                        {parentPages.map((parentPage) => (
                          <SelectItem
                            key={parentPage.id}
                            value={parentPage.id}
                            disabled={parentPage.id === page?.id} // Can't set itself as parent
                          >
                            {parentPage.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Content
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none min-h-[120px]"
                        placeholder="Enter page content"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="initialPromotionalImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Promotional Image
                    </FormLabel>
                    <FormControl>
                      <div className="flex items-center justify-center">
                        <FileUpload endpoint="pageImage" value={field.value || ''} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isPublished"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Published Status</FormLabel>
                      <FormDescription>
                        {field.value ? "This page is currently published" : "This page is currently a draft"}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} disabled={isLoading} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                {isLoading ? <Spinner /> : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

