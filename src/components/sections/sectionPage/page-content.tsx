"use client";

import { useState } from "react";
import PlateEditor from "@/components/editor/plate-editor";
import { useYear } from "@/components/context/YearContext";
import { Button } from "@/components/ui/button";
import { useModal } from "@/hooks/use-modal-store";

import { Spinner } from "@/components/global/spinner";
import { Edit, Save } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import type { Page } from "@prisma/client";
import type { Value } from "@udecode/plate";
import { savePage } from "@/app/action";

interface PageContentProps {
  page: Page;
}

const PageContent = ({ page }: PageContentProps) => {
  const { currentYear } = useYear();
  const { isSignedIn } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState<Value | null>(page.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const serializableContent = JSON.parse(JSON.stringify(content));
      await savePage(page.id, serializableContent);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save page:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const translate = {
    initial: {
      y: "100%",
      opacity: 0,
    },
    enter: (i: number[]) => ({
      y: 0,
      opacity: 1,
      transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: i[0] },
    }),
    exit: (i: number[]) => ({
      y: "100%",
      opacity: 0,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: i[1] },
    }),
  };

  return (
    <div className="min-h-screen w-full bg-background dark:bg-foreground">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-start pt-6">
          <motion.div
            custom={[0.3, 0]}
            variants={translate}
            initial="initial"
            animate="enter"
            exit="exit"
            className="space-y-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-[#9f9689] text-lg">Fiscal Year:</span>
              <span>{currentYear?.fiscalYear}</span>
            </div>
          </motion.div>

          {isSignedIn && (
            <div className="flex items-center gap-4">
              {isEditing ? (
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Spinner /> : <Save className="mr-2" />}
                  Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="mr-2" />
                  Edit
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="mt-24 mb-12">
          <h1 className="text-7xl font-bold tracking-tight">{page.title}</h1>
        </div>

        <div className="min-h-[50vh] bg-background dark:bg-foreground">
          <PlateEditor
            content={content || []}
            editable={isEditing}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>
      </div>
    </div>
  );
};

export default PageContent;
