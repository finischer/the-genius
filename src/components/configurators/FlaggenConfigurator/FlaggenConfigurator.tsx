import { TransferList, type TransferListData } from '@mantine/core';
import { useEffect, useState } from 'react';
import { COUNTRIES } from '~/games/flaggen/config';
import { type TCountry } from '~/games/flaggen/flaggen.types';
import { useConfigurator } from '~/hooks/useConfigurator';

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
    const [flaggen, setFlaggen, { enableFurtherButton, disableFurtherButton }] = useConfigurator("flaggen")
    const [countries, setCountries] = useState(transferList)


    useEffect(() => {
        const selectedCountries = flaggen.countries.map(c => ({ key: c.shortCode, value: c.shortCode, label: c.country }))
        const notSelectedCountries = availableCountries.filter(c => !selectedCountries.map(c => c.value).includes(c.value))

        setCountries([notSelectedCountries, selectedCountries])
    }, [])

    useEffect(() => {
        const transformedCountries: TCountry[] = countries[1].map(c => ({ key: c.value, shortCode: c.value, country: c.label }))

        setFlaggen(draft => {
            draft.flaggen.countries = transformedCountries
        })

        // check further button state
        if (transformedCountries.length > 0) {
            enableFurtherButton()
        } else {
            disableFurtherButton()
        }
    }, [countries])

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