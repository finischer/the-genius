import { Flex, Group, Image, ScrollArea, Stack, Text, Title } from "@mantine/core";
import { useEffect } from "react";
import { useImmer } from "use-immer";
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
const CountryItem = ({ country }: { country: TCountry }) => (
  <Group>
    <Image
      src={`https://flagcdn.com/w40/${country.shortCode}.png`}
      alt={country.country}
      width={40}
    />
    <Text>{country.country}</Text>
  </Group>
);

const FlaggenConfigurator = () => {
  const [flaggen, setFlaggen, { enableFurtherButton, disableFurtherButton }] = useConfigurator("flaggen");
  const [countries, setCountries] = useImmer(flaggen.countries);
  const [selectedCountries, setSelectedCountries] = useImmer<TCountry[]>([]);

  const notSelectedCountries = availableCountries.filter(
    (c) => !selectedCountries.map((c) => c.shortCode).includes(c.shortCode)
  );

  useEffect(() => {
    const selectedCountries: TCountry[] = flaggen.countries.map((c) => ({
      id: c.shortCode,
      country: c.country,
      shortCode: c.shortCode,
    }));

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

    setCountries((draft) => {
      draft = draft.filter((c) => c.shortCode !== country.shortCode);
    });
  };

  const handleDeselectCountry = (country: TCountry | undefined) => {
    if (!country || !selectedCountries.find((c) => c.shortCode === country.shortCode)) {
      return;
    }

    setSelectedCountries((draft) => {
      draft = draft.filter((c) => c.shortCode !== country.shortCode);
    });

    setCountries((draft) => {
      draft.push(country);
    });
  };

  return (
    <Flex
      gap="md"
      justify="center"
      direction={{ base: "column", md: "row", lg: "row" }}
    >
      <Stack w="100%">
        <Title order={3}>Verfügbare Flaggen</Title>
        <ScrollArea
          mah={800}
          type="auto"
        >
          <List
            data={countries.filter((c) => !selectedCountries.map((c) => c.shortCode).includes(c.shortCode))}
            setData={setCountries}
            listItem={notSelectedCountries.map((c) => (
              <CountryItem
                key={c.id}
                country={c}
              />
            ))}
            renderValueByKey="country"
            onClickItem={handleSelectCountry}
            onDeleteItem={handleDeselectCountry}
            clickable
          />
        </ScrollArea>
      </Stack>
      <Stack w="100%">
        <Title order={3}>Ausgewählte Flaggen</Title>
        <ScrollArea
          mah={800}
          type="auto"
        >
          <List
            emptyListText="Füge deine erste Flagge hinzu!"
            data={selectedCountries}
            setData={setSelectedCountries}
            listItem={selectedCountries.map((c) => (
              <CountryItem
                key={c.id}
                country={c}
              />
            ))}
            renderValueByKey="country"
            editable
            deletableItems
          />
        </ScrollArea>
      </Stack>
    </Flex>
  );
};

export default FlaggenConfigurator;
