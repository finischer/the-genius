import { createContext, useContext, useEffect, useState } from 'react'
import { DEFAULT_FLAGGEN_STATE } from '~/games/flaggen/config'
import { type TGameNames } from '~/games/game.types'
import { DEFAULT_MEMORY_STATE } from '~/games/memory/config'
import { DEFAULT_MERKEN_STATE } from '~/games/merken/config'
import { type IConfiguratorProvider, type TConfiguratorContext, type TGameSettingsMap } from './useConfigurator.types'
import { useImmer } from "use-immer";

export const GAME_STATE_MAP: TGameSettingsMap = {
    flaggen: DEFAULT_FLAGGEN_STATE,
    memory: DEFAULT_MEMORY_STATE,
    merken: DEFAULT_MERKEN_STATE
}

export type TSelectedGameSettingsArray = Array<TGameSettingsMap[TGameNames]>;

const ConfiguratorContext = createContext<TConfiguratorContext | undefined>(undefined)

const ConfiguratorProvider: React.FC<IConfiguratorProvider> = ({ gameshowConfig, updateGameshowConfig, enableFurtherButton, disableFurtherButton, selectedGames, children }) => {
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
