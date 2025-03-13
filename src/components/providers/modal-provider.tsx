"use client";

import { useEffect, useState } from "react";
import { CreateYearModal } from "@/components/models/create-year-modal";
import { CreatePageModal } from "@/components//models/create-page-modal";
import { ConfirmSaveAndPublishPageModal } from "@/components//models/confirm-save-and-publish-page-modal";
import { DeletePageModal } from "@/components/models/delete-page-modal";
import { DeleteYearModal } from "@/components/models/delete-year-modal";
import { EditPageModal } from "@/components/models/edit-page-modal";
import { EditYearModal } from "@/components/models/edit-year-modal";


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
    </>
  )
}