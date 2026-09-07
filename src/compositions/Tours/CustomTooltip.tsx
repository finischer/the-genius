import {
  Box,
  Button,
  Checkbox,
  Group,
  Text,
  useMantineTheme
} from "@mantine/core";
import { type TooltipRenderProps } from "react-joyride";
import { interactiveTourDefaultProps } from "./config";
import { IconX } from "@tabler/icons-react";
import { useEffect, useState, type FC } from "react";
import { useLocalStorage } from "@mantine/hooks";

interface CustomTooltipProps extends TooltipRenderProps {
  tourId: string;
}

const CustomTooltip: FC<CustomTooltipProps> = ({ tourId, ...props }) => {
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
  const [runInteractiveTour, setRunInteractiveTour] = useLocalStorage({
    key: tourId,
    defaultValue: true
  });
  const [checkboxChecked, setCheckboxChecked] = useState(runInteractiveTour);
  const theme = useMantineTheme();
  const config = interactiveTourDefaultProps(theme);

  const styles = config.styles;

  useEffect(() => {
    setCheckboxChecked(runInteractiveTour);
  }, [runInteractiveTour]);

  return (
    <Box
      style={{
        borderRadius: theme.radius.xs,
        textAlign: "center"
      }}
      w={600}
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
      <Group justify="space-between">
        <Checkbox
          checked={!checkboxChecked}
          label="Tour nicht mehr anzeigen"
          onChange={(event) => {
            setRunInteractiveTour(!event.currentTarget.checked);
          }}
        />
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
              Weiter ({index + 1}/{size})
            </Button>
          )}
        </Group>
      </Group>
    </Box>
  );
};

export default CustomTooltip;
