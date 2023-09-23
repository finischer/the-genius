import { Container, Flex, Text, useMantineTheme } from '@mantine/core'
import type { TForm } from '../../set.types'
import SetForm from '../SetForm'
import type { ISetCardProps } from './setCard.types'
import ActionIcon from '~/components/shared/ActionIcon'
import { IconPlus } from '@tabler/icons-react'
import { generateRandomForm } from '~/components/gameshows/SetConfigurator/helpers'

const SetCard: React.FC<ISetCardProps> = ({ editable = false, card, setCards, index, isFlipped = false }) => {
    const theme = useMantineTheme()

    const formElements = card.forms.map(formItem => <SetForm onChange={onChangeForm} onRemove={removeFormFromCard} key={formItem.id} editable={editable} formItem={formItem} removeable={card.forms.length > 1} />)

    function onChangeForm(formId: string, newForm: TForm) {
        if (!setCards) return

        setCards(draft => {
            const cardIndex = draft.cards.findIndex(c => c.id === card.id)
            const formIndex = draft.cards[cardIndex]?.forms.findIndex(f => f.id === formId)

            if (cardIndex === undefined || formIndex === undefined) return

            let cardItem = draft.cards[cardIndex]

            if (cardItem === undefined) return

            cardItem.forms[formIndex] = newForm
        })
    }

    function addFormToCard() {
        if (!setCards) return

        const randomForm = generateRandomForm()

        setCards(draft => {
            const c = draft.cards.find(c => c.id === card.id)

            if (!c) return

            c.forms.push(randomForm)
        })

    }

    function removeFormFromCard(formId: string) {
        if (!setCards || formElements.length === 1) return

        setCards(draft => {
            const c = draft.cards.find(c => c.id === card.id)

            if (!c) return

            c.forms = c.forms.filter(f => f.id !== formId)
        })
    }

    const FrontContent = () => (
        <Text pos="absolute" weight="bold" size="2rem" color='dark'>{index + 1}</Text>
    )

    const BackContent = () => (
        <>
            <Container pos="absolute" top={10} left={10} p={0} >
                <Text color='dimmed' weight="bold" size="xl">{index + 1}</Text>
            </Container>
            {formElements}
            {editable && formElements.length < 3 &&
                <ActionIcon variant='default' ml="md" onClick={addFormToCard}>
                    <IconPlus />
                </ActionIcon>
            }
        </>
    )

    return (
        <Flex bg="#f7f1f1" p="md" justify="center" pos="relative" align="center" h="10rem" w="15rem" sx={{
            borderRadius: theme.radius.md
        }}>
            {!isFlipped ?
                <FrontContent />
                :
                <BackContent />
            }
        </Flex>
    )
}

export default SetCard