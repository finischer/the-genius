import { Drawer, Flex, ScrollArea, Text } from "@mantine/core";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useParams } from "next/navigation";
import React from "react";
import ActionIcon from "~/components/shared/ActionIcon";
import ModPanelContent from "./ModPanelContent";
import { type IModPanelProps } from "./modPanel.types";

const ModPanel: React.FC<IModPanelProps> = ({ disclosure }) => {
  const [isOpen, { close: closeModPanel }] = disclosure;
  const params = useParams();
  const roomId = params?.id as string;

  const handleDetach = () => {
    window.open(
      `/room/${roomId}/mod-panel`,
      "mod-panel",
      "width=420,height=800,menubar=no,toolbar=no,location=no,status=no"
    );
    closeModPanel();
  };

  const drawerTitle = (
    <Flex align="center" gap="xs">
      <Text fw={600}>Mod-Panel</Text>
      <ActionIcon
        variant="subtle"
        size="md"
        toolTip="In neuem Fenster öffnen"
        className="mod-panel-detach-btn"
        onClick={handleDetach}
      >
        <IconArrowUpRight size={20} />
      </ActionIcon>
    </Flex>
  );

  return (
    <Drawer
      opened={isOpen}
      onClose={closeModPanel}
      title={drawerTitle}
      offset={8}
      radius="md"
      overlayProps={{
        opacity: 0.15
      }}
      scrollAreaComponent={ScrollArea.Autosize}
      className="mod-panel-explanation"
    >
      <ModPanelContent />
    </Drawer>
  );
};

export default ModPanel;
