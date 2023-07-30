import React from 'react'
import { Tooltip as MantineTooltip, type TooltipProps, useMantineTheme } from '@mantine/core'
import { colors } from '~/styles/constants'


const Tooltip: React.FC<TooltipProps> = ({ children, ...props }) => {
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