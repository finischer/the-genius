import FlaggenConfigurator from "./FlaggenConfigurator"

export enum Games {
    FLAGGEN = "flaggen"
}

export type TGameConfigurators = {
    [index in Games]: React.ReactNode
}

export const GAME_CONFIGURATORS: TGameConfigurators = {
    "flaggen": <FlaggenConfigurator />
}