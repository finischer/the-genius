import React from 'react'
import { type IAnswerBannerProps } from './answerBanner.types'
import { Box, Text, useMantineTheme } from '@mantine/core'

const AnswerBanner: React.FC<IAnswerBannerProps> = ({ answer, size = "m", miw = "30rem", showAnswer = true }) => {
  const theme = useMantineTheme()

  const getFontSize = () => {
    if (size === "s") return "0.5rem"
    if (size === "m") return "1rem"
    if (size === "l") return "1.75rem"

    return "1rem"
  }

  if (!showAnswer) return <></>

  return (
    <Box
      bg={theme.white}
      mah="5rem"
      miw={miw}
      maw="100%"
      p="0.5rem 4rem"
      display="flex"
      ml="xl"
      mr="xl"
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
  )
}

export default AnswerBanner