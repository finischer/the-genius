import { Button, Flex, SimpleGrid, Title } from '@mantine/core'
import { useState } from 'react'
import { useImmer } from 'use-immer'
import { v4 as uuidv4 } from 'uuid'
import SetCard from '~/components/room/Game/games/Set/components/SetCard'
import type { TCardFormList, TForm, TSetCardColor, TSetCardFilling, TSetCardForm } from '~/components/room/Game/games/Set/set.types'
import List from '~/components/shared/List'
import { useConfigurator } from '~/hooks/useConfigurator'

const NUM_OF_CARDS = 12

function generateRandomForm(): TForm {
    const forms: TSetCardForm[] = ["rectangle", "oval", "diamond"];
    const colors: TSetCardColor[] = ["red", "green", "blue"];
    const fillings: TSetCardFilling[] = ["filled", "none", "dashed"];

    const randomFormIndex = Math.floor(Math.random() * forms.length);
    const randomColorIndex = Math.floor(Math.random() * colors.length);
    const randomFillingIndex = Math.floor(Math.random() * fillings.length);

    const randomTForm: TForm = {
        id: uuidv4(),
        form: forms[randomFormIndex] ?? "diamond",
        color: colors[randomColorIndex] ?? "blue",
        fill: fillings[randomFillingIndex] ?? "filled",
    };

    return randomTForm;
}

function generateRandomFormList(): TCardFormList {
    const randomTFormList: TForm[] = [];

    // Erzeuge maximal 3 zufällige TForm-Objekte
    for (let i = 0; i < Math.min(3, 27); i++) { // 3 * 3 * 3 = 27 mögliche Kombinationen
        const randomTForm = generateRandomForm();
        randomTFormList.push(randomTForm);
    }


    return {
        id: uuidv4(),
        forms: randomTFormList
    };
}


const DEFAULT_SET_FORMS = Array(NUM_OF_CARDS).fill(null).map(_ => generateRandomFormList())

const CreateSetContainer = () => {
    const [cards, setCards] = useImmer<TCardFormList[]>(DEFAULT_SET_FORMS)

    const cardElements = cards.map((item, index) => <SetCard key={index} editable card={item} setCards={setCards} />)


    return (
        <Flex direction="column" gap="lg" w="100%" justify="center" align="center" >
            <Title order={3}>Set erstellen</Title>

            <SimpleGrid cols={3} spacing="md" verticalSpacing="md">
                {cardElements}
            </SimpleGrid>

            <Button.Group>
                <Button variant='default'>Ausfüllen</Button>
                <Button>Set Hinzufügen</Button>
            </Button.Group>
        </Flex>
    )

}

const SetList = () => {
    const [test_data, setTestData] = useState([
        {
            id: 1,
            name: "Set 1"
        },
        {
            id: 2,
            name: "Set 2"
        },
        {
            id: 3,
            name: "Set 3"
        }
    ])

    return (
        <Flex direction="column" gap="lg" w="50%">
            <Title order={3}>Alle Sets</Title>
            <List data={test_data} renderValueByKey="name" setData={setTestData} editable />
        </Flex>
    )
}


const SetConfigurator = () => {
    const [set, setSet, { enableFurtherButton, disableFurtherButton }] = useConfigurator("set")

    return (
        <Flex>
            <CreateSetContainer />
            <SetList />
        </Flex>
    )
}

export default SetConfigurator