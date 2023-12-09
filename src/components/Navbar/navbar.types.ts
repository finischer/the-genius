import type { NavLinkProps } from "@mantine/core";

export type TNavbarTab = NavLinkProps & {
  href: string;
};

export interface INavbarTabs {
  normal: TNavbarTab[];
  admin: TNavbarTab[];
}
