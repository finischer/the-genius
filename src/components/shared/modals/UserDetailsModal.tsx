import {
  Avatar,
  Badge,
  Box,
  Divider,
  Group,
  Stack,
  Text,
  ThemeIcon
} from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import type { ContextModalProps } from "@mantine/modals";
import type { User } from "~/generated/prisma/client";
import React from "react";
import { formatTimestamp } from "~/utils/dates";
import {
  IconAt,
  IconCalendar,
  IconCheck,
  IconId,
  IconShield,
  IconUser,
  IconX
} from "@tabler/icons-react";
import type { UserRole } from "~/generated/prisma/enums";
import { ROLE_COLOR, ROLE_LABEL } from "~/components/shared/Badge/Badge";
import Tooltip from "../Tooltip";

// role is always set in the DB — narrow the Prisma type to reflect that
type TUserWithRole = Omit<User, "role"> & { role: UserRole };

interface IUserDetailsModalProps {
  user: TUserWithRole;
}

interface IDetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  copyValue?: string;
}

const DetailRow: React.FC<IDetailRowProps> = ({
  icon,
  label,
  value,
  copyValue
}) => {
  const clipboard = useClipboard({ timeout: 1500 });

  const content = (
    <Group
      gap="sm"
      wrap="nowrap"
      onClick={copyValue ? () => clipboard.copy(copyValue) : undefined}
      style={
        copyValue
          ? {
              cursor: "pointer",
              borderRadius: "var(--mantine-radius-sm)",
              padding: "4px 6px",
              margin: "-4px -6px",
              transition: "background 120ms ease"
            }
          : undefined
      }
      onMouseEnter={
        copyValue
          ? (e) => {
              (e.currentTarget as HTMLElement).style.background =
                "var(--mantine-color-dark-6)";
            }
          : undefined
      }
      onMouseLeave={
        copyValue
          ? (e) => {
              (e.currentTarget as HTMLElement).style.background = "transparent";
            }
          : undefined
      }
    >
      <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
        {icon}
      </ThemeIcon>
      <Box style={{ flex: 1, minWidth: 0 }}>
        <Text size="xs" c="dimmed" lh={1.2}>
          {label}
        </Text>
        <Text size="sm" fw={500} style={{ wordBreak: "break-all" }}>
          {value}
        </Text>
      </Box>
    </Group>
  );

  if (!copyValue) return content;

  return (
    <Tooltip
      label={clipboard.copied ? "Kopiert!" : "Klicken zum Kopieren"}
      position="right"
    >
      {content}
    </Tooltip>
  );
};

const UserDetailsModal: React.FC<ContextModalProps<IUserDetailsModalProps>> = ({
  innerProps
}) => {
  const { user } = innerProps;

  const roleColor = ROLE_COLOR[user.role];
  const roleLabel = ROLE_LABEL[user.role];

  return (
    <Stack gap="lg">
      {/* Header — centered, no banner */}
      <Stack gap={4} align="center" pt="xs">
        <Avatar size={80} src={user.image} radius="50%" color={roleColor}>
          {user.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <Text fw={700} size="lg" ta="center" mt={4}>
          {user.name ?? "–"}
        </Text>
        <Group gap="xs" justify="center">
          {user.username && (
            <Text size="sm" c="dimmed">
              @{user.username}
            </Text>
          )}
          <Badge color={roleColor} variant="light" size="sm" radius="sm">
            {roleLabel}
          </Badge>
        </Group>
      </Stack>

      <Divider />

      {/* Details */}
      <Stack gap="sm">
        <DetailRow
          icon={<IconId size={12} />}
          label="ID"
          copyValue={user.id}
          value={
            <Text
              size="sm"
              fw={500}
              ff="monospace"
              style={{ wordBreak: "break-all" }}
            >
              {user.id}
            </Text>
          }
        />
        <DetailRow
          icon={<IconAt size={12} />}
          label="E-Mail"
          copyValue={user.email ?? undefined}
          value={
            <Group gap={6} wrap="nowrap">
              <Text size="sm" fw={500}>
                {user.email ?? "–"}
              </Text>
              {user.isEmailVerified ? (
                <ThemeIcon color="green" variant="light" size="xs" radius="xl">
                  <IconCheck size={10} />
                </ThemeIcon>
              ) : (
                <ThemeIcon color="red" variant="light" size="xs" radius="xl">
                  <IconX size={10} />
                </ThemeIcon>
              )}
            </Group>
          }
        />
        <DetailRow
          icon={<IconUser size={12} />}
          label="Benutzername"
          copyValue={user.username ?? undefined}
          value={user.username ?? "–"}
        />
        <DetailRow
          icon={<IconShield size={12} />}
          label="Rolle"
          value={
            <Badge color={roleColor} variant="light" size="sm" radius="sm">
              {roleLabel}
            </Badge>
          }
        />
        <DetailRow
          icon={<IconCalendar size={12} />}
          label="Zuletzt geändert"
          value={formatTimestamp(user.updatedAt)}
        />
      </Stack>
    </Stack>
  );
};

export default UserDetailsModal;
