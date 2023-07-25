import { Box, Button, Flex, Group, Stepper, Title } from '@mantine/core'
import { IconQuestionMark, IconZoomQuestion } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import GamesPicker from '~/components/GamesPicker/GamesPicker'
import { type ITransferListItem } from '~/components/GamesPicker/gamesPicker.types'
import { GAME_CONFIGURATORS } from '~/components/configurators/_game_configurator_map'
import PageLayout from '~/components/layout'
import { TGameNames } from '~/games/game.types'
import { ConfiguratorProvider } from '~/hooks/useConfigurator/useConfigurator'
import { TGameshowConfig } from '~/hooks/useConfigurator/useConfigurator.types'

const NUM_OF_DEFAULT_STEPS = 2

const CreateGameshowPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [gameshow, setGameshow] = useState<TGameshowConfig>({
        name: "",
        games: []
    })
    const [selectedGames, setSelectedGames] = useState<ITransferListItem[]>([])

    const selectedGamesReduced: TGameNames[] = selectedGames.map(g => g.value as TGameNames);
    const numOfSteps = NUM_OF_DEFAULT_STEPS + selectedGames.length


    useEffect(() => {
        console.log("Gameshow: ", gameshow)
    }, [gameshow])

    const nextStep = () => setActiveStep((current) => (current < numOfSteps ? current + 1 : current));
    const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

    return (
        <PageLayout>
            <ConfiguratorProvider updateGameshowConfig={setGameshow} gameshowConfig={gameshow} selectedGames={selectedGamesReduced}>
                <Flex gap="xl" direction="column">

                    <Title>Erstelle deine Spielshow</Title>
                    <Stepper active={activeStep} onStepClick={setActiveStep} breakpoint="sm" size='sm' allowNextStepsSelect={false}>
                        <Stepper.Step label="Spiele" description="Wähle deine Spiele aus" >
                            <GamesPicker setSelectedGames={setSelectedGames} />
                        </Stepper.Step>
                        {selectedGames.map(g => (
                            <Stepper.Step key={g.value} label={g.label}>
                                <Title order={2}>Einstellungen - {g.label} {/* TODO: add "show rules" button */} </Title>
                                <Box mt="xl">
                                    {GAME_CONFIGURATORS[g.value as TGameNames]}
                                </Box>
                            </Stepper.Step>
                        ))}
                        <Stepper.Step label="Details Spielshow" description="">
                            Step 3 content: Get full access
                        </Stepper.Step>
                        <Stepper.Completed>
                            Completed, click back button to get to previous step
                        </Stepper.Completed>
                    </Stepper>

                    <Group position="center" mt="xl">
                        <Button variant="default" onClick={prevStep}>Zurück</Button>
                        <Button onClick={nextStep}>Weiter</Button>
                    </Group>
                </Flex>
            </ConfiguratorProvider>
        </PageLayout>
    )
}

export default CreateGameshowPage