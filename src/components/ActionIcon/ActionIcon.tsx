import { ActionIcon as MantineActionIcon } from '@mantine/core'
import React from 'react'
import { type IActionIconProps } from './actionIcon.types'
import Tooltip from '../Tooltip/Tooltip'

const ActionIcon: React.FC<IActionIconProps> = ({ toolTip, children, onClick, disabled = false, ...props }) => {
    return (
        <Tooltip
            label={toolTip}
            disabled={!toolTip || disabled}
            openDelay={500}
        >
            <MantineActionIcon onClick={onClick} disabled={disabled} {...props}>
                {children}
            </MantineActionIcon>
        </Tooltip>
    )

}

export default ActionIcon