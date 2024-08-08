import type { SafedPublicGameshow } from "~/server/api/routers/gameshows";

export interface IGameshowCardProps {
  id: string;
  alreadyImported: boolean;
  gameshow: SafedPublicGameshow;
}
