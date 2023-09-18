import { SET_COLORS_MAP } from "../config"
import type { TSetCard } from "../set.types"
import { DEFAULT_SET_FORM_STYLE } from "./SetForm"

const Diamond = ({ color, fill }: { color: TSetCard["color"], fill: TSetCard["filling"] }) => {
    const svgColor = SET_COLORS_MAP[color]
    const isFilled = fill === "filled"
    const svgStroke = fill === 'dashed' ? svgColor : undefined
    const svgFill = isFilled ? svgColor : undefined

    return (
        <svg
            style={DEFAULT_SET_FORM_STYLE}
            width="17.154579mm"
            height="28.494047mm"
            viewBox="0 0 17.154579 28.494047"
            version="1.1"
            id="svg5"
            stroke={svgStroke}
            fill={svgFill}
            fillOpacity={isFilled ? 1 : 0}
        >
            <g id="layer1" transform="translate(-120.80177,-138.00568)">
                <g
                    transform="matrix(0.26458333,0,0,0.26458333,-62.17927,64.543334)"
                    id="g845"
                >
                    <path d="m 694.5,331.5 29.5,-49 29.5,49 -29.5,49 z" id="path829" stroke={svgColor} strokeWidth="0.5rem" />
                    <path d="M 714.5,298.5 H 732" id="path831" />
                    <path d="m 708.5,309.5 h 30.25" id="path833" />
                    <path d="M 702.5,319.5 H 746" id="path835" />
                    <path d="m 694.5,331.5 h 58.435" id="path837" />
                    <path d="M 702.5,342.5 H 746" id="path839" />
                    <path d="m 706.5,353.5 h 32.253" id="path841" />
                    <path d="m 713.5,364.5 h 21.253" id="path843" />
                </g>
            </g>
        </svg>
    )
}

export default Diamond