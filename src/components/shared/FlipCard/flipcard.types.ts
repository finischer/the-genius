import { type MantineStyleProp } from "@mantine/core";
import { type Dispatch, type SetStateAction } from "react";

export type TConditionalFlippedState =
  | {
      clickable?: true;
      isFlipped: boolean;
    }
  | {
      clickable?: false;
      isFlipped?: boolean;
    };

export type IFlipCardProps = TConditionalFlippedState & {
  front?: React.ReactNode;
  back?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  frontStyle?: MantineStyleProp;
  backStyle?: MantineStyleProp;
  setFlipped?: Dispatch<SetStateAction<boolean>>;
};
