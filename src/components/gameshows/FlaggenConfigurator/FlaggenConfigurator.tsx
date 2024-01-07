import { Checkbox, Flex, Group, Image, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import QuestionFormLayout from "~/components/Layouts/QuestionFormLayout";
import { COUNTRIES } from "~/components/room/Game/games/Flaggen/config";
import type { TCountry } from "~/components/room/Game/games/Flaggen/flaggen.types";
import List from "~/components/shared/List";
import { useConfigurator } from "~/hooks/useConfigurator";

const availableCountries: TCountry[] = Object.keys(COUNTRIES).map((code) => ({
  shortCode: code,
  country: COUNTRIES[code] as string,
}));

// TODO: Optimize performance
// const CountryItem = () => (
//   <Group>
//     <Checkbox
//       checked={selected}
//       onChange={() => null}
//       tabIndex={-1}
//       style={{ pointerEvents: "none" }}
//     />
//     <Image
//       src={`https://flagcdn.com/w40/${data.value}.png`}
//       alt={data.label}
//       width={40}
//     />
//     <Text>{data.label}</Text>
//   </Group>
// );

const FlaggenConfigurator = () => {
  const [flaggen, setFlaggen, { enableFurtherButton, disableFurtherButton }] = useConfigurator("flaggen");
  const [countries, setCountries] = useState(flaggen.countries);
  const [selectedCountries, setSelectedCountries] = useImmer<TCountry[]>([]);

  useEffect(() => {
    const selectedCountries: TCountry[] = flaggen.countries.map((c) => ({
      country: c.country,
      shortCode: c.shortCode,
    }));

    const notSelectedCountries = availableCountries.filter(
      (c) => !selectedCountries.map((c) => c.shortCode).includes(c.shortCode)
    );

    setCountries(notSelectedCountries);
    setSelectedCountries(selectedCountries);
  }, []);

  useEffect(() => {
    setFlaggen((draft) => {
      draft.flaggen.countries = selectedCountries;
    });

    // check further button state
    if (selectedCountries.length > 0) {
      enableFurtherButton();
    } else {
      disableFurtherButton();
    }
  }, [selectedCountries.length]);

  const handleSelectCountry = (country: TCountry) => {
    console.log("Select Country: ", country.shortCode);
    setSelectedCountries((draft) => {
      draft.push(country);
    });
  };

  return (
    <Flex gap="md">
      <List
        data={countries}
        setData={setCountries}
        keyId="shortCode"
        renderValueByKey="country"
        onClickItem={handleSelectCountry}
        clickable
      />

      <List
        data={selectedCountries}
        setData={setSelectedCountries}
        keyId="shortCode"
        renderValueByKey="country"
        editable
        deletableItems
      />
    </Flex>
    // <TransferList
    //   value={countries}
    //   onChange={setCountries}
    //   itemComponent={CountryItem}
    //   searchPlaceholder="Flagge suchen ..."
    //   nothingFound="Keine Flagge gefunden"
    //   titles={[`Verfügbare Flaggen (${countries[0].length})`, `Ausgewählte Flaggen (${countries[1].length})`]}
    //   breakpoint="sm"
    //   listHeight={600}
    // />
  );
};

export default FlaggenConfigurator;
