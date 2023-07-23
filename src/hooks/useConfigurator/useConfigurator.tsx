import { createContext, useContext, useState } from 'react'
import { DEFAULT_FLAGGEN_STATE } from '~/games/flaggen/config'
import { type TGameNames } from '~/games/game.types'
import { DEFAULT_MEMORY_STATE } from '~/games/memory/config'
import { DEFAULT_MERKEN_STATE } from '~/games/merken/config'
import { IConfiguratorProvider, TConfiguratorContext, type TGameSettingsMap } from './useConfigurator.types'

const GAME_STATE_MAP: TGameSettingsMap = {
    flaggen: DEFAULT_FLAGGEN_STATE,
    memory: DEFAULT_MEMORY_STATE,
    merken: DEFAULT_MERKEN_STATE
}

const ConfiguratorContext = createContext<TConfiguratorContext | undefined>(undefined)

const ConfiguratorProvider: React.FC<IConfiguratorProvider> = ({ children }) => {
    const [settings, setSettings] = useState(GAME_STATE_MAP)

    return <ConfiguratorContext.Provider value={[settings, setSettings]}>
        {children}
    </ConfiguratorContext.Provider>

}

function useConfigurator<T extends TGameNames>(game: T) {
    const context = useContext(ConfiguratorContext)

    if (context === undefined) {
        throw Error("useConfigurator must be used within ConfiguratorProvider")
    }

    const [settings, setSettings] = context

    return [settings[game], setSettings] as const
}

export { ConfiguratorProvider, useConfigurator }
