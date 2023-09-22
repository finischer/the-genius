import { SET_COLORS_MAP } from "../config"
import type { TForm, TSetCard } from "../set.types"
import { DEFAULT_SET_FORM_STYLE } from "./SetForm"

const Oval = ({ color, fill }: { color: TForm["color"], fill: TForm["fill"] }) => {
    const svgColor = SET_COLORS_MAP[color]
    const isFilled = fill === "filled"
    const svgStroke = fill === 'dashed' ? svgColor : undefined
    const svgFill = isFilled ? svgColor : undefined

    return (
        <svg
            style={{ ...DEFAULT_SET_FORM_STYLE, transform: "scale(1.25)" }}
            viewBox="0 0 19.758329 32.252079"
            version="1.1"
            id="svg5"
            stroke={svgStroke}
            fill={svgFill}
            fillOpacity={isFilled ? 1 : 0}
        >
            <g id="layer1" transform="translate(106.77267,-26.045438)">
                <g
                    transform="matrix(-0.26458333,0,0,0.26458333,95.36592,-82.189548)"
                    id="g972"
                >
                    <path
                        d="m 702.5,467.5 c 0,-27.062 10.521,-49 23.5,-49 12.979,0 23.5,21.938 23.5,49 0,27.062 -10.521,49 -23.5,49 -12.979,0 -23.5,-21.938 -23.5,-49 z"
                        id="path956"
                        stroke={svgColor}
                        strokeWidth="0.5rem"
                    />
                    <path d="m 708.5,432.5 h 33.261" id="path958" />
                    <path d="m 706.5,444.5 h 39.388" id="path960" />
                    <path d="m 704.5,455.5 h 44.815" id="path962" />
                    <path d="m 702.5,467.5 h 47.038" id="path964" />
                    <path d="m 704.5,479.5 h 44.815" id="path966" />
                    <path d="m 706.5,491.5 h 39.388" id="path968" />
                    <path d="m 708.5,502.5 h 33.261" id="path970" />
                </g>
            </g>
        </svg>
    )
}

export default Oval