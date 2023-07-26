import { Box, Button, Flex, Group, StepProps, Stepper, TextInput, Title } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useImmer } from 'use-immer'
import GamesPicker from '~/components/GamesPicker/GamesPicker'
import { type ITransferListItem } from '~/components/GamesPicker/gamesPicker.types'
import Loader from '~/components/Loader/Loader'
import { GAME_CONFIGURATORS } from '~/components/configurators/_game_configurator_map'
import PageLayout from '~/components/layout'
import { TGameNames } from '~/games/game.types'
import { ConfiguratorProvider } from '~/hooks/useConfigurator/useConfigurator'
import { TGameshowConfig } from '~/hooks/useConfigurator/useConfigurator.types'
import useNotification from '~/hooks/useNotification'
import { api } from '~/utils/api'

const NUM_OF_DEFAULT_STEPS = 2

type TGameshowConfigKeys = Omit<TGameshowConfig, "games"> // config of gameshow that can be adjust by the user at details screen

const DEFAULT_GAMESHOW_CONFIG = {
    name: "",
    games: []
}

const CreateGameshowPage = () => {
    const { showErrorNotification } = useNotification()
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(0);
    const [cachedGameshow, setCashedGameshow] = useLocalStorage<TGameshowConfig>({ key: 'cachedGameshow', defaultValue: DEFAULT_GAMESHOW_CONFIG });
    const [gameshow, setGameshow] = useImmer<TGameshowConfig>(cachedGameshow)

    const [selectedGames, setSelectedGames] = useState<ITransferListItem[]>([])
    const { mutateAsync: createGameshow, isLoading, isSuccess } = api.gameshows.create.useMutation({
        onError: (e) => {
            const errorMessage = e.data?.zodError?.fieldErrors;
            const errorMessagesArray = errorMessage ? Object.values(errorMessage) : []

            if (errorMessagesArray.length > 0) {
                errorMessagesArray.forEach(messages => {
                    if (messages && messages[0]) {
                        showErrorNotification({
                            title: "Ein Fehler ist aufgetreten",
                            message: messages[0]
                        })
                    }
                })
            }
            else {
                showErrorNotification({
                    title: "Ein Fehler ist aufgetreten",
                    message: e.message ?? "Probiere es später nochmal"
                })
            }
        }
    })

    const selectedGamesReduced: TGameNames[] = selectedGames.map(g => g.value as TGameNames);
    const numOfSteps = NUM_OF_DEFAULT_STEPS + selectedGames.length
    const isLastStep = activeStep === numOfSteps
    const allowSelectStepProps: StepProps = { allowStepClick: !isLoading, allowStepSelect: !isLoading }

    const nextStep = () => setActiveStep((current) => (current < numOfSteps ? current + 1 : current));
    const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));
    const saveGameshow = async () => {
        try {
            await createGameshow(gameshow)
            // navigate back to gameshows
            router.push("/gameshows")
        } catch (err) { }
    }


    const updateGameshowConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
        const key: keyof TGameshowConfigKeys = e.target.id as keyof TGameshowConfigKeys;

        setGameshow(draft => {
            draft[key] = e.target.value
        })
    }


    useEffect(() => {
        setCashedGameshow(gameshow) // save to localStorage
    }, [gameshow])

    return (
        <PageLayout showLoader={isSuccess} loadingMessage='Spielshows werden geladen ...'>
            <ConfiguratorProvider updateGameshowConfig={setGameshow} gameshowConfig={gameshow} selectedGames={selectedGamesReduced}>
                <Flex gap="xl" direction="column">
                    <Title>Erstelle deine Spielshow</Title>
                    <Stepper active={activeStep} onStepClick={setActiveStep} breakpoint="sm" size='sm' allowNextStepsSelect={false}>
                        <Stepper.Step label="Spiele" description="Wähle deine Spiele aus" {...allowSelectStepProps}>
                            <GamesPicker setSelectedGames={setSelectedGames} />
                        </Stepper.Step>
                        {selectedGames.map(g => (
                            <Stepper.Step key={g.value} label={g.label} {...allowSelectStepProps}>
                                <Title order={2}>Einstellungen - {g.label} {/* TODO: add "show rules" button */} </Title>
                                <Box mt="xl">
                                    {GAME_CONFIGURATORS[g.value as TGameNames]}
                                </Box>
                            </Stepper.Step>
                        ))}
                        <Stepper.Step label="Details Spielshow" description="" {...allowSelectStepProps}>
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
                        {isLoading ?
                            <Loader message='Spielshow wird erstellt ...' />
                            :
                            <>
                                <Button variant="default" onClick={() => !isLoading && prevStep()}>Zurück</Button>
                                <Button onClick={() => isLastStep && !isLoading ? saveGameshow() : nextStep()} loading={isLoading} >{isLastStep ? "Spielshow speichern" : "Weiter"}</Button>
                            </>
                        }
                    </Group>
                </Flex>
            </ConfiguratorProvider>
        </PageLayout>
    )
}

export default CreateGameshowPage