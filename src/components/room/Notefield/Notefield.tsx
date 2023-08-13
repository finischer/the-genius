import { Textarea, type TextareaProps } from '@mantine/core'
import { motion } from "framer-motion"
import React from 'react'
import type { IPlayer } from '~/pages/api/classes/Player/player.types'
import { animations } from '~/utils/animations'

interface INotefieldProps extends TextareaProps {
    player?: IPlayer
}

const Notefield: React.FC<INotefieldProps> = ({ player, ...props }) => {
    return (
        <motion.div {...animations.fadeInOut}>
            <Textarea
                label={player?.name || " "}
                w="100%"
                minRows={8}
                maxRows={8}
                {...props}

            />
        </motion.div>
    )
}

export default Notefield