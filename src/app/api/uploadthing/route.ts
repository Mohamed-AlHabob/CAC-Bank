import type { FileRouter } from 'uploadthing/next';
import { createRouteHandler, createUploadthing } from 'uploadthing/next';

const f = createUploadthing();

const ourFileRouter = {
  editorUploader: f(['image', 'text', 'blob', 'pdf', 'video', 'audio'])
    .middleware(() => {
      // You can add middleware logic here if needed
      return {};
    })
    .onUploadComplete(({ file }) => {
      // Return only JSON-compatible properties of the file object
      return {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        customId: file.customId,
        key: file.key,
        url: file.url,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});