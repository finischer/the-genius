import { Container, Title, useMantineTheme, type MantineStyleProp, Box } from "@mantine/core";
import React from "react";
import ReactCardFlip from "react-card-flip";
import { sizes } from "~/styles/constants";
import { type IFlipCardProps } from "./flipcard.types";
import classes from "./flipcard.module.css";

const FlipCard: React.FC<IFlipCardProps> = ({
  isFlipped = false,
  setFlipped,
  clickable,
  onClick = () => null,
  front,
  back,
  frontStyle = {},
  backStyle = {},
}) => {
  const theme = useMantineTheme();
  const themeColors = theme.colors[theme.primaryColor];

  const defaultCardStyle: MantineStyleProp = {
    boxShadow: "4px 3px 32px -7px rgba(0, 0, 0, 0.75)",
    WebkitBoxShadow: "4px 3px 32px -7px rgba(0, 0, 0, 0.75)",
    padding: "1rem 2.5rem",
    textAlign: "center",
    borderRadius: sizes.borderRadius,
    whiteSpace: "nowrap",
    textTransform: "uppercase",
  };

  const handleClick = () => {
    if (clickable) {
      if (setFlipped) {
        setFlipped((oldState) => !oldState);
      }
      onClick();
    }
  };

  return (
    <Box
      onClick={handleClick}
      className={classes.flipcard}
      data-clickable={clickable}
    >
      <ReactCardFlip
        isFlipped={isFlipped}
        flipDirection="horizontal"
        flipSpeedFrontToBack={0.9}
        cardStyles={{
          front: {
            ...defaultCardStyle,
            backgroundColor: themeColors ? themeColors[9] : theme.primaryColor,
            ...frontStyle,
          },
          back: {
            ...defaultCardStyle,
            backgroundColor: themeColors ? themeColors[7] : theme.primaryColor,
            ...backStyle,
          },
        }}
      >
        {/* Front */}
        <Container>
          <Title>{front}</Title>
        </Container>

        {/* Back */}
        <Container>
          <Title>{back}</Title>
        </Container>
      </ReactCardFlip>
    </Box>
  );
};

export default FlipCard;
