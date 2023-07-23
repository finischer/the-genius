import { TransferList, type TransferListData } from '@mantine/core';
import { useEffect, useState } from 'react';
import { COUNTRIES } from '~/games/flaggen/config';
import { type TCountry } from '~/games/flaggen/flaggen.types';
import { useConfigurator } from '~/hooks/useConfigurator/useConfigurator';


const availableCountries = Object.keys(COUNTRIES).map(code => ({ key: code, value: code, label: COUNTRIES[code] as string }))

const transferList: TransferListData = [
    availableCountries,
    [],
];

// HINT: Not in use cause of performance problems
// TODO: Optimize performance
// const CountryItem: React.FC<TransferListItemComponentProps> = ({ data, selected }) => {
//     const countryImg = useMemo(() => <img src={`https://flagcdn.com/w40/${data.value}.png`} alt={data.label} width={40} />, [data.value])

//     return (
//         <Group noWrap>
//             <Checkbox checked={selected} onChange={() => { }} tabIndex={-1} sx={{ pointerEvents: 'none' }} />
//             {countryImg}
//             <Text>{data.label}</Text>
//         </Group>
//     )
// }

const FlaggenConfigurator = () => {
    const [flaggen, setFlaggen] = useConfigurator("flaggen")
    const [countries, setCountries] = useState(transferList)

    useEffect(() => {
        // if (flaggen.countries.length > 0) {
        //     setCountries(() => {
        //         const aCountries = availableCountries.map(c => {
        //             if (!flaggen.countries.map(c => c.shortCode).includes(c.value)) {
        //                 return c
        //             }
        //         })

        //         return [aCountries, flaggen.countries]
        //     })

        //     return
        // }

        const transformedCountries: TCountry[] = countries[1].map(c => ({ shortCode: c.value, country: c.label }))

        setFlaggen(oldState => ({
            ...oldState,
            flaggen: {
                ...oldState.flaggen,
                countries: transformedCountries
            }
        }))
    }, [countries])

    useEffect(() => {
        console.log("Flaggen: ", flaggen)
    }, [flaggen])

    return (
        <TransferList
            value={countries}
            onChange={setCountries}
            // itemComponent={CountryItem}
            searchPlaceholder="Land suchen ..."
            nothingFound="Kein Land gefunden"
            titles={["Verfügbare Länder", "Ausgewählte Länder"]}
            breakpoint="sm"
            listHeight={600}
        />
    )
}

export default FlaggenConfigurator