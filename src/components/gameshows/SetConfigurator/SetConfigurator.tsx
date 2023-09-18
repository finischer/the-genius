import { Flex, SimpleGrid, Title } from '@mantine/core'
import SetCard from '~/components/room/Game/games/Set/components/SetCard'
import { useConfigurator } from '~/hooks/useConfigurator'



const CreateSetContainer = () => {
    return (
        <Flex direction="column" gap="lg">
            <Title order={3} >Antwort erstellen</Title>

            <SimpleGrid cols={3} spacing="md" verticalSpacing="md">
                <SetCard />
                <SetCard />
                <SetCard />
                <SetCard />
                <SetCard />
                <SetCard />
                <SetCard />
                <SetCard />
                <SetCard />
            </SimpleGrid>

        </Flex>

    )

}


const SetConfigurator = () => {
    const [set, setSet, { enableFurtherButton, disableFurtherButton }] = useConfigurator("set")

    return (
        <Flex>
            <CreateSetContainer />
            {/* <SetList /> */}
        </Flex>
    )
}

export default SetConfigurator