"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useModal } from "@/hooks/use-modal-store"
import { Spinner } from "@/components/global/spinner"
import { FileUpload } from "@/components/global/file-upload"
import { createPage } from "@/app/action"
import { useYear } from "@/components/context/YearContext"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Page title is required.",
  }),
  initialPromotionalImage: z.string().optional().nullable(),
})

export const CreatePageModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()
  const { currentYear,refreshYears  } = useYear()
  const isModalOpen = isOpen && type === "createPage"
  const { page } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      initialPromotionalImage: "",
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      if (!currentYear) return

      await createPage({
        title: values.title,
        initialPromotionalImage: values.initialPromotionalImage,
        year: {
          connect: { id: currentYear.id },
        },
        ...(page ? {
          parentPage: {
            connect: { id: page.id },
          }
        } : {}),
        slug: ""
      })

      form.reset()
      refreshYears()
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
      <DialogContent className="bg-card p-0 overflow-hidden max-w-md">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            {page ? `Add Child Page For ${page.title}` : "Create New Page"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Page Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
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
              name="initialPromotionalImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Promotional Image</FormLabel>
                  <FormControl>
                    <FileUpload 
                      endpoint="pageImage" 
                      value={field.value || null} 
                      onChange={field.onChange}
                      className="w-full h-64 border-2 border-dashed rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-4 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                variant="primary" 
                disabled={isLoading}
                className="min-w-32"
              >
                {isLoading ? <Spinner /> : "Create Page"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}