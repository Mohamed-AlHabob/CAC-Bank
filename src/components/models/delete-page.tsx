"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { deletePage } from "@/app/action";
import { toast } from "sonner";

export const DeletePageModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const router = useRouter();
  const isModalOpen = isOpen && type === "deletePage";
  const { page } = data;

  const onDelete = async () => {
    if (!page?.id) return;

    await toast.promise(
      deletePage(page.id),
      {
        loading: "Deleting page...",
        success: () => {
          router.refresh();
          onClose();
          return "Page deleted successfully";
        },
        error: (error) => {
          console.error(error);
          return error instanceof Error ? error.message : "Failed to delete page";
        },
      }
    );
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card p-0 overflow-hidden max-w-md">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold flex items-center justify-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Delete Page
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <p className="text-center text-muted-foreground">
            Are you sure you want to delete this page?
            <br />
            <span className="text-red-500 font-semibold">{page?.title || "Unknown Page"}</span> will be permanently deleted.
          </p>
          {page?.childrenPages && Array.isArray(page.childrenPages) && page.childrenPages.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-900 rounded-md text-sm">
              Warning: This page has {page.childrenPages.length} child page(s). Deleting it will make them
              inaccessible.
            </div>
          )}
        </div>
        <div className="flex justify-end gap-4 px-6 pb-6">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={onDelete}
          >
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};