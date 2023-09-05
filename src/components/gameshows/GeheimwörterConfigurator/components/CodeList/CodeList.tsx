import { Box, Container, Flex, TextInput } from '@mantine/core'
import React from 'react'
import type { ICodeListItemProps, ICodeListProps } from './codeList.types'

const CodeListItem: React.FC<ICodeListItemProps> = ({ item, editable = false }) => {

    return <Flex gap="xl" align="center" h="1.25rem">
        <Box w="2rem">
            {item.letter.toUpperCase()}
        </Box>
        -
        <span>
            {item.word}
        </span>
        {/* <TextInput variant='unstyled' sx={{
            borderBottom: "1px solid white"
        }} /> */}
    </Flex>
}

const CodeList: React.FC<ICodeListProps> = ({ codeList, editable = true }) => {
    const codeListElements = codeList.map(item => <CodeListItem key={item.letter} item={item} editable={editable} />)

    return (
        <Flex direction="column" mah="40rem" bg="brand" p="md" sx={theme => ({
            borderRadius: theme.radius.md,
            boxShadow: theme.shadows.xl
        })}>
            {codeListElements}
        </Flex>
    )
}

export default CodeList