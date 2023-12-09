import { IconMessageReport, IconThumbUp } from "@tabler/icons-react";
import ActionIcon from "../ActionIcon";
import type { IFeedbackButtonProps } from "./feedbackButton.types";

const FeedbackButton: React.FC<IFeedbackButtonProps> = ({ onClick, ...props }) => {
  return (
    <ActionIcon
      {...props}
      pos="absolute"
      right={20}
      bottom={100}
      radius="xl"
      size="xl"
      sx={(theme) => ({
        zIndex: 99999,
        boxShadow: theme.shadows.xl,
      })}
      variant="filled"
      color="brand"
      toolTip="Feedback geben"
      onClick={onClick}
    >
      <IconMessageReport />
    </ActionIcon>
  );
};

export default FeedbackButton;
