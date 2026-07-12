import { Drawer, ScrollArea } from "@mantine/core";
import React from "react";
import ModPanelContent from "./ModPanelContent";
import { type IModPanelProps } from "./modPanel.types";

const ModPanel: React.FC<IModPanelProps> = ({ disclosure }) => {
  const [isOpen, { close: closeModPanel }] = disclosure;

  return (
    <Drawer
      opened={isOpen}
      onClose={closeModPanel}
      title="Mod-Panel"
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
