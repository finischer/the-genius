import { Checkbox, Flex, Group, Image, ScrollArea, Text } from "@mantine/core";
import { useEffect, useState } from "react";
import { useImmer } from "use-immer";
import QuestionFormLayout from "~/components/layout/QuestionFormLayout";
import { COUNTRIES } from "~/components/room/Game/games/Flaggen/config";
import type { TCountry } from "~/components/room/Game/games/Flaggen/flaggen.types";
import List from "~/components/shared/List";
import { useConfigurator } from "~/hooks/useConfigurator";

const availableCountries: TCountry[] = Object.keys(COUNTRIES).map((code) => ({
  id: code,
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
      id: c.shortCode,
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
    if (selectedCountries.find((c) => c.shortCode === country.shortCode)) {
      return;
    }

    setSelectedCountries((draft) => {
      draft.push(country);
    });
  };

  const handleDeselectCountry = (country: TCountry | undefined) => {
    if (!country || !selectedCountries.find((c) => c.shortCode === country.shortCode)) {
      return;
    }

    setSelectedCountries((draft) => {
      draft = draft.filter((c) => c.shortCode !== country.shortCode);
    });
  };

  return (
    <Flex
      gap="md"
      justify="space-between"
    >
      <ScrollArea mah={800}>
        <List
          data={countries}
          setData={setCountries}
          renderValueByKey="country"
          onClickItem={handleSelectCountry}
          onDeleteItem={handleDeselectCountry}
          clickable
        />
      </ScrollArea>

      <ScrollArea mah={800}>
        <List
          data={selectedCountries}
          setData={setSelectedCountries}
          renderValueByKey="country"
          editable
          deletableItems
        />
      </ScrollArea>
    </Flex>
  );
};

export default FlaggenConfigurator;
