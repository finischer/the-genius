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

const AdminBadge: React.FC<IAdminBadgeProps> = ({ disableTooltip }) => (
  <Badge color="gold.8" tooltip={disableTooltip ? undefined : "Admin"}>
    <IconCrown style={{ width: rem(18), height: rem(18) }} />
  </Badge>
);

const PremimumBadge = () => (
  <Badge color="cyan" tooltip="Premium">
    <IconDiamond style={{ width: rem(18), height: rem(18) }} />
  </Badge>
);

const UserBadge = () => (
  <Badge color="gray" tooltip="User">
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
