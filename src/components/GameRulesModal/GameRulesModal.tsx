import React from 'react'
import { IGameRulesModal } from './gameRulesModal.types'
import { Modal, Text } from '@mantine/core'

const GameRulesModal: React.FC<IGameRulesModal> = ({ gameName, rules, ...props }) => {
    return (
        <Modal title={gameName} {...props} >
            <Text>{rules}</Text>
        </Modal>
    )
}

export default GameRulesModal