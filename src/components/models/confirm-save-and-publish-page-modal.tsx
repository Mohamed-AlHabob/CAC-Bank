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
import { CheckCircle } from "lucide-react"
import { publishPage } from "@/app/action"

export const ConfirmSaveAndPublishPageModal = () => {
  const { isOpen, onClose, type, data } = useModal()
  const router = useRouter()

  const isModalOpen = isOpen && type === "confirmSaveAndPublishPage"
  const { page } = data

  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const onPublish = async () => {
    if (!page?.id) return

    try {
      setIsLoading(true)

      await publishPage(page.id)

      setIsSuccess(true)

      setTimeout(() => {
        router.refresh()
        onClose()
        setIsSuccess(false)
      }, 1500)
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
          <DialogTitle className="text-2xl text-center font-bold">Publish Page</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center mt-2">
                <CheckCircle className="h-16 w-16 text-green-500 mb-2" />
                <p>Page published successfully!</p>
              </div>
            ) : (
              <>
                Are you sure you want to publish this page?
                <br />
                <span className="text-indigo-500 font-semibold">{page?.title}</span> will be visible to the public.
              </>
            )}
          </DialogDescription>
        </DialogHeader>
        {!isSuccess && (
          <DialogFooter className="bg-gray-100 px-6 py-4">
            <div className="flex items-center justify-between w-full">
              <Button disabled={isLoading} onClick={onClose} variant="ghost">
                Cancel
              </Button>
              <Button disabled={isLoading} variant="primary" onClick={onPublish}>
                {isLoading ? <Spinner /> : "Publish"}
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}


