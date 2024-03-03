import { randomId } from "@mantine/hooks";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { PARTYKIT_URL } from "~/utils/env";
import { z } from "zod";

export const partyRouter = createTRPCRouter({
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      console.log("Fetch room: ", input.id);
      const req = await fetch(`${PARTYKIT_URL}/party/${input.id}`, {
        method: "GET",
        next: {
          revalidate: 0,
        },
      });

      const res = await req.json();

      return res;
    }),
  create: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        config: z.unknown(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const req = await fetch(`${PARTYKIT_URL}/party/${input.id}`, {
        method: "POST",
        body: JSON.stringify(input),
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await req.json();
    }),
});
