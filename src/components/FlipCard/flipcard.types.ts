import { type Dispatch, type SetStateAction } from "react";

export type TConditionalFlippedState =
  | {
      clickable?: true;
      isFlipped: boolean;
      setFlipped: Dispatch<SetStateAction<boolean>>;
    }
  | {
      clickable?: false;
      isFlipped?: boolean;
      setFlipped?: Dispatch<SetStateAction<boolean>>;
    };

export type IFlipCardProps = TConditionalFlippedState & {
  front?: React.ReactNode;
  back?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
};
