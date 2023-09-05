import { Button, Flex } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { useConfigurator } from '~/hooks/useConfigurator'
import CodeList from './components/CodeList/CodeList'
import type { TCodeList, TCodeListItem } from './components/CodeList/codeList.types';
import CreateQuestionContainer from './components/CreateQuestionContainer/CreateQuestionContainer';
import type { TGeheimwoerterQuestionItem } from '~/components/room/Game/games/Geheimwörter/geheimwörter.types';

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
                category: codeWord
            }

            codeList.push(codeListItem)
        }
    }

    return codeList
}

const GeheimwörterConfigurator = () => {
    const [geheimwoerter, setGeheimwoerter, { enableFurtherButton, disableFurtherButton }] = useConfigurator("geheimwoerter")
    const [codeListEditable, setCodeListEditable] = useState(false)

    useEffect(() => {
        // set default code list
        if (geheimwoerter.codeList.length === 0) {
            setGeheimwoerter(draft => {
                draft.geheimwoerter.codeList = generateCodeList(ALPHABET, DEFAULT_CODE_WORD_LIST)
            })
        }
    }, [])

    const addQuestion = (newQuestion: TGeheimwoerterQuestionItem) => {
        setGeheimwoerter(draft => {
            draft.geheimwoerter.questions.push(newQuestion)
        })
    }

    useEffect(() => {
        console.log("Questions: ", geheimwoerter.questions)
    }, [geheimwoerter.questions])

    return (
        <Flex gap="md">
            <Flex direction="column" gap="sm" w="100%">
                <CodeList codeList={geheimwoerter.codeList} setCodeList={setGeheimwoerter} editable={codeListEditable} />
                <Button onClick={() => setCodeListEditable(oldState => !oldState)}>{codeListEditable ? "Liste speichern" : "Liste bearbeiten"}</Button>
            </Flex>

            <CreateQuestionContainer onAddQuestion={addQuestion} codeList={geheimwoerter.codeList} />

            {/* <AllQuestionsList /> */}

        </Flex>
    )
}

export default GeheimwörterConfigurator