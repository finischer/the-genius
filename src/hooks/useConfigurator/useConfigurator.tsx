import { createContext, useContext, useEffect } from 'react'
import { useImmer } from "use-immer"
import { DEFAULT_FLAGGEN_STATE } from '~/pages/room/_components/Game/games/Flaggen/config'
import { DEFAULT_MEMORY_STATE } from '~/pages/room/_components/Game/games/Memory/config'
import { DEFAULT_MERKEN_STATE } from '~/pages/room/_components/Game/games/Merken/config'
import { type TGame, type TGameNames } from '~/pages/room/_components/Game/games/game.types'
import { type IConfiguratorProvider, type TConfiguratorContext, type TGameSettingsMap } from './useConfigurator.types'

export const GAME_STATE_MAP: TGameSettingsMap = {
    flaggen: DEFAULT_FLAGGEN_STATE,
    memory: DEFAULT_MEMORY_STATE,
    merken: DEFAULT_MERKEN_STATE
}

export type TSelectedGameSettingsArray = TGame[];

const ConfiguratorContext = createContext<TConfiguratorContext | undefined>(undefined)

const ConfiguratorProvider: React.FC<IConfiguratorProvider> = ({ updateGameshowConfig, enableFurtherButton, disableFurtherButton, selectedGames, children }) => {
    const [settings, setSettings] = useImmer<TGameSettingsMap>(GAME_STATE_MAP)

    useEffect(() => {
        const newGameSettings: TSelectedGameSettingsArray = []

        selectedGames.forEach(gameName => {
            newGameSettings.push(settings[gameName])
        })

        updateGameshowConfig(draft => {
            draft.games = newGameSettings
        })

    }, [settings, selectedGames.length])


    return <ConfiguratorContext.Provider value={[settings, setSettings, { enableFurtherButton, disableFurtherButton }]}>
        {children}
    </ConfiguratorContext.Provider>

}

function useConfigurator<T extends TGameNames>(game: T) {
    const context = useContext(ConfiguratorContext)

    if (context === undefined) {
        throw Error("useConfigurator must be used within ConfiguratorProvider")
    }

    const [settings, setSettings, handleFurtherButton] = context

    return [settings[game], setSettings, handleFurtherButton] as const
}

export { ConfiguratorProvider, useConfigurator }

