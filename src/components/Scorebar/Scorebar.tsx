import { Box, Button, Flex, Group, Text, keyframes } from '@mantine/core'
import { IconExposureMinus1, IconExposurePlus1, IconTargetArrow } from '@tabler/icons-react'
import React from 'react'
import { useRoom } from '~/hooks/useRoom'
import { socket } from '~/hooks/useSocket'
import { useUser } from '~/hooks/useUser'
import { colors, sizes } from '~/styles/constants'
import ActionIcon from '../ActionIcon/ActionIcon'
import { type IScoreCircleProps, type IScorebarProps } from './scorebar.types'


const stretchAnimation = keyframes({
    "0%": { transform: "scale(0.75)" },
    "100%": { transform: "scale(1.25)" }
})

const HIGHLIGHT_CONTAINER_COLOR = "#c6011f"


const ScoreCircle: React.FC<IScoreCircleProps> = ({ filled }) => (
    <Box
        sx={() => ({
            height: "2rem",
            width: "2rem",
            background: filled ? colors.success : "transparent",
            borderRadius: "50%",
            border: "1px solid white",
            marginLeft: "0.8rem",
            transition: "background 500ms",
            "&:nth-of-type(1)": {
                marginLeft: 0
            }
        })}
    />
)

const Scorebar: React.FC<IScorebarProps> = ({ team }) => {
    const { room, currentGame } = useRoom()
    const { user, isHost, isPlayer, setUserAsPlayer } = useUser();
    const scoreCircles = currentGame ? Array(currentGame.maxPoints).fill(null).map((_, index) => <ScoreCircle key={index} filled={team.gameScore > index} />) : undefined
    const isTeamFull = team.players.length >= room.maxPlayersPerTeam
    const highlightBoxShadow = team.isActiveTurn ? `0px 0px 50px 50px ${HIGHLIGHT_CONTAINER_COLOR}` : ""

    const joinTeam = () => {
        if (isPlayer) return
        socket.emit("joinTeam", ({ teamId: team.id, user }), () => {
            setUserAsPlayer(team)
        })
    }

    const increaseGameScore = (step = 1) => {
        if (!currentGame || team.gameScore >= currentGame?.maxPoints) return
        socket.emit("increaseGameScore", ({ teamId: team.id, step }))
    }

    const decreaseGameScore = (step = 1) => {
        if (team.gameScore <= 0) return
        socket.emit("decreaseGameScore", ({ teamId: team.id, step }))
    }

    const toggleTeamActiveState = () => {
        socket.emit("toggleTeamActive", { teamId: team.id })
    }

    return (
        <Flex direction="column" pos="relative" >
            {/* Highlight container to represent that it is the turn of this team  */}
            <Box
                pos="absolute"
                left="50%"
                bottom="50%"
                opacity={0.9}
                sx={{
                    boxShadow: highlightBoxShadow,
                    WebkitBoxShadow: highlightBoxShadow,
                    animationName: stretchAnimation,
                    animationDuration: "2s",
                    animationTimingFunction: "ease-out",
                    animationIterationCount: "infinite",
                    animationDirection: "alternate",
                    animationPlayState: "running",
                }}
            />

            <Flex gap="lg">
                <Box sx={() => ({
                    minWidth: "20%",
                    maxWidth: "50%",
                    height: "100%",
                    background: colors.accent,
                    display: "flex",
                    alignItems: "center",
                    padding: "0.25rem 1rem",
                    borderRadius: "0.25rem 0.2rem 0 0",
                    fontWeight: "bolder",
                    overflow: "hidden",

                    "span": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                    }
                })}>
                    <span>
                        {team.name} · ({team.players.length}/{room?.numOfPlayers})
                    </span>

                </Box>
                {!isPlayer && !isHost && !isTeamFull &&
                    <Button variant='subtle' mb="xs" onClick={joinTeam}>Beitreten</Button>
                }

                {isHost &&
                    <Group mb="xs">
                        <ActionIcon
                            variant='outline'
                            toolTip={`${team.name} an der Reihe sein lassen`}
                            onClick={toggleTeamActiveState}
                        >
                            <IconTargetArrow size={sizes.icon.s} />
                        </ActionIcon>
                        <ActionIcon
                            variant='outline'
                            toolTip="Score -1"
                            onClick={() => decreaseGameScore()}
                        >
                            <IconExposureMinus1 size={sizes.icon.s} />
                        </ActionIcon>
                        <ActionIcon
                            variant='outline'
                            toolTip="Score +1"
                            onClick={() => increaseGameScore()}
                        >
                            <IconExposurePlus1 size={sizes.icon.s} />
                        </ActionIcon>
                    </Group>
                }

            </Flex>

            <Flex gap="1rem" bg={colors.accent} h="3rem" w="30rem" sx={(theme) => ({ borderRadius: "0.25rem", borderTopLeftRadius: 0, boxShadow: theme.shadows.xl })} p="0.5rem 1rem" pos="relative">
                {/* Player names */}
                <Box
                    sx={() => ({
                        width: "50%",
                        height: "100%",
                        display: "inline-block",
                        position: "relative",

                    })}
                >
                    <Text sx={() => ({
                        width: "100%",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                        textOverflow: "ellipsis",
                        position: "absolute",
                        top: "50%",
                        transform: "translateY(-50%)",
                        display: "flex"
                    })}>
                        {team.players.map(p => p.name).join("/") || "Noch keiner da"}
                    </Text>
                </Box>

                {/* Score circles */}
                <Flex
                    w="100%"
                    h="100%"
                    justify="center"
                >
                    {scoreCircles}
                </Flex>
            </Flex>
        </Flex>
    )
}

export default Scorebar