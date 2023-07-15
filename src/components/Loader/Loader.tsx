import { Flex, Text, Loader as MantineLoader } from '@mantine/core'
import React from 'react'
import { type ILoaderProps } from './loader.types'

const Loader: React.FC<ILoaderProps> = ({ message = undefined }) => {
    return (
        <Flex justify="center" align="center" h="100%">
            <Flex direction="column" gap="sm" align="center">
                <MantineLoader />
                {message &&
                    <Text>{message}</Text>
                }
            </Flex>
        </Flex>
    )
}

export default Loader