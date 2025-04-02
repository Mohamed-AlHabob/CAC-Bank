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
import { Switch } from "@/components/ui/switch"
import { updatePage } from "@/app/action"
import { useYear } from "@/components/context/YearContext"
import { toast } from "sonner"

const formSchema = z.object({
  title: z.string().min(5, {
    message: "Page title is required.",
  }),
  initialPromotionalImage: z.string().optional().nullable(),
  isPublished: z.boolean().default(false),
})
export const EditPageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const { currentYear } = useYear();
  const isModalOpen = isOpen && type === "editPage";
  const { page } = data;

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      initialPromotionalImage: "",
      isPublished: false,
    },
    values: page ? { 
      title: page.title,
      initialPromotionalImage: page.initialPromotionalImage,
      isPublished: page.isPublished,
    } : undefined,
  })
  

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!page?.id || !currentYear) return;

    await toast.promise(
      updatePage(page.id, {
        title: values.title,
        initialPromotionalImage: values.initialPromotionalImage,
        isPublished: values.isPublished,
      }),
      {
        loading: "Updating page...",
        success: () => {
          router.refresh();
          onClose();
          return "Page updated successfully";
        },
        error: (error) => {
          console.error(error);
          return error instanceof Error ? error.message : "Failed to update page";
        },
      }
    );
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card p-0 overflow-hidden max-w-md">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">
            Edit Page {page?.title}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}  key={page?.id || "new-page-form"}>
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

            <FormField
              control={form.control}
              name="isPublished"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-0.5">
                    <FormLabel className="font-semibold">Published</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      {field.value ? "Visible to everyone" : "Only visible to editors"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
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
                {isLoading ? <Spinner /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};