import { Container, Flex, Text, useMantineTheme } from '@mantine/core'
import { IconPlus } from '@tabler/icons-react'
import { v4 as uuidv4 } from "uuid"
import ActionIcon from '~/components/shared/ActionIcon'
import type { TSetCard } from '../../set.types'
import SetForm from '../SetForm'
import type { ISetCardProps } from './setCard.types'

const SetCard: React.FC<ISetCardProps> = ({ editable = false, card, setCards, index, isFlipped = false }) => {
    const theme = useMantineTheme()

    // const formElements =  card.forms.map(formItem => <SetForm onChange={onChangeForm} onRemove={removeFormFromCard} key={formItem.id} editable={editable} formItem={formItem} removeable={card.forms.length > 1} />)
    const formElements = Array(card.amount).fill(null).map((_, idx) => <SetForm key={`${card.id}-${idx}`} onChange={onChangeCard} onRemove={removeFormFromCard} editable={editable} card={card} removeable={card.amount > 1} />)

    function onChangeCard(newCard: TSetCard) {
        if (!setCards) return

        setCards(draft => {
            const cardIndex = draft.cards.findIndex(c => c.id === card.id)
            draft.cards[cardIndex] = newCard
        })
    }

    function addFormToCard() {
        if (!setCards) return

        setCards(draft => {
            const c = draft.cards.find(c => c.id === card.id)
            if (!c) return
            c.amount++
        })

    }

    function removeFormFromCard(formId: string) {
        if (!setCards || formElements.length === 1) return

        setCards(draft => {
            const c = draft.cards.find(c => c.id === card.id)
            if (!c || c.amount === 0) return
            c.amount--
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