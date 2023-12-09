import { IconMessageReport, IconThumbUp } from "@tabler/icons-react";
import ActionIcon from "../ActionIcon";
import type { IFeedbackButtonProps } from "./feedbackButton.types";
import { useMantineTheme } from "@mantine/core";

const FeedbackButton: React.FC<IFeedbackButtonProps> = ({ onClick, ...props }) => {
  const theme = useMantineTheme();

  return (
    <ActionIcon
      {...props}
      pos="fixed"
      right={20}
      bottom={100}
      radius="xl"
      size="xl"
      sx={(theme) => ({
        zIndex: 99999,
        boxShadow: theme.shadows.xl,
      })}
      variant="filled"
      color={theme.primaryColor}
      toolTip="Feedback geben"
      onClick={onClick}
    >
      <IconMessageReport />
    </ActionIcon>
  );
};

export default FeedbackButton;
