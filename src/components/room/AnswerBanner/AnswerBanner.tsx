import React from 'react'
import { type IAnswerBannerProps } from './answerBanner.types'
import { Box, Text, useMantineTheme } from '@mantine/core'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'
import { animations } from '~/utils/animations'

const AnswerBanner: React.FC<IAnswerBannerProps> = ({ answer, size = "m", miw = "30rem", showAnswer = true, ...props }) => {
  const theme = useMantineTheme()

  const getFontSize = () => {
    if (size === "s") return "0.5rem"
    if (size === "m") return "1rem"
    if (size === "l") return "1.75rem"

    return "1rem"
  }

  return (
    <AnimatePresence>
      {showAnswer &&
        <motion.div {...animations.fadeInOut}>
          <Box
            bg={theme.white}
            mah="5rem"
            miw={miw}
            maw="100%"
            p="0.5rem 4rem"
            display="flex"
            sx={{
              justifyContent: "center",
              alignItems: "center",
              color: "black",
              fontSize: getFontSize(),
              fontWeight: "bold",
              textAlign: "center",
              overflow: "hidden",
              borderRadius: "100px",
              boxShadow: theme.shadows.xl
            }}
            {...props}
          >
            <Text
              transform='uppercase'
              sx={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                fontFamily: "Montserrat-Bold, sans-serif",
                letterSpacing: 3
              }} >
              {answer}
            </Text>
          </Box>
        </motion.div>
      }
    </AnimatePresence>
  )
}

export default AnswerBanner