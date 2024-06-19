import { Flex, Modal, Slider, Stack, Text } from "@mantine/core";
import React, { type ReactNode } from "react";
import useSettings from "~/hooks/useSettings/useSettings";
import type { ISettingsModalProps } from "./settingsModal.types";

const SettingsModal: React.FC<ISettingsModalProps> = ({ openedModal, onClose }) => {
  const { settings, updateSettings, primaryColor } = useSettings();

  const SettingsRow = ({ title, children }: { title: string; children: ReactNode }) => (
    <Stack>
      <Text>{title}</Text>
      {children}
    </Stack>
  );

  return (
    <Modal
      opened={openedModal}
      onClose={onClose}
      title="Einstellungen"
      centered
      size="xl"
    >
      <Flex
        direction="column"
        gap="xl"
      >
        <Text>Lautstärke (Soundeffekte)</Text>
        <Slider
          color={primaryColor}
          value={settings.volume.soundEffects}
          onChange={(value) =>
            updateSettings({ ...settings, volume: { ...settings.volume, soundEffects: value } })
          }
          marks={[
            { value: 20, label: "20%" },
            { value: 50, label: "50%" },
            { value: 80, label: "80%" },
          ]}
        />

        <Text>Lautstärke (Musik)</Text>
        <Slider
          color={primaryColor}
          disabled
          value={settings.volume.music}
          onChange={(value) => updateSettings({ ...settings, volume: { ...settings.volume, music: value } })}
          marks={[
            { value: 20, label: "20%" },
            { value: 50, label: "50%" },
            { value: 80, label: "80%" },
          ]}
        />
      </Flex>
    </Modal>
  );
};

export default SettingsModal;
