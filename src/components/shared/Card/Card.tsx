import { Box, Flex, Paper, Text, UnstyledButton, rem } from "@mantine/core";
import { IconSquareRoundedChevronRight } from "@tabler/icons-react";
import { type FC } from "react";
import type { ICardProps } from "./card.types";
import classes from "./card.module.css";

const Card: FC<ICardProps> = ({ title, Icon, subTitle, onClick, disabled = false }) => {
  return (
    <UnstyledButton
      className={!disabled ? classes.btn : undefined}
      onClick={onClick}
      disabled={disabled}
      style={{
        cursor: disabled ? "auto" : "pointer",
      }}
    >
      <Paper
        bg="dark.9"
        mih={rem(110)}
        w={rem(200)}
        radius="sm"
        shadow="sm"
        opacity={disabled ? 0.3 : 1}
        style={{
          userSelect: disabled ? "none" : "all",
        }}
      >
        {Icon && (
          <Box mb="xs">
            <Icon size={28} />
          </Box>
        )}
        <Flex
          justify="space-between"
          align="flex-end"
        >
          <Box>
            <Text fw="bolder">{title}</Text>
            <Text size="xs">{subTitle}</Text>
          </Box>
          {onClick && (
            <Box ml="sm">
              <IconSquareRoundedChevronRight />
            </Box>
          )}
        </Flex>
      </Paper>
    </UnstyledButton>
  );
};

export default Card;
