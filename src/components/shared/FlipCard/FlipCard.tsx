import { Container, Title, type Sx, useMantineTheme } from '@mantine/core';
import React from 'react';
import ReactCardFlip from 'react-card-flip';
import { sizes } from '~/styles/constants';
import { type IFlipCardProps } from './flipcard.types';

const FlipCard: React.FC<IFlipCardProps> = ({ isFlipped = false, setFlipped, clickable, onClick = () => null, front, back, frontStyle = {}, backStyle = {} }) => {
    const theme = useMantineTheme()
    const themeColors = theme.colors[theme.primaryColor]

    const defaultCardStyle: Sx = {
        boxShadow: "4px 3px 32px -7px rgba(0, 0, 0, 0.75)",
        WebkitBoxShadow: "4px 3px 32px -7px rgba(0, 0, 0, 0.75)",
        padding: "1rem 2.5rem",
        textAlign: "center",
        borderRadius: sizes.borderRadius,
        whiteSpace: "nowrap",
        textTransform: "uppercase"
    }

    const handleClick = () => {
        if (clickable) {
            if (setFlipped) {
                setFlipped(oldState => !oldState)
            }
            onClick()
        }
    }

    return (
        <Container p={0} m={0} onClick={handleClick} sx={{
            ":hover": {
                cursor: clickable ? "pointer" : "auto",
                opacity: clickable ? 0.9 : 1
            }
        }}>
            <ReactCardFlip isFlipped={isFlipped} flipDirection='horizontal' flipSpeedFrontToBack={0.9} cardStyles={{
                front: {
                    ...defaultCardStyle,
                    backgroundColor: themeColors ? themeColors[9] : theme.primaryColor,
                    ...frontStyle,
                },
                back: {
                    ...defaultCardStyle,
                    backgroundColor: themeColors ? themeColors[7] : theme.primaryColor,
                    ...backStyle
                }
            }}
            >
                {/* Front */}
                <Container>
                    <Title>{front}</Title>
                </Container>

                {/* Back */}
                <Container>
                    <Title>{back}</Title>
                </Container>
            </ReactCardFlip>
        </Container>
    )
}

export default FlipCard