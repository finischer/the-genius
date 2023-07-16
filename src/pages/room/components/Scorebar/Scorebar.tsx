import { Box, Button, Flex, Text } from '@mantine/core'
import React from 'react'
import { colors } from '~/styles/constants'
import { type IScoreCircleProps, type IScorebarProps } from './scorebar.types'
import { useRoom } from '~/hooks/useRoom/useRoom'
import { useUser } from '~/hooks/useUser/useUser'
import { socket } from '~/hooks/useSocket'
import Loader from '~/components/Loader/Loader'


const ScoreCircle: React.FC<IScoreCircleProps> = ({ filled }) => (
    <Box
        sx={(theme) => ({
            height: "2rem",
            width: "2rem",
            background: filled ? colors.success : "transparent",
            borderRadius: "50%",
            border: "1px solid white",
            marginLeft: "0.8rem",
            transition: "background 500ms",
            "&:nth-child(1)": {
                marginLeft: 0
            }
        })}
    />
)

const Scorebar: React.FC<IScorebarProps> = ({ team }) => {
    const { room } = useRoom()
    const { user, isPlayer, setUserAsPlayer } = useUser();
    const scoreCircles = Array(7).fill(null).map((_, index) => <ScoreCircle key={index} filled={team.gameScore > index} />)

    const joinTeam = () => {
        socket.emit("joinTeam", ({ teamId: team.id, user }), () => {
            setUserAsPlayer(team)
        })
    }

    return (
        <Flex direction="column" >
            <Flex gap="lg">
                <Box sx={(theme) => ({
                    minWidth: "20%",
                    maxWidth: "50%",
                    height: "100%",
                    background: colors.accent,
                    display: "flex",
                    alignItems: "center",
                    padding: "0 1rem",
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
                {!isPlayer &&
                    <Button variant='subtle' mb="xs" onClick={joinTeam}>Beitreten</Button>
                }
            </Flex>

            <Flex gap="1rem" bg={colors.accent} h="3rem" w="30rem" sx={(theme) => ({ borderRadius: "0.25rem", borderTopLeftRadius: 0 })} p="0.5rem 1rem" pos="relative">
                {/* Player names */}
                <Box
                    sx={(theme) => ({
                        width: "50%",
                        height: "100%",
                        display: "inline-block",
                        position: "relative",

                    })}
                >
                    <Text sx={(theme) => ({
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