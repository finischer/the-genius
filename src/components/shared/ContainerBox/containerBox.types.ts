import { type BoxProps, type Sx } from "@mantine/core";

export interface IContainerBoxProps extends BoxProps {
  children: React.ReactNode;
  contentCentered?: boolean;
  withShadow?: boolean;
  onClick?: () => void;
  style?: Sx;
}
