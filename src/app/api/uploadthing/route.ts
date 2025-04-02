import { ourFileRouter } from "@/lib/our-file-router";
import { createRouteHandler,  } from "uploadthing/next";
;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});