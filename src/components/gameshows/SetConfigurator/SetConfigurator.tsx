import { Button, Flex, SimpleGrid, Title } from '@mantine/core'
import { useState } from 'react'
import SetCard from '~/components/room/Game/games/Set/components/SetCard'
import List from '~/components/shared/List'
import { useConfigurator } from '~/hooks/useConfigurator'

const NUM_OF_CARDS = 9

const CreateSetContainer = () => {
    const cardElements = Array(NUM_OF_CARDS).fill(<SetCard />)

    return (
        <Flex direction="column" gap="lg" w="100%" justify="center" align="center" >
            <Title order={3}>Set erstellen</Title>

            <SimpleGrid cols={3} spacing="md" verticalSpacing="md">
                {cardElements}
            </SimpleGrid>

            <Button.Group>
                <Button variant='default'>Ausfüllen</Button>
                <Button>Hinzufügen</Button>
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