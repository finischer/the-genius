import { type BoxProps, type MantineStyleProp } from "@mantine/core";

export interface IContainerBoxProps extends BoxProps {
  children: React.ReactNode;
  contentCentered?: boolean;
  withShadow?: boolean;
  onClick?: () => void;
  style?: MantineStyleProp;
}
