import {
  Badge as MantineBadge,
  Flex,
  rem,
  type BadgeProps
} from "@mantine/core";
import { IconCrown, IconDiamond, IconUser } from "@tabler/icons-react";
import React from "react";
import Tooltip from "../Tooltip";
import type { UserRole } from "~/generated/prisma/enums";

interface IBadgeProps extends BadgeProps {
  tooltip?: string;
}

interface IAdminBadgeProps {
  disableTooltip?: boolean;
}

export const ROLE_COLOR: Record<UserRole, string> = {
  ADMIN: "gold.8",
  PREMIUM: "cyan",
  USER: "gray",
  GUEST: "gray"
};

export const ROLE_LABEL: Record<UserRole, string> = {
  ADMIN: "Admin",
  PREMIUM: "Premium",
  USER: "User",
  GUEST: "Gast"
};

const AdminBadge: React.FC<IAdminBadgeProps> = ({ disableTooltip }) => (
  <Badge
    color={ROLE_COLOR.ADMIN}
    tooltip={disableTooltip ? undefined : ROLE_LABEL.ADMIN}
  >
    <IconCrown style={{ width: rem(18), height: rem(18) }} />
  </Badge>
);

const PremimumBadge = () => (
  <Badge color={ROLE_COLOR.PREMIUM} tooltip={ROLE_LABEL.PREMIUM}>
    <IconDiamond style={{ width: rem(18), height: rem(18) }} />
  </Badge>
);

const UserBadge = () => (
  <Badge color={ROLE_COLOR.USER} tooltip={ROLE_LABEL.USER}>
    <IconUser style={{ width: rem(18), height: rem(18) }} />
  </Badge>
);

const RoleBadge = ({ role }: { role: UserRole }) => {
  if (role === "PREMIUM") return <PremimumBadge />;
  if (role === "ADMIN") return <AdminBadge />;
  return <UserBadge />;
};

const Badge: React.FC<IBadgeProps> = ({ tooltip, ...props }) => {
  return (
    <Tooltip label={tooltip}>
      <MantineBadge {...props}>
        <Flex align="center" justify="center">
          {props.children}
        </Flex>
      </MantineBadge>
    </Tooltip>
  );
};

export { AdminBadge, PremimumBadge, UserBadge, RoleBadge };
