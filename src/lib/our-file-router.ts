// our-file-router.ts
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { url: file.url };
    }),
  pageImage: f({ image: { maxFileSize: "4MB" } })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { url: file.url };
    }),
  media: f({
    image: { maxFileSize: "4MB" },
    video: { maxFileSize: "16MB" },
    audio: { maxFileSize: "8MB" },
  })
    .middleware(() => {
      return {};
    })
    .onUploadComplete(({ file }) => {
      return { url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;