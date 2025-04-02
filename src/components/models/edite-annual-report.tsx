"use client";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useModal } from "@/hooks/use-modal-store";
import { Spinner } from "@/components/global/spinner";
import { updateAnnualReport } from "@/app/action";
import { toast } from "sonner";

const formSchema = z.object({
  field: z.string().min(1, {
    message: "Field name is required.",
  }),
  value: z.string().min(1, {
    message: "Value is required.",
  }),
});

export const EditAnnualReportModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "editAnnualReport";
  const { annualReport } = data;

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        field: "",
        value: "",
      },
      values: annualReport ? { 
        field: annualReport.field,
        value: annualReport.value,
      } : undefined,
    })

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!annualReport?.id) return;

    try {
      await toast.promise(
        updateAnnualReport(annualReport.id, values),
        {
          loading: "Updating annual report...",
          success: () => {
            router.refresh();
            onClose();
            return "Annual report updated successfully";
          },
          error: (error) => {
            console.error(error);
            return error instanceof Error ? error.message : "Failed to update annual report";
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
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
            Edit Annual Report Data
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <FormField
              control={form.control}
              name="field"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Field Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="e.g., Revenue, Net Profit, etc."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Value</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Enter the value"
                      {...field}
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
                {isLoading ? <Spinner /> : "Save Changes"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};