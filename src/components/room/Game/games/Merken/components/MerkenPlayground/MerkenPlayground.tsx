import { SimpleGrid, Text } from "@mantine/core";
import React from "react";
import FlipCard from "~/components/shared/FlipCard/FlipCard";
import type { IMerkenPlaygroundProps } from "./merkenPlayground.types";
import Image from "next/image";
import type { MantineStyleProp } from "@mantine/core";

const MerkenPlayground: React.FC<IMerkenPlaygroundProps> = ({
  cards,
  openCards = [],
  clickable = false,
  allCardsFlipped = false,
  onCardClick,
}) => {
  const defaultCardStyle: MantineStyleProp = {
    height: "5rem",
    width: "5rem",
    backgroundColor: "whitesmoke",
    color: "black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    userSelect: "none",
  };

  const FrontContent = ({ content }: { content: number }) => {
    return <Text size="1.5rem">{content}</Text>;
  };

  const BackContent = ({ content, index }: { content: string; index: number }) => {
    return (
      <div>
        <span
          style={{
            position: "absolute",
            top: "0.25rem",
            left: "0.5rem",
            fontSize: "1rem",
            fontWeight: "500",
            opacity: 0.7,
          }}
        >
          {index + 1}
        </span>
        <Image
          src={content}
          alt={index.toString()}
          width={48}
          height={48}
        />
      </div>
    );
  };

  return (
    <SimpleGrid cols={{ base: 4, md: 6, lg: 6 }}>
      {cards.map((elem, idx) => (
        <FlipCard
          key={idx}
          isFlipped={allCardsFlipped || openCards.includes(idx)}
          clickable={clickable}
          onClick={() => onCardClick && onCardClick(idx)}
          front={<FrontContent content={idx + 1} />}
          back={
            <BackContent
              index={idx}
              content={elem}
            />
          }
          frontStyle={{
            ...defaultCardStyle,
          }}
          backStyle={{
            ...defaultCardStyle,
          }}
        />
      ))}
    </SimpleGrid>
  );
};

export default MerkenPlayground;
