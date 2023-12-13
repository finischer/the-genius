import { Badge as MantineBadge, Flex, rem, type BadgeProps } from "@mantine/core";
import { IconCrown, IconDiamond } from "@tabler/icons-react";
import React from "react";
import Tooltip from "../Tooltip";
import type { UserRole } from "@prisma/client";

interface IBadgeProps extends BadgeProps {
  tooltip?: string;
}

const AdminBadge = () => (
  <Badge
    color="yellow"
    tooltip="Admin"
  >
    <IconCrown style={{ width: rem(18), height: rem(18) }} />
  </Badge>
);

const PremimumBadge = () => (
  <Badge
    color="cyan"
    tooltip="Premium"
  >
    <IconDiamond style={{ width: rem(18), height: rem(18) }} />
  </Badge>
);

const RoleBadge = ({ role }: { role: UserRole }) => {
  if (role === "PREMIUM") return <PremimumBadge />;
  if (role === "ADMIN") return <AdminBadge />;
  return <></>;
};

const Badge: React.FC<IBadgeProps> = ({ tooltip, ...props }) => {
  return (
    <Tooltip label={tooltip}>
      <MantineBadge {...props}>
        <Flex
          align="center"
          justify="center"
        >
          {props.children}
        </Flex>
      </MantineBadge>
    </Tooltip>
  );
};

export { AdminBadge, PremimumBadge, RoleBadge };
