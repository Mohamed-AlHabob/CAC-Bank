"use client";

import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useModal } from "@/hooks/use-modal-store";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { deleteAnnualReport } from "@/app/action";
import { toast } from "sonner";
import { useYear } from "../context/YearContext";

export const DeleteAnnualReportModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { refreshYears  } = useYear()
  const router = useRouter();
  const isModalOpen = isOpen && type === "deleteAnnualReport";
  const { annualReport } = data;

  const onDelete = async () => {
    if (!annualReport?.id) return;

    await toast.promise(
      deleteAnnualReport(annualReport.id),
      {
        loading: "Deleting annual report...",
        success: () => {
          refreshYears()
          router.refresh();
          onClose();
          return "Annual report deleted successfully";
        },
        error: (error) => {
          console.error(error);
          return error instanceof Error ? error.message : "Failed to delete annual report";
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
            Delete Annual Report
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 space-y-4">
          <p className="text-center text-muted-foreground">
            Are you sure you want to delete this annual report data?
            <br />
            <span className="font-semibold">{annualReport?.field}</span> will be permanently removed.
          </p>
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