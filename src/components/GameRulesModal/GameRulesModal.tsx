import React from 'react'
import { type IGameRulesModal } from './gameRulesModal.types'
import { Modal, Text } from '@mantine/core'


// TODO: Make modal more beatiful

const GameRulesModal: React.FC<IGameRulesModal> = ({ gameName, rules, ...props }) => {
    return (
        <Modal title={gameName} {...props} >
            <Text>{rules}</Text>
        </Modal>
    )
}

export default GameRulesModal