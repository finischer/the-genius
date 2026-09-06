import { Group, type GroupProps } from "@mantine/core";
import React from "react";
import ModView from "../ModView";

interface ModControlBarProps extends Omit<GroupProps, "children"> {
  children: React.ReactNode;
}

/**
 * Consistent wrapper for in-game moderator controls.
 * Renders nothing for non-moderators (delegates to ModView).
 * Provides a standardised Group layout so all games share the same spacing.
 */
const ModControlBar: React.FC<ModControlBarProps> = ({
  children,
  gap = "sm",
  justify = "center",
  align = "center",
  ...rest
}) => {
  return (
    <ModView>
      <Group gap={gap} justify={justify} align={align} {...rest}>
        {children}
      </Group>
    </ModView>
  );
};

export default ModControlBar;
