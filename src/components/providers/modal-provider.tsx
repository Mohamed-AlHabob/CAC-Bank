"use client";

import { useEffect, useState } from "react";
import { CreateYearModal } from "@/components/models/create-year";
import { CreatePageModal } from "@/components/models/create-page";
import { ConfirmSaveAndPublishPageModal } from "@/components/models/confirm-save-and-publish-page";
import { DeletePageModal } from "@/components/models/delete-page";
import { DeleteYearModal } from "@/components/models/delete-year";
import { EditPageModal } from "@/components/models/edit-page";
import { EditYearModal } from "@/components/models/edit-yearl";
import { CreateAnnualReportModal } from "@/components/models/create-annual-report ";
import { DeleteAnnualReportModal } from "@/components/models/delete-annual-report";
import { EditAnnualReportModal } from "@/components/models/edite-annual-report";


export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
    <CreateYearModal/>
    <CreatePageModal/>
    <ConfirmSaveAndPublishPageModal/>
    <DeletePageModal/>
    <DeleteYearModal/>
    <EditPageModal/>
    <EditYearModal/>
    <CreateAnnualReportModal />
    <EditAnnualReportModal />
    <DeleteAnnualReportModal />
    </>
  )
}