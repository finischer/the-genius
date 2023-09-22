import { Container, Flex, Text, useMantineTheme } from '@mantine/core'
import SetForm from '../SetForm'
import type { ISetCardProps } from './setCard.types'
import type { TForm } from '../../set.types'

const SetCard: React.FC<ISetCardProps> = ({ editable = false, card, setCards, index, isFlipped = false }) => {
    const theme = useMantineTheme()

    const formElements = card.forms.map(formItem => <SetForm onChange={onChangeForm} key={formItem.id} editable={editable} formItem={formItem} />)

    function onChangeForm(formId: string, newForm: TForm) {
        if (!setCards) return

        setCards(draft => {
            const cardIndex = draft.findIndex(c => c.id === card.id)
            const formIndex = draft[cardIndex]?.forms.findIndex(f => f.id === formId)

            if (cardIndex === undefined || formIndex === undefined) return

            let cardItem = draft[cardIndex]

            if (cardItem === undefined) return

            cardItem.forms[formIndex] = newForm
        })
    }

    return (
        <Flex bg="#f7f1f1" p="md" justify="center" pos="relative" align="center" h="10rem" w="15rem" sx={{
            borderRadius: theme.radius.md
        }}>
            {!isFlipped ? <Text pos="absolute" weight="bold" size="2rem" color='dark'>{index + 1}</Text> :
                <>
                    <Container pos="absolute" top={10} left={10} p={0} >
                        <Text color='dimmed' weight="bold" size="xl">{index + 1}</Text>
                    </Container>
                    {formElements}
                </>
            }
        </Flex>
    )
}

export default SetCard


// return (
//     <FlipCard
//         isFlipped
//         front={<Text color="dark">{index + 1}</Text>}
//         back={
//             <Flex bg="#f7f1f1" p="md" justify="center" pos="relative" align="center" h="10rem" w="15rem" sx={{
//                 borderRadius: theme.radius.md
//             }}>
//                 <Container pos="absolute" top={0} left={0} p={0} >
//                     <Text color='dimmed' weight="bold">{index + 1}</Text>
//                 </Container>
//                 {formElements}
//             </Flex>
//         }
//         frontStyle={{
//             ...defaultCardStyle
//         }}
//         backStyle={{
//             ...defaultCardStyle
//         }}
//     />
// )