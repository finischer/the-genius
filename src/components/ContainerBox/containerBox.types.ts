import { type BoxProps } from "@mantine/core";

export interface IContainerBoxProps extends BoxProps {
  children: React.ReactNode;
  contentCentered?: boolean;
  withShadow?: boolean;
}
