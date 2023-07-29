import React from 'react'
import { type ITooltipProps } from './tooltip.types'
import { Tooltip as MantineTooltip, useMantineTheme } from '@mantine/core'
import { colors } from '~/styles/constants'


const Tooltip: React.FC<ITooltipProps> = ({ children, ...props }) => {
    const theme = useMantineTheme()

    return (
        <MantineTooltip
            withArrow
            bg={theme.colors.dark[8]}
            color={colors.lightText}
            {...props}
        >
            {children}
        </MantineTooltip>
    )
}

export default Tooltip