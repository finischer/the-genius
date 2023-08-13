import { Container, Flex, NumberInput } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import MerkenPlayground from '~/components/room/Game/games/Merken/components/MerkenPlayground/MerkenPlayground'
import { useConfigurator } from '~/hooks/useConfigurator'

const MAX_TIME_TO_THINK_SECONDS = 180 // 3 minutes
const MIN_TIME_TO_THINK_SECONDS = 1

const MerkenConfigurator = () => {
    const [merken, setMerken, { enableFurtherButton, disableFurtherButton }] = useConfigurator("merken")
    const cards = new Array(24).fill(null).map((_, idx) => idx.toString());
    const [openCards, updateOpenCards] = useImmer<number[]>([])

    const updateTimeToThink = (value: number | "") => {
        if (value === "") return

        setMerken(draft => {
            draft.merken.timerState.timeToThinkSeconds = value
        })
    }

    const handleCardClick = (index: number) => {
        updateOpenCards(draft => {
            if (openCards.includes(index)) {
                return draft.filter(i => i !== index)
            } else {
                draft.push(index)
            }
        })
    }

    useEffect(() => {
        const timeToThink = merken.timerState.timeToThinkSeconds
        if (timeToThink >= MIN_TIME_TO_THINK_SECONDS && timeToThink <= MAX_TIME_TO_THINK_SECONDS) {
            enableFurtherButton()
        } else {
            disableFurtherButton()
        }
    }, [merken])


    return (
        <Flex direction="column" gap="md" align="center">
            <NumberInput
                defaultValue={merken.timerState.timeToThinkSeconds}
                label="Nachdenkzeit"
                description="in Sekunden"
                min={MIN_TIME_TO_THINK_SECONDS}
                max={MAX_TIME_TO_THINK_SECONDS}
                size='md'
                onChange={updateTimeToThink}
                value={merken.timerState.timeToThinkSeconds}
            />

            <MerkenPlayground
                cards={cards}
                openCards={openCards}
                clickable
                onCardClick={handleCardClick}
            />
        </Flex>
    )
}

export default MerkenConfigurator