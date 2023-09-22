import { SET_COLORS_MAP } from "../config"
import type { TForm, TSetCard } from "../set.types"
import { DEFAULT_SET_FORM_STYLE } from "./SetForm"

const Rectangle = ({ color, fill }: { color: TForm["color"], fill: TForm["fill"] }) => {
    const svgColor = SET_COLORS_MAP[color]
    const isFilled = fill === "filled"
    const svgStroke = fill === 'dashed' ? svgColor : undefined
    const svgFill = isFilled ? svgColor : undefined

    return (
        <svg
            viewBox="0 0 16.668749 27.252083"
            version="1.1"
            id="svg5"
            stroke={svgStroke}
            fill={svgFill}
            style={DEFAULT_SET_FORM_STYLE}
        >
            <g id="layer1" transform="translate(-81.373204,-89.662767)">
                <g
                    transform="matrix(0.26458333,0,0,0.26458333,-101.71846,46.535684)"
                    id="g1025"
                >
                    <rect x="694.5" y="165.5" width="58" height="98" id="rect1009" fill={isFilled ? svgColor : undefined} fillOpacity={isFilled ? 1 : 0} stroke={svgColor} strokeWidth="0.75rem" />
                    <path d="m 696.5,238.5 h 55.842" id="path1011" />
                    <path d="M 696.95124,214.47889 753.342,214.5" id="path1013" />
                    <path d="m 696.5,251.5 h 55.842" id="path1015" />
                    <path d="m 696.5,226.5 h 55.842" id="path1017" />
                    <path d="M 696.99345,201.5 H 753.342" id="path1019" />
                    <path d="m 696.5,189.5 h 55.842" id="path1021" />
                    <path d="m 696.5,177.5 h 55.842" id="path1023" />
                </g>
            </g>
        </svg>
    )
}

export default Rectangle