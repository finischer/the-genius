import React, { useEffect, useState } from 'react'
import { type IGamesPickerProps } from './gamesPicker.types'
import { TransferList, type TransferListData } from '@mantine/core'

const availableGames: TransferListData = [
    [
        { value: 'flaggen', label: 'Flaggen' },
        // { value: 'zehnSetzen', label: 'Zehn setzen' },
        // { value: 'fragenhagel', label: 'Fragenhagel' },
        // { value: 'merken', label: 'Merken' },
        // { value: 'duSagst', label: 'Du sagst ...' },
        // { value: 'buchstabensalat', label: 'Buchstabensalat' },
        // { value: 'referatBingo', label: 'Referat-Bingo' },
    ],
    [],
];

const GamesPicker: React.FC<IGamesPickerProps> = ({ setSelectedGames }) => {
    const [games, setGames] = useState<TransferListData>(availableGames)

    useEffect(() => {
        setSelectedGames(games[1])
    }, [games])

    return (
        <TransferList
            value={games}
            onChange={setGames}
            searchPlaceholder="Suchen ..."
            nothingFound="Kein Spiel gefunden"
            titles={[`Verfügbare Spiele (${games[0].length})`, `Ausgewählte Spiele (${games[1].length})`]}
            breakpoint="sm"
            listHeight={400}
        />
    )
}

export default GamesPicker