import { type TGameNames } from "~/pages/room/_components/Game/games/game.types";
import FlaggenConfigurator from "./FlaggenConfigurator"
import MemoryConfigurator from "./MemoryConfigurator/MemoryConfigurator"
import MerkenConfigurator from "./MerkenConfigurator/MerkenConfigurator"


export type TGameConfigurators = {
    [index in TGameNames]: React.ReactNode
}

export const GAME_CONFIGURATORS: TGameConfigurators = {
    "flaggen": <FlaggenConfigurator />,
    "memory": <MemoryConfigurator />,
    "merken": <MerkenConfigurator />
}