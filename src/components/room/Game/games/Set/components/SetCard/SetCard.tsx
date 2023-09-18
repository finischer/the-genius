import { Flex, useMantineTheme } from '@mantine/core'
import SetForm from '../SetForm'

const SetCard = () => {
    const theme = useMantineTheme()

    return (
        <Flex bg="#f7f1f1" p="md" justify="center" align="center" h="10rem" w="15rem" sx={{
            borderRadius: theme.radius.md
        }}>
            <SetForm form='diamond' color='green' fill='none' />
            <SetForm form='diamond' color='blue' fill='dashed' />
            <SetForm form='oval' color='red' fill='filled' />
        </Flex>
    )
}

export default SetCard