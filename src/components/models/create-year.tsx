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
import { Textarea } from "@/components/ui/textarea";
import { createYear } from "@/app/action";
import { toast } from "sonner";
import { useYear } from "../context/YearContext";

const formSchema = z.object({
  fiscalYear: z.string().min(4, {
    message: "Fiscal year is required.",
  }),
  totalProfit: z.string().optional(),
  ceosMessage: z.string().optional(),
});

export const CreateYearModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { refreshYears  } = useYear()
  const router = useRouter();
  const isModalOpen = isOpen && type === "createYear";

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fiscalYear: "",
      totalProfit: "",
      ceosMessage: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formattedValues = {
        fiscalYear: values.fiscalYear,
        totalProfit: values.totalProfit ? parseFloat(values.totalProfit) : undefined,
        ceosMessage: values.ceosMessage,
      };

      await toast.promise(
        createYear(formattedValues),
        {
          loading: "Creating fiscal year...",
          success: () => {
            form.reset();
            refreshYears()
            router.refresh();
            onClose();
            return "Fiscal year created successfully";
          },
          error: (error) => {
            console.error(error);
            return error instanceof Error ? error.message : "Failed to create fiscal year";
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
            Create New Fiscal Year
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-6">
            <FormField
              control={form.control}
              name="fiscalYear"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Fiscal Year</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      className="bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="e.g., 2023-2024"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="totalProfit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">Total Profit</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isLoading}
                      type="number"
                      step="5000000"
                      className="bg-background focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder="Enter total profit"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ceosMessage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">CEO&apos;s Message</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={isLoading}
                      className="bg-background focus-visible:ring-0 focus-visible:ring-offset-0 resize-none min-h-[100px]"
                      placeholder="Enter CEO's message"
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
                {isLoading ? <Spinner /> : "Create Year"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};