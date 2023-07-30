import { Container, Title, type Sx, useMantineTheme } from '@mantine/core';
import React from 'react';
import ReactCardFlip from 'react-card-flip';
import { sizes } from '~/styles/constants';
import { type IFlipCardProps } from './flipcard.types';

const FlipCard: React.FC<IFlipCardProps> = ({ isFlipped = false, setFlipped, clickable, onClick = () => null, front, back }) => {
    const theme = useMantineTheme()
    const themeColors = theme.colors[theme.primaryColor]


    const defaultCardStyle: Sx = {
        boxShadow: "4px 3px 32px -7px rgba(0, 0, 0, 0.75)",
        WebkitBoxShadow: "4px 3px 32px -7px rgba(0, 0, 0, 0.75)",
        padding: "1rem 2.5rem",
        textAlign: "center",
        borderRadius: sizes.borderRadius,
        whiteSpace: "nowrap",
        textTransform: "uppercase",
    }

    const handleClick = () => {
        if (clickable) {
            setFlipped(oldState => !oldState)
            onClick()
        }
    }

    return (
        <ReactCardFlip isFlipped={isFlipped} flipDirection='horizontal' flipSpeedFrontToBack={0.9} cardStyles={{
            front: {
                ...defaultCardStyle,
                backgroundColor: themeColors ? themeColors[9] : theme.primaryColor
            },
            back: {
                ...defaultCardStyle,
                backgroundColor: themeColors ? themeColors[7] : theme.primaryColor
            }
        }} >
            {/* Front */}
            <Container onClick={handleClick}>
                <Title>{front}</Title>
            </Container>

            {/* Back */}
            <Container onClick={handleClick}>
                <Title>{back}</Title>
            </Container>
        </ReactCardFlip>
    )

    // FOR MERKEN CARDS
    // const defaultCardStyle: Sx = {
    //     backfaceVisibility: "hidden",
    //     position: "absolute",
    //     top: 0,
    //     left: 0,

    //     userSelect: "none",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    // }

    // return (
    //     <Container
    //         h="5rem"
    //         w="5rem"
    //         bg="green"
    //         onClick={handleClick}
    //     >
    //         <Container
    //             sx={{
    //                 transformStyle: "preserve-3d",
    //                 transition: "300ms linear 0.1s",
    //                 position: "relative",
    //                 transform: isFlipped ? "rotateY(180deg)" : "unset"
    //             }}
    //         >
    //             <Container
    //                 sx={{
    //                     ...defaultCardStyle,
    //                     transform: "rotateY(0)",
    //                     background: colors.accent
    //                 }}
    //             >
    //                 Spiel 1
    //             </Container>
    //             <Container
    //                 sx={{
    //                     ...defaultCardStyle,

    //                     transform: "rotateY(180deg)",
    //                     background: colors.accent
    //                 }}

    //             >
    //                 Ich weiß, was du nicht weißt
    //             </Container>
    //         </Container>
    //     </Container>
    // )
}

export default FlipCard