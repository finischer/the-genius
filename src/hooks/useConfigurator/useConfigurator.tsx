import { useState } from 'react'
import { DEFAULT_FLAGGEN_STATE } from '~/games/flaggen/config'
import { type TGameSettings, type TGameSettingsMap } from './useConfigurator.types'
import { DEFAULT_MEMORY_STATE } from '~/games/memory/config'
import { type TGameNames } from '~/games/game.types'
import { DEFAULT_MERKEN_STATE } from '~/games/merken/config'

const GAME_STATE_MAP: TGameSettingsMap = {
    flaggen: DEFAULT_FLAGGEN_STATE,
    memory: DEFAULT_MEMORY_STATE,
    merken: DEFAULT_MERKEN_STATE
}

function useConfigurator<T extends TGameNames>(game: T) {
    const [settings, setSettings] = useState<TGameSettings<T>>({
        state: GAME_STATE_MAP[game]
    })

    return [settings, setSettings] as const
}

export default useConfigurator