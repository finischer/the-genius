import { type Sx } from "@mantine/core";
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
  frontStyle?: Sx;
  backStyle?: Sx;
  setFlipped?: Dispatch<SetStateAction<boolean>>;
};
