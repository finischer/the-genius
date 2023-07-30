import React from 'react'
import { type IAnswerBannerProps } from './answerBanner.types'
import { Box, Text, useMantineTheme } from '@mantine/core'

const AnswerBanner: React.FC<IAnswerBannerProps> = ({ answer }) => {
  const theme = useMantineTheme()

  return (
    <Box
      bg={theme.white}
      mah="5rem"
      miw="30rem"
      p="0.5rem 4rem"
      display="flex"
      ml="xl"
      mr="xl"
      sx={{
        justifyContent: "center",
        alignItems: "center",
        color: "black",
        fontSize: "1.75rem",
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
          overflow: "hidden"
        }} >
        {answer}
      </Text>
    </Box>
  )
}

export default AnswerBanner