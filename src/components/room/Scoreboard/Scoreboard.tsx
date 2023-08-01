import { Avatar, Container, Flex, Text, useMantineTheme } from '@mantine/core';
import React from 'react';
import { useRoom } from '~/hooks/useRoom';
import type { IScoreboardProps } from './scoreboard.types';

const SCOREBOARD_BORDER_BACKGROUND_COLOR = "#7b68ee"
const SCOREBOARD_BACKGROUND_COLOR = "#D8BFD8"
const DIVIDER_COLOR = "#f7f1f1"

const Scoreboard: React.FC<IScoreboardProps> = ({ team, color }) => {
    const theme = useMantineTheme()
    const { room } = useRoom()
    const minNumOfGamesToWin = Math.round((room.games.length + 1) / 2) + 2;

    const GREEN_GRADIENT = theme.fn.linearGradient(90, "#00C9FF", "#92FE9D")
    const RED_GRADIENT = theme.fn.linearGradient(90, "#D53369", "#DAAE51")

    const lineElements = [...Array(minNumOfGamesToWin)].map((_, index) => (
        <Container p={0} key={index} m="1.2rem 0" w="12rem" opacity={0.8} sx={{
            borderRight: index + 1 < minNumOfGamesToWin ? `1px solid ${DIVIDER_COLOR}` : "none"
        }} />
    ));

    const scoreColor = color === "green" ? GREEN_GRADIENT : RED_GRADIENT

    const increaseScore = () => { }
    const decreaseScore = () => { }

    return (
        <Flex h="10rem" align="center" p="2rem">
            <Flex align="center">
                <Text color='white' p="0 1rem" weight="bold">{team.name}</Text>
                <Avatar radius="100px" size="xl" variant="filled" />

                <Flex bg={SCOREBOARD_BACKGROUND_COLOR} h="7rem" ml="2rem" pos="relative" sx={{ border: `1px solid ${SCOREBOARD_BORDER_BACKGROUND_COLOR}`, borderRadius: "100px", overflow: "hidden" }} >
                    <Flex h="100%" bg="red" sx={{ borderRadius: "100px" }} />
                    {lineElements}
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                    }} />
                    <Container
                        p={0}
                        h="100%"
                        w={`calc(${team.totalScore} * (100% / ${lineElements.length}) )`}
                        bg={scoreColor}
                        pos="absolute"
                        top={0}
                        bottom={0}
                        left={0}
                        sx={{
                            borderRadius: "100px",
                            transition: "width 2s"
                        }}
                    />
                </Flex>

            </Flex>

        </Flex>
    )
}

export default Scoreboard