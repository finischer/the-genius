import React from 'react'
import { ActionIcon as MantineActionIcon, Tooltip, useMantineTheme } from '@mantine/core'
import { IActionIconProps } from './actionIcon.types'

const ActionIcon: React.FC<IActionIconProps> = ({ toolTip, children, ...props }) => {
    const theme = useMantineTheme()

    return (
        <Tooltip
            disabled={!toolTip}
            label={toolTip}
            withArrow
            bg={theme.colors.dark[8]}
            color='white'
        >
            <MantineActionIcon {...props}>
                {children}
            </MantineActionIcon>
        </Tooltip>
    )

}

export default ActionIcon