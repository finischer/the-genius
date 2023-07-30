import { Button, Flex, Image, Text, useMantineTheme } from '@mantine/core'
import React, { useState } from 'react'
import { useUser } from '~/hooks/useUser'
import { type IFlaggenGameProps } from './flaggen.types'
import ActionIcon from '~/components/ActionIcon/ActionIcon'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { socket } from '~/hooks/useSocket'

const FlaggenGame: React.FC<IFlaggenGameProps> = ({ game }) => {
    const { isHost } = useUser()
    const theme = useMantineTheme()
    const displayFlag = game.display.country
    const currFlag = game.countries[game.qIndex]
    const nxtBtnDisabled = game.qIndex >= game.countries.length - 1
    const prevBtnDisabled = game.qIndex <= 0;

    const handleFlagClick = () => {
        if (!isHost || displayFlag) return
        socket.emit("showFlag")
    }

    const handleNextFlagClick = () => {
        socket.emit("hideAnswerBanner")
        socket.emit("nextFlag")

    }

    const handlePrevFlagClick = () => {
        socket.emit("hideAnswerBanner")
        socket.emit("prevFlag")
    }

    const handleShowAnswerClick = () => {
        if (!currFlag?.country) return
        socket.emit("showAnswerBanner", { answer: currFlag?.country })

    }


    return (
        <Flex
            direction="column"
            gap="md"
            align="center"
        >
            {isHost && <Text>Flagge {game.qIndex + 1} / {game.countries.length}</Text>}
            <Flex gap="4rem" align="center">
                {isHost &&
                    <ActionIcon
                        onClick={handlePrevFlagClick}
                        color={theme.primaryColor}
                        variant='filled'
                        toolTip='Vorherige Flagge zeigen'
                        disabled={prevBtnDisabled}
                    >
                        <IconArrowLeft />
                    </ActionIcon>
                }
                <Image
                    src={`https://flagcdn.com/w640/${currFlag?.shortCode}.png`}
                    alt='Image not found'
                    radius="sm"
                    opacity={displayFlag ? 1 : isHost ? 0.5 : 0}
                    onClick={handleFlagClick}
                    sx={{
                        transform: `scale(${displayFlag ? "1" : "0.9"})`,
                        transition: "all 500ms",
                        userSelect: "none",
                        ":hover": isHost && !displayFlag ? {
                            cursor: isHost ? "pointer" : "auto",
                            opacity: 0.3
                        } : undefined
                    }}
                />
                {isHost &&
                    <ActionIcon
                        onClick={handleNextFlagClick}
                        color={theme.primaryColor}
                        variant='filled'
                        toolTip='Nächste Flagge zeigen'
                        disabled={nxtBtnDisabled}
                    >
                        <IconArrowRight />
                    </ActionIcon>
                }
            </Flex>
            {isHost && (
                <Flex
                    gap="lg"
                    direction="column"
                    align="center"
                    justify="center"
                >
                    <Text>Antwort: {currFlag?.country}</Text>

                    <Button onClick={handleShowAnswerClick}>Antwort aufdecken</Button>

                </Flex>
            )}
        </Flex>
    )
}

export default FlaggenGame