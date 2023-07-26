import React from 'react'
import { IContainerBoxProps } from './containerBox.types'
import { Box } from '@mantine/core'
import { sizes } from '~/styles/constants'

const ContainerBox: React.FC<IContainerBoxProps> = ({
    children,
    contentCentered = false,
    withShadow = false,
    ...props
}) => {
    return (
        <Box
            {...props}
            sx={(theme) => ({
                display: "flex",
                justifyContent: contentCentered ? "center" : "flex-start",
                alignItems: contentCentered ? "center" : "flex-start",
                borderRadius: sizes.borderRadius,
                boxShadow: withShadow ? theme.shadows.xl : "none"
            })}
        >
            {children}
        </Box>
    )
}

export default ContainerBox