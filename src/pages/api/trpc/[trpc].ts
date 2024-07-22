import { createNextApiHandler } from "@trpc/server/adapters/next";

import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { isDevelopment } from "~/utils/environment";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: isDevelopment
    ? ({ path, error }) => {
        console.error(
          `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
        );
      }
    : undefined
});
