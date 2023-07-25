import { Box, Button, Flex, Group, Stepper, TextInput, Title } from '@mantine/core'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import GamesPicker from '~/components/GamesPicker/GamesPicker'
import { type ITransferListItem } from '~/components/GamesPicker/gamesPicker.types'
import { GAME_CONFIGURATORS } from '~/components/configurators/_game_configurator_map'
import PageLayout from '~/components/layout'
import { TGameNames } from '~/games/game.types'
import { ConfiguratorProvider } from '~/hooks/useConfigurator/useConfigurator'
import { TGameshowConfig } from '~/hooks/useConfigurator/useConfigurator.types'
import { api } from '~/utils/api'

const NUM_OF_DEFAULT_STEPS = 2

type TGameshowConfigKeys = Omit<TGameshowConfig, "games"> // config of gameshow that can be adjust by the user at details screen

const CreateGameshowPage = () => {
    const [activeStep, setActiveStep] = useState(0);
    const [gameshow, setGameshow] = useImmer<TGameshowConfig>({
        name: "",
        games: []
    })
    const [selectedGames, setSelectedGames] = useState<ITransferListItem[]>([])
    const { mutate: createGameshow } = api.gameshows.create.useMutation()

    const selectedGamesReduced: TGameNames[] = selectedGames.map(g => g.value as TGameNames);
    const numOfSteps = NUM_OF_DEFAULT_STEPS + selectedGames.length
    const isLastStep = activeStep === numOfSteps

    const nextStep = () => setActiveStep((current) => (current < numOfSteps ? current + 1 : current));
    const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));
    const saveGameshow = () => {
        console.log("Save gameshow: ", gameshow)
        createGameshow(gameshow)

    }


    const updateGameshowConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key: keyof TGameshowConfigKeys = e.target.id as keyof TGameshowConfigKeys;

        setGameshow(draft => {
            draft[key] = e.target.value
        })
    }

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
                            <Title order={2}>Details Spielshow</Title>
                            <Box mt="xl">
                                <TextInput
                                    label="Name der Spielshow"
                                    withAsterisk
                                    onChange={updateGameshowConfig}
                                    id='name'
                                    value={gameshow.name}
                                />
                            </Box>
                        </Stepper.Step>
                        <Stepper.Completed>
                            {/* TODO: Add summary component before gameshow will be saved */}
                        </Stepper.Completed>
                    </Stepper>

                    <Group position="center" mt="xl">
                        <Button variant="default" onClick={prevStep}>Zurück</Button>
                        <Button onClick={() => isLastStep ? saveGameshow() : nextStep()}>{isLastStep ? "Spielshow speichern" : "Weiter"}</Button>
                    </Group>
                </Flex>
            </ConfiguratorProvider>
        </PageLayout>
    )
}

export default CreateGameshowPage