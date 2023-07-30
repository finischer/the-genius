import React from 'react'
import { type IGameRulesModal } from './gameRulesModal.types'
import { Modal, Text } from '@mantine/core'


// TODO: Make modal more beatiful

const GameRulesModal: React.FC<IGameRulesModal> = ({ gameName, rules, ...props }) => {
    const title = `${gameName} - Regeln`

    return (
        <Modal title={title} {...props} >
            <Text>{rules}</Text>
        </Modal>
    )
}

export default GameRulesModal