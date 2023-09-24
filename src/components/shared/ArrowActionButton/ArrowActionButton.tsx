import { useMantineTheme } from '@mantine/core'
import { IconArrowDown, IconArrowLeft, IconArrowRight, IconArrowUp, type TablerIconsProps } from '@tabler/icons-react'
import React from 'react'
import ActionIcon from '../ActionIcon'
import type { IArrowActionButtonProps, TArrowDirection } from './arrowActionButton.types'

const arrowIconMap: Record<TArrowDirection, (props: TablerIconsProps) => JSX.Element> = {
    up: IconArrowUp,
    right: IconArrowRight,
    down: IconArrowDown,
    left: IconArrowLeft

}

const ArrowActionButton: React.FC<IArrowActionButtonProps> = ({ arrowDirection, onClick, tooltip = "", disabled = false }) => {
    const theme = useMantineTheme()

    const Icon = arrowIconMap[arrowDirection]

    return (
        <ActionIcon
            onClick={onClick}
            color={theme.primaryColor}
            variant='filled'
            toolTip={tooltip}
            disabled={disabled}
        >
            <Icon />
        </ActionIcon>
    )
}

export default ArrowActionButton