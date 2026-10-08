import { Button } from "@mantine/core";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import React from "react";

interface VisibilityToggleProps {
  label: string;
  visible: boolean;
  onToggle: () => void;
}

const VisibilityToggle: React.FC<VisibilityToggleProps> = ({
  label,
  visible,
  onToggle
}) => {
  return (
    <Button
      variant={visible ? "light" : "default"}
      color={visible ? "green" : "gray"}
      size="xs"
      fullWidth
      leftSection={visible ? <IconEye size={14} /> : <IconEyeOff size={14} />}
      onClick={onToggle}
    >
      {label} {visible ? "ausblenden" : "einblenden"}
    </Button>
  );
};

export default VisibilityToggle;
