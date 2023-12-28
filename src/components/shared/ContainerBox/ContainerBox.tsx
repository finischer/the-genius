import React from "react";
import { type IContainerBoxProps } from "./containerBox.types";
import { Box, Container } from "@mantine/core";
import { sizes } from "~/styles/constants";

const ContainerBox: React.FC<IContainerBoxProps> = ({
  children,
  contentCentered = false,
  withShadow = false,
  onClick = undefined,
  style,
  ...props
}) => {
  return (
    <Box
      {...props}
      style={(theme) => ({
        display: "flex",
        justifyContent: contentCentered ? "center" : "flex-start",
        alignItems: contentCentered ? "center" : "flex-start",
        borderRadius: sizes.borderRadius,
        boxShadow: withShadow ? theme.shadows.xl : "none",
        userSelect: "none",
        ...style,
      })}
      onClick={onClick}
    >
      {children}
    </Box>
  );
};

export default ContainerBox;
