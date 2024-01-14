import { Avatar, Button, Flex, Text, TextInput, rem } from "@mantine/core";
import { IconCheck, IconEdit } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import Tooltip from "~/components/shared/Tooltip/Tooltip";
import { useUser } from "~/hooks/useUser";

const AccountSettingsSection = () => {
  const { data: session } = useSession();
  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState<string>(session?.user.username ?? "");
  const isEditable = editMode && session?.user.username;
  const { updateUsername, isLoading, user } = useUser();
  const usernameInputRef = useRef<HTMLInputElement>(null);

  const handleUpdateUsername = async () => {
    if (!username) return;
    await updateUsername(username);
    setEditMode(false);
    setUsername(user.username || "");
  };

  const enableEditMode = () => {
    setEditMode(true);
  };

  // when edit mode is on, then we want to focus the username input
  useEffect(() => {
    if (editMode) {
      usernameInputRef.current?.focus();
    }
  }, [editMode]);

  return (
    <Flex
      direction="column"
      gap="md"
      maw={rem(300)}
    >
      <Avatar
        src={session?.user.image}
        radius="100%"
        size="xl"
      />
      <>
        <Flex
          align="flex-end"
          gap="sm"
        >
          <TextInput
            ref={usernameInputRef}
            readOnly={!isEditable}
            disabled={!isEditable}
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {editMode ? (
            <Tooltip label="Username speichern">
              <Button
                onClick={handleUpdateUsername}
                loading={isLoading}
              >
                <IconCheck />
              </Button>
            </Tooltip>
          ) : (
            <Tooltip label="Username ändern">
              <Button
                variant="default"
                onClick={enableEditMode}
                loading={isLoading}
              >
                <IconEdit />
              </Button>
            </Tooltip>
          )}
        </Flex>
        <Text
          c="dimmed"
          size="sm"
        >
          Der Username wird in den Spielshows verwendet und ist für andere User sichtbar
        </Text>
      </>
      <>
        <TextInput
          readOnly
          disabled
          label="Name"
          type="text"
          value={session?.user.name || "NAME NOT FOUND"}
        />
        <Text
          c="dimmed"
          size="sm"
        >
          Dein Name wird nicht öffentlich angezeigt und kann nicht geändert werden
        </Text>
      </>
      <TextInput
        readOnly
        disabled
        label="Email"
        type="email"
        value={session?.user.email || "EMAIL NOT FOUND"}
      />

      <Button
        mt="lg"
        c="red"
        disabled
      >
        Account löschen
      </Button>
      <Text
        c="dimmed"
        size="sm"
      >
        Diese Funktion ist noch nicht verfügbar
      </Text>
    </Flex>
  );
};

export default AccountSettingsSection;
