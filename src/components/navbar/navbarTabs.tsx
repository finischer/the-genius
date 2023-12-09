import { IconDoor, IconHome, IconMessageReport, IconTools } from "@tabler/icons-react";
import type { INavbarTabs } from "./navbar.types";

const DEFAULT_ICON_SIZE = "1.3rem";

export const navbartabs: INavbarTabs = {
  normal: [
    {
      label: "Home",
      href: "/",
      icon: <IconHome size={DEFAULT_ICON_SIZE} />,
    },
    {
      label: "Räume",
      href: "/rooms",
      icon: <IconDoor size={DEFAULT_ICON_SIZE} />,
    },
    {
      label: "Meine Spielshows",
      href: "/gameshows",
      description: "Starte oder erstelle deine eigene Spielshow",
      icon: <IconTools size={DEFAULT_ICON_SIZE} />,
    },
  ],
  admin: [
    {
      label: "User Feedback",
      href: "/admin/feedbacks",
      description: "Feedback der User, während der Beta Phase",
      icon: <IconMessageReport size={DEFAULT_ICON_SIZE} />,
    },
  ],
};
