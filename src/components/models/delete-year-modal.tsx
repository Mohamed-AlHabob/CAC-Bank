"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useModal } from "@/hooks/use-modal-store"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/global/spinner"
import { AlertTriangle } from "lucide-react"
import { deleteYear } from "@/action"

export const DeleteYearModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === "deleteYear"
  const { year } = data

  const [isLoading, setIsLoading] = useState(false)

  const onDelete = async () => {
    if (!year?.id) return

    try {
      setIsLoading(true)

      await deleteYear(year.id)

      router.refresh()
      onClose()
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Delete Fiscal Year
          </DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to delete this fiscal year?
            <br />
            <span className="text-red-500 font-semibold">{year?.fiscalYear}</span> will be permanently deleted.
            {year?.pages && year.pages.length > 0 && (
              <div className="mt-4 p-3 bg-amber-50 text-amber-800 rounded-md">
                Warning: This fiscal year contains {year.pages.length} page(s). All associated pages and annual reports
                will be deleted.
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex items-center justify-between w-full">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button disabled={isLoading} variant="destructive" onClick={onDelete}>
              {isLoading ? <Spinner /> : "Delete"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

