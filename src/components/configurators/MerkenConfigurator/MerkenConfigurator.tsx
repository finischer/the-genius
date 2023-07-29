import { Container, NumberInput } from '@mantine/core'
import { useConfigurator } from '~/hooks/useConfigurator'

const MAX_TIME_TO_THINK_SECONDS = 180 // 3 minutes

const MerkenConfigurator = () => {
    const [merken, setMerken] = useConfigurator("merken")


    const updateTimeToThink = (value: number | "") => {
        if (value === "") return

        setMerken(draft => {
            draft.merken.timerState.timeToThinkSeconds = value
        })
    }


    return (
        <Container>
            <NumberInput
                defaultValue={merken.timerState.timeToThinkSeconds}
                label="Nachdenkzeit"
                description="in Sekunden"
                min={1}
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