import { type PaperProps, Paper as MantinePaper, UnstyledButton } from "@mantine/core";
import React, { type FC, type ReactNode } from "react";
import classes from "./paper.module.css";

interface IPaperProps extends PaperProps {
  children: ReactNode;
  variant?: "light" | "dark";
  onClick?: () => void | null;
}

const Paper: FC<IPaperProps> = ({ variant = "dark", children, onClick = null, ...props }) => {
  const bgColor = variant === "dark" ? "dark.9" : "dark.7";
  const disabled = !onClick;
  const handleClick = () => {
    if (disabled) return;
    onClick();
  };

  return (
    <UnstyledButton
      className={!disabled ? classes.btn : undefined}
      onClick={handleClick}
      style={{
        cursor: disabled ? "auto" : "pointer",
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
