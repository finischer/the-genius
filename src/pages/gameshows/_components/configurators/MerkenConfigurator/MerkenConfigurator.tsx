import { Container, NumberInput } from '@mantine/core'
import { useEffect } from 'react'
import { useConfigurator } from '~/hooks/useConfigurator'

const MAX_TIME_TO_THINK_SECONDS = 180 // 3 minutes
const MIN_TIME_TO_THINK_SECONDS = 1

const MerkenConfigurator = () => {
    const [merken, setMerken, { enableFurtherButton, disableFurtherButton }] = useConfigurator("merken")


    const updateTimeToThink = (value: number | "") => {
        if (value === "") return

        setMerken(draft => {
            draft.merken.timerState.timeToThinkSeconds = value
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
        <Container>
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

            {/* <MerkenPlayground /> */}
        </Container>
    )
}

export default MerkenConfigurator