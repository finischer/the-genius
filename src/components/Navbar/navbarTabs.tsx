import {
  IconCategory,
  IconDoor,
  IconHome,
  IconMessageReport,
  IconTestPipe,
  IconUser,
} from "@tabler/icons-react";
import type { INavbarTabs } from "~/components/Navbar/navbar.types";

const DEFAULT_ICON_SIZE = "1.3rem";

export const navbartabs: INavbarTabs = {
  normal: [
    {
      label: "Home",
      href: "/",
      leftSection: <IconHome size={DEFAULT_ICON_SIZE} />,
    },
    {
      label: "Räume",
      href: "/rooms",
      leftSection: <IconDoor size={DEFAULT_ICON_SIZE} />,
    },
    {
      label: "Meine Spielshows",
      href: "/gameshows",
      description: "Starte oder erstelle deine eigene Spielshow",
      leftSection: <IconCategory size={DEFAULT_ICON_SIZE} />,
    },
    {
      label: "Feedback",
      href: "/feedback",
      description: "Gib uns dein Feedback und mache TheGenius besser",
      leftSection: <IconMessageReport size={DEFAULT_ICON_SIZE} />,
    },
  ],
  admin: [
    {
      label: "User Feedback",
      href: "/admin/feedbacks",
      description: "Feedback der User, während der Beta Phase",
      leftSection: <IconMessageReport size={DEFAULT_ICON_SIZE} />,
    },
    {
      label: "Users",
      href: "/admin/users",
      description: "Verwalte die User von TheGenius",
      leftSection: <IconUser size={DEFAULT_ICON_SIZE} />,
    },
    {
      label: "Betatester",
      href: "/admin/betauser",
      description: "Füge neue Betatester hinzu",
      leftSection: <IconTestPipe size={DEFAULT_ICON_SIZE} />,
      disabled: true,
    },
  ],
};
