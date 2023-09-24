import { createContext, useContext, useEffect } from 'react'
import { useImmer } from "use-immer"
import { type IConfiguratorProvider, type TConfiguratorContext, type TGameSettingsMap } from './useConfigurator.types'
import { DEFAULT_FLAGGEN_STATE } from '~/components/room/Game/games/Flaggen/config';
import { DEFAULT_MEMORY_STATE } from '~/components/room/Game/games/Memory/config';
import { DEFAULT_MERKEN_STATE } from '~/components/room/Game/games/Merken/config';
import type { TGame, TGameNames } from '~/components/room/Game/games/game.types';
import { DEFAULT_GEHEIMWOERTER_STATE } from '~/components/room/Game/games/Geheimwörter/config';
import { DEFAULT_SET_STATE } from '~/components/room/Game/games/Set/config';

export const GAME_STATE_MAP: TGameSettingsMap = {
    flaggen: DEFAULT_FLAGGEN_STATE,
    memory: DEFAULT_MEMORY_STATE,
    merken: DEFAULT_MERKEN_STATE,
    geheimwoerter: DEFAULT_GEHEIMWOERTER_STATE,
    set: DEFAULT_SET_STATE
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

