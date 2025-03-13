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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { Spinner } from "@/components/global/spinner"
import { Textarea } from "@/components/ui/textarea"
import { FileUpload } from "@/components/global/file-upload"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createPage, getAllYears, getParentPages } from "@/action"

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
})

export const CreatePageModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()
  const [years, setYears] = useState<{ id: string; fiscalYear: string }[]>([])
  const [parentPages, setParentPages] = useState<{ id: string; title: string }[]>([])

  const isModalOpen = isOpen && type === "createPage"
  const { year } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      content: "",
      initialPromotionalImage: "",
      yearId: year?.id || "",
      parentPageId: "",
    },
  })

  useEffect(() => {
    if (year) {
      form.setValue("yearId", year.id)
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
          parentPagesData.map((page) => ({
            id: page.id,
            title: page.title,
          })),
        )
      } catch (error) {
        console.error(error)
      }
    }

    fetchData()
  }, [year, form])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createPage({
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
          : {}),
      })

      form.reset()
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
          <DialogTitle className="text-2xl text-center font-bold">Create New Page</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Add a new page to the annual report.
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
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
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
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0">
                          <SelectValue placeholder="Select parent page (optional)" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">None (Top-level page)</SelectItem>
                        {parentPages.map((page) => (
                          <SelectItem key={page.id} value={page.id}>
                            {page.title}
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
                        <FileUpload endpoint="pageImage" value={field.value || ""} onChange={field.onChange} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                {isLoading ? <Spinner /> : "Create Page"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

