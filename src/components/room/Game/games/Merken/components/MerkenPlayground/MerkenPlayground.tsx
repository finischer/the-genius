import React from 'react'
import type { IMerkenPlaygroundProps } from './merkenPlayground.types'
import { Grid, Text, type Sx, Container } from '@mantine/core'
import { colors } from '~/styles/constants'

const MerkenPlayground: React.FC<IMerkenPlaygroundProps> = ({ cards, openCards = [], allCardsFlipped = false }) => {
    const tstArrayData = new Array(24).fill(null).map((_, idx) => idx)

    // FOR MERKEN CARDS
    const defaultCardStyle: Sx = {
        backfaceVisibility: "hidden",
        position: "absolute",
        top: 0,
        left: 0,

        userSelect: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    }

    const handleClick = () => {
        // if (clickable) {
        //     setFlipped(oldState => !oldState)
        //     onClick()
        // }
    }

    return (
        <Grid>
            <Grid.Col span={2}>1</Grid.Col>
            <Grid.Col span={2}>2</Grid.Col>
            <Grid.Col span={2}>3</Grid.Col>
            <Grid.Col span={2}>4</Grid.Col>
            <Grid.Col span={2}>5</Grid.Col>
            <Grid.Col span={2}>6</Grid.Col>
            <Grid.Col span={2}>7</Grid.Col>
            <Grid.Col span={2}>8</Grid.Col>
        </Grid>
    )

    // return (
    //     <Grid align='center' justify='center' gutter={0} >
    //         {tstArrayData.map((elem, idx) => (
    //             <Grid.Col span={2}   >
    //                 <Container
    //                     p={0}
    //                     m={0}
    //                     h="5rem"
    //                     w="5rem"
    //                     bg="white"
    //                     onClick={handleClick}
    //                 >
    //                     <Container
    //                         sx={{
    //                             transformStyle: "preserve-3d",
    //                             transition: "300ms linear 0.1s",
    //                             position: "relative",
    //                             transform: openCards.includes(idx) ? "rotateY(180deg)" : "unset"
    //                         }}
    //                     >
    //                         <Container
    //                             sx={(theme) => ({
    //                                 ...defaultCardStyle,
    //                                 transform: "rotateY(0)",
    //                                 background: theme.primaryColor
    //                             })}
    //                         >
    //                             {elem}
    //                         </Container>
    //                         <Container
    //                             sx={(theme) => ({
    //                                 ...defaultCardStyle,
    //                                 transform: "rotateY(180deg)",
    //                                 background: theme.primaryColor
    //                             })}

    //                         >
    //                             Ich weiß, was du nicht weißt
    //                         </Container>
    //                     </Container>
    //                 </Container>
    //             </Grid.Col>

    //         ))}
    //     </Grid>
    // )
}

export default MerkenPlayground