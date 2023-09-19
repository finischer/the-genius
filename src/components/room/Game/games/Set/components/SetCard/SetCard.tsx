import { Flex, useMantineTheme } from '@mantine/core'
import SetForm from '../SetForm'
import type { ISetCardProps } from './setCard.types'
import type { TForm } from '../../set.types'

const SetCard: React.FC<ISetCardProps> = ({ editable = false, card, setCards }) => {
    const theme = useMantineTheme()

    const formElements = card.forms.map(formItem => <SetForm key={formItem.id} editable={editable} formItem={formItem} />)

    const onChangeForm = (formId: string, newForm: TForm) => {
        if (!setCards) return

        setCards(draft => {
            const cardIndex = draft.findIndex(c => c.id === card.id)
            const formIndex = draft[cardIndex]?.forms.findIndex(f => f.id === formId)

            console.log("Card: ", draft[cardIndex])

        })
    }

    return (
        <Flex bg="#f7f1f1" p="md" justify="center" align="center" h="10rem" w="15rem" sx={{
            borderRadius: theme.radius.md
        }}>
            {/* <SetForm form='diamond' color='green' fill='none' />
            <SetForm form='diamond' color='blue' fill='dashed' />
            <SetForm form='oval' color='red' fill='filled' /> */}
            {formElements}
        </Flex>
    )
}

export default SetCard