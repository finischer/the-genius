import { ActionIcon as MantineActionIcon } from '@mantine/core'
import React from 'react'
import { type IActionIconProps } from './actionIcon.types'
import Tooltip from '../Tooltip/Tooltip'

const ActionIcon: React.FC<IActionIconProps> = ({ toolTip, children, onClick, ...props }) => {
    return (
        <Tooltip
            label={toolTip}
            disabled={!toolTip}
        >
            <MantineActionIcon onClick={onClick} {...props}>
                {children}
            </MantineActionIcon>
        </Tooltip>
    )

}

export default ActionIcon