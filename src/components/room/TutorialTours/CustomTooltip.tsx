import { Box, Button, Group, Text, useMantineTheme } from "@mantine/core";
import { type TooltipRenderProps } from "react-joyride";
import { interactiveTourDefaultProps } from "./config";
import { IconX } from "@tabler/icons-react";

function CustomTooltip(props: TooltipRenderProps) {
  const {
    backProps,
    closeProps,
    continuous,
    index,
    primaryProps,
    step,
    size,
    tooltipProps
  } = props;
  const theme = useMantineTheme();
  const config = interactiveTourDefaultProps(theme);

  const styles = config.styles;

  return (
    <Box
      style={{
        borderRadius: theme.radius.xs,
        textAlign: "center"
      }}
      maw={400}
      bg={styles?.options?.backgroundColor}
      p="md"
      {...tooltipProps}
    >
      {/* Header */}
      <Group align="center" justify="center">
        <Text fw="bold">{step.title}</Text>
        <Button
          variant="transparent"
          onClick={closeProps.onClick}
          pos="absolute"
          color={theme.colors.gray[5]}
          right={0}
        >
          <IconX />
        </Button>
      </Group>

      {/* Content */}
      <Text py="md">{step.content}</Text>

      {/* Footer */}
      <Group justify="end">
        {index > 0 && (
          <Button
            {...backProps}
            color={theme.colors.gray[4]}
            variant="transparent"
          >
            {backProps.title}
          </Button>
        )}
        {continuous && (
          <Button {...primaryProps}>
            {primaryProps.title} ({index + 1}/{size})
          </Button>
        )}
      </Group>
    </Box>
  );
}

export default CustomTooltip;
