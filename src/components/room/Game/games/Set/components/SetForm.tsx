import type { CSSProperties } from "react"
import type { TSetCard } from "../set.types"
import Oval from "./Oval"
import Rectangle from "./Rectangle"
import Diamond from "./Diamond"

export const DEFAULT_SET_FORM_STYLE: CSSProperties = {
    margin: "0 0.5rem",
    position: "relative",
    overflow: "hidden",
    alignSelf: "center",
    strokeWidth: "0.25rem",
    width: "2.6rem"
}

const SetForm = ({ form, color, fill }: { form: TSetCard["form"], color: TSetCard["color"], fill: TSetCard["filling"] }) => {
    const FORM_MAP: { [key in typeof form]: JSX.Element } = {
        diamond: <Diamond color={color} fill={fill} />,
        rectangle: <Rectangle color={color} fill={fill} />,
        oval: <Oval color={color} fill={fill} />
    }

    return FORM_MAP[form]
}

export default SetForm