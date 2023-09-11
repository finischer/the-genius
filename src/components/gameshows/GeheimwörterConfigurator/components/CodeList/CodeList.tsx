import { Box, Button, Flex, TextInput, Title, useMantineTheme } from '@mantine/core'
import React from 'react'
import type { ICodeListItemProps, ICodeListProps } from './codeList.types'
import { capitalize } from '~/utils/strings'

const CodeListItem: React.FC<ICodeListItemProps> = ({ item, editable = false, onWordChange = () => null }) => {

    const handleWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let newWord = e.target.value
        const startsWithLetter = newWord.toLowerCase().startsWith(item.letter.toLowerCase())

        if (newWord.length === 0) {
            newWord = item.letter.toUpperCase()
        } else if (newWord.length > 0 && !startsWithLetter) {
            newWord = item.letter.toUpperCase() + newWord.slice(1)
        }

        onWordChange(item.letter, capitalize(newWord))
    }

    const wordElement = editable ?
        <TextInput
            variant='unstyled'
            sx={{
                borderBottom: "1px solid white"
            }}
            value={item.category}
            onChange={handleWordChange}
        /> : <span>{item.category}</span>


    return <Flex gap="xl" align="center" >
        <Box w="2rem">
            {item.letter.toUpperCase()}
        </Box>
        -
        {wordElement}
    </Flex>
}

const CodeList: React.FC<ICodeListProps> = ({ codeList, setCodeList, editable = false }) => {
    const theme = useMantineTheme()

    const codeListElements = codeList.map(item => <CodeListItem key={item.letter} item={item} editable={editable} onWordChange={onWordChange} />)

    function onWordChange(letter: string, newWord: string) {
        if (setCodeList) {
            setCodeList(draft => {
                let indexItem = draft.geheimwoerter.codeList.findIndex(item => item.letter.toLowerCase() === letter)

                draft.geheimwoerter.codeList[indexItem] = {
                    letter,
                    category: newWord || letter.toUpperCase()
                }
            })
        }
    }

    return (
        <Flex direction="column" gap="lg" w="100%">
            <Title order={3} >Codeliste</Title>
            <Flex direction="column" bg={theme.primaryColor} p="md" sx={theme => ({
                borderRadius: theme.radius.md,
                boxShadow: theme.shadows.xl
            })}>

                {codeListElements}
            </Flex>
        </Flex>
    )
}

export default CodeList