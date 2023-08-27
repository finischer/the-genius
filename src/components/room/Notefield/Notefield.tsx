import { Textarea, type TextareaProps } from '@mantine/core'
import { motion } from "framer-motion"
import React from 'react'
import type Player from '~/pages/api/classes/Player/Player'
import { animations } from '~/utils/animations'

interface INotefieldProps extends TextareaProps {
    player?: Player
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