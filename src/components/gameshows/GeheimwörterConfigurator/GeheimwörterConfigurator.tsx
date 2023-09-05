import { Flex } from '@mantine/core'
import React, { useEffect } from 'react'
import { useConfigurator } from '~/hooks/useConfigurator'
import CodeList from './components/CodeList/CodeList'
import type { TCodeList, TCodeListItem } from './components/CodeList/codeList.types';

const ALPHABET = [...'abcdefghijklmnoprstuvwxyz'];
const DEFAULT_CODE_WORD_LIST = [
    "Autoteil",
    "Beruf",
    "Computerspiel",
    "Dateiendung",
    "Ereignis",
    "Farbe",
    "Gemälde",
    "Haustier",
    "Instrument",
    "Jahreszeit",
    "Künstler",
    "Lied",
    "Milchprodukt",
    "Naturphänomen",
    "Obst",
    "Politiker",
    "Roman",
    "Stadt",
    "Transportmittel",
    "Unternehmen",
    "Verein",
    "Werkzeug",
    "Zahl",
]

const generateCodeList = (alphabetList: string[], codeWords: string[]) => {
    let codeList: TCodeList = []

    for (const letter of alphabetList) {
        const codeWord = codeWords.find(word => word[0]?.toUpperCase() === letter.toUpperCase())
        if (codeWord) {
            let codeListItem: TCodeListItem = {
                letter,
                word: codeWord
            }

            codeList.push(codeListItem)
        }
    }

    return codeList
}

const GeheimwörterConfigurator = () => {
    const [geheimwoerter, setGeheimwoerter, { enableFurtherButton, disableFurtherButton }] = useConfigurator("geheimwoerter")

    useEffect(() => {
        // set default code list
        setGeheimwoerter(draft => {
            draft.geheimwoerter.codeList = generateCodeList(ALPHABET, DEFAULT_CODE_WORD_LIST)
        })


    }, [])

    return (
        <Flex gap="md">
            <CodeList codeList={geheimwoerter.codeList} />

            {/* <CreateQuestionContainer/> */}

            {/* <AllQuestionsList /> */}
        </Flex>
    )
}

export default GeheimwörterConfigurator