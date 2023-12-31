import { type PaperProps, Paper as MantinePaper, UnstyledButton } from "@mantine/core";
import React, { type FC, type ReactNode } from "react";
import classes from "./paper.module.css";

interface IPaperProps extends PaperProps {
  children: ReactNode;
  variant?: "light" | "dark";
  disabled?: boolean;
  onClick?: () => void | null;
}

const Paper: FC<IPaperProps> = ({
  variant = "dark",
  disabled = false,
  children,
  onClick = null,
  ...props
}) => {
  const bgColor = variant === "dark" ? "dark.9" : "dark.7";

  const handleClick = () => {
    if (disabled || !onClick) return;
    onClick();
  };

  return (
    <UnstyledButton
      className={!disabled && onClick ? classes.btn : undefined}
      onClick={handleClick}
      disabled={disabled}
      style={{
        cursor: disabled || !onClick ? "auto" : "pointer",
      }}
    >
      <MantinePaper
        variant={variant}
        bg={bgColor}
        {...props}
      >
        {children}
      </MantinePaper>
    </UnstyledButton>
  );
};

export default Paper;
