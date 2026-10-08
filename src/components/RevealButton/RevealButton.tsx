import { Button, type ButtonProps } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import React from "react";

interface RevealButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  onReveal: () => void;
  revealed?: boolean;
  /** Label shown before reveal, e.g. "Antwort", "Flagge", "Frage" */
  label?: string;
}

/**
 * Consistent "reveal" button used across all games.
 * Once revealed it becomes disabled so it can't be clicked again.
 */
const RevealButton: React.FC<RevealButtonProps> = ({
  onReveal,
  revealed = false,
  label = "Antwort",
  variant = "default",
  ...rest
}) => {
  return (
    <Button
      variant={variant}
      leftSection={<IconEye size={16} />}
      disabled={revealed}
      onClick={onReveal}
      {...rest}
    >
      {revealed ? `${label} wird angezeigt` : `${label} aufdecken`}
    </Button>
  );
};

export default RevealButton;
