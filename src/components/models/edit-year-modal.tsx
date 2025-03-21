"use client"

import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useEffect } from "react"

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
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Textarea } from "@/components/ui/textarea"
import { updateYear } from "@/app/action"

const formSchema = z.object({
  fiscalYear: z.string().min(1, {
    message: "Fiscal year is required.",
  }),
  totalProfit: z.string().optional(),
  ceosMessage: z.string().optional(),
  publication: z.date().optional(),
})

export const EditYearModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === "editYear"
  const { year } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fiscalYear: "",
      totalProfit: "",
      ceosMessage: "",
      publication: undefined,
    },
  })

  useEffect(() => {
    if (year) {
      form.setValue("fiscalYear", year.fiscalYear)
      form.setValue("totalProfit", year.totalProfit ? year.totalProfit.toString() : "")
      form.setValue("ceosMessage", year.ceosMessage || "")
      form.setValue("publication", year.publication ? new Date(year.publication) : undefined)
    }
  }, [year, form])

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!year?.id) return

    try {
      // Convert totalProfit to Decimal if provided
      const formattedValues = {
        fiscalYear: values.fiscalYear,
        totalProfit: values.totalProfit ? Number.parseFloat(values.totalProfit) : undefined,
        ceosMessage: values.ceosMessage,
        publication: values.publication,
      }

      await updateYear(year.id, formattedValues)

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
          <DialogTitle className="text-2xl text-center font-bold">Edit Fiscal Year</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Update the details for fiscal year <span className="text-indigo-500 font-semibold">{year?.fiscalYear}</span>
            .
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-6 px-6">
              <FormField
                control={form.control}
                name="fiscalYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Fiscal Year
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Total Profit
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        type="number"
                        step="0.01"
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
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
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      CEO&apos;s Message
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0 resize-none min-h-[100px]"
                        placeholder="Enter CEO's message"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="publication"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                      Publication Date
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0",
                              !field.value && "text-muted-foreground",
                            )}
                          >
                            {field.value ? format(field.value, "PPP") : <span>Select publication date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        {/* <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={isLoading}
                          initialFocus
                        /> */}
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
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

