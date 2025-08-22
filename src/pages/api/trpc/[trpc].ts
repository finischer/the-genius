import { createNextApiHandler } from "@trpc/server/adapters/next";

import { createTRPCContext } from "~/server/api/trpc";
import { appRouter } from "~/server/api/root";
import { isDevelopmentClient } from "~/utils/environment";

// export API handler
export default createNextApiHandler({
  router: appRouter,
  createContext: createTRPCContext,
  onError: isDevelopmentClient
    ? ({ path, error }) => {
        console.error(
          `❌ tRPC failed on ${path ?? "<no-path>"}: ${error.message}`
        );
      }
    : undefined
});
