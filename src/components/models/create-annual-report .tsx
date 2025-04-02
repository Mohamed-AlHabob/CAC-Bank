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
import { createAnnualReport } from "@/app/action";
import { toast } from "sonner";
import { useYear } from "../context/YearContext";

const formSchema = z.object({
  field: z.string().min(1, {
    message: "Field name is required.",
  }),
  value: z.string().min(1, {
    message: "Value is required.",
  }),
});

export const CreateAnnualReportModal = () => {
  const { isOpen, onClose, type } = useModal();
  const router = useRouter();
  const { currentYear,refreshYears  } = useYear()
  const isModalOpen = isOpen && type === "createAnnualReport";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      field: "",
      value: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await toast.promise(
        createAnnualReport({
          field: values.field,
          value: values.value,
          year: {
            connect: currentYear ? { id: currentYear.id } : undefined,
          },
        }),
        {
          loading: "Creating annual report...",
          success: () => {
            form.reset();
            router.refresh();
            refreshYears()
            onClose();
            return "Annual report created successfully";
          },
          error: (error) => {
            console.error(error);
            return error instanceof Error ? error.message : "Failed to create annual report";
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
            Add Annual Report Data
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
                {isLoading ? <Spinner /> : "Create"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};