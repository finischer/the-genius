import { t } from "~/server/api/trpc";
import { mockGameshows } from "./gameshows";

export const mockAppRouter = t.router({
  gameshows: mockGameshows
});
