import { ActionIcon as MantineActionIcon, Tooltip, useMantineTheme } from '@mantine/core'
import React from 'react'
import { colors } from '~/styles/constants'
import { type IActionIconProps } from './actionIcon.types'

const ActionIcon: React.FC<IActionIconProps> = ({ toolTip, children, onClick, ...props }) => {
    const theme = useMantineTheme()

    return (
        <Tooltip
            disabled={!toolTip}
            label={toolTip}
            withArrow
            bg={theme.colors.dark[8]}
            color={colors.lightText}
        >
            <MantineActionIcon onClick={onClick} {...props}>
                {children}
            </MantineActionIcon>
        </Tooltip>
    )

}

export default ActionIcon