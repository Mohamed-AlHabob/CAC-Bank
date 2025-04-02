import { PageWithChildrenPages, YearWithPages } from "@/components/context/YearContext";
import { AnnualReport } from "@prisma/client";
import { create } from "zustand";

export type ModalType = "createYear" | "deleteYear" |"editYear" | "createPage" | "deletePage" |  "editPage" | "createAnnualReport" | "editAnnualReport" | "deleteAnnualReport" | "confirmSaveAndPublishPage" | "deletedocument" |"ChangeStatus";



interface ModalData {
  year?: YearWithPages;
  page?: PageWithChildrenPages;
  annualReport?: AnnualReport
}

interface ModalStore {
  type: ModalType | null;
  data: ModalData;
  isOpen: boolean;
  onOpen: (type: ModalType, data?: ModalData) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  data: {},
  isOpen: false,
  onOpen: (type, data = {}) => set({ isOpen: true, type, data }),
  onClose: () => set({ type: null, isOpen: false })
}));
