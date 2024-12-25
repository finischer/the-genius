import { createCallerFactory, router } from "@trpc/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { expect, it } from "vitest";
import { appRouter } from "~/server/api/root";
import { gameshowsRouter } from "~/server/api/routers/gameshows";
import { createTRPCRouter } from "~/server/api/trpc";
import type { RouterInputs } from "~/utils/api";

const makeCaller = (opts = {}) => {
  const createCaller = createCallerFactory();
  const callerOptions = {
    req: {} as NextApiRequest,
    res: {} as NextApiResponse,
    rateLimit: undefined, // rateLimit and user is bespoke to my code
    user: null,
    ...opts // allows me to overload as required in my tests
  };

  return createCaller(appRouter);
};

it("unauthed user should not be possible to create a gameshow", async () => {
  //   const ctx = createInnerTRPCContext({ session: null });
  //   const caller = t.createCallerFactory(appRouter);

  //   const input: RouterInputs["gameshows"]["create"] = {
  //     name: "Test",
  //     description: "Test",
  //     visibility: "PUBLIC",
  //     questions: []
  //   };

  //   expect(await caller.call(input, ctx)).rejects.toThrowError();

  const caller = createCallerFactory();
  console.log(caller);

  //   const res = await caller;
});
