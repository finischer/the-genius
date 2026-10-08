import {
  Button,
  Flex,
  Group,
  Image,
  NumberInput,
  Paper,
  ScrollArea,
  Stack,
  Text,
  Title
} from "@mantine/core";
import { IconDice, IconSelectAll } from "@tabler/icons-react";
import { useContext, useEffect, useMemo, useState } from "react";
import SearchInput from "~/components/SearchInput";
import React from "react";
import { useImmer } from "use-immer";
import { COUNTRIES } from "~/games/Flaggen/config";
import type { TCountry } from "~/games/Flaggen/flaggen.types";
import List from "~/components/List";
import { StepperControlsContext } from "~/context/StepperControlsContext";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import { Game } from "~/games";

const availableCountries: TCountry[] = Object.keys(COUNTRIES).map((code) => ({
  id: code,
  shortCode: code,
  country: COUNTRIES[code] as string
}));

const CountryItem = React.memo(({ country }: { country: TCountry }) => (
  <Group>
    <Image
      src={`https://flagcdn.com/w40/${country.shortCode}.png`}
      alt={country.country}
      w={40}
      h="auto"
      loading="lazy"
    />
    <Text>{country.country}</Text>
  </Group>
));

const FlaggenConfigurator = () => {
  const { disableContinueButton, enableContinueButton } = useContext(
    StepperControlsContext
  );
  const { flaggen, updateGame } = useGameshowConfig(Game.FLAGGEN);

  const [selectedCountries, setSelectedCountries] = useImmer<TCountry[]>([]);
  const [randomCount, setRandomCount] = useState<number | string>(
    availableCountries.length
  );
  const [availableSearch, setAvailableSearch] = useState("");
  const [selectedSearch, setSelectedSearch] = useState("");

  const notSelectedCountries = availableCountries.filter(
    (c) => !selectedCountries.map((c) => c.shortCode).includes(c.shortCode)
  );

  useEffect(() => {
    const savedCountries: TCountry[] = flaggen.countries.map((c) => ({
      id: c.shortCode,
      country: c.country,
      shortCode: c.shortCode
    }));

    setSelectedCountries(savedCountries);
  }, []);

  useEffect(() => {
    updateGame((draft) => {
      draft.countries = selectedCountries;
    });

    // check further button state
    if (selectedCountries.length > 0) {
      enableContinueButton();
    } else {
      disableContinueButton();
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
    if (
      !country ||
      !selectedCountries.find((c) => c.shortCode === country.shortCode)
    ) {
      return;
    }

    setSelectedCountries((draft) => {
      return draft.filter((c) => c.shortCode !== country.shortCode);
    });
  };

  const handleRandomSelect = (count: number) => {
    const shuffled = [...availableCountries].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, count);

    setSelectedCountries(picked);
  };

  const filteredAvailable = useMemo(() => {
    const q = availableSearch.toLowerCase();
    return notSelectedCountries.filter((c) =>
      c.country.toLowerCase().includes(q)
    );
  }, [notSelectedCountries, availableSearch]);

  const filteredSelected = useMemo(() => {
    const q = selectedSearch.toLowerCase();
    return selectedCountries.filter((c) => c.country.toLowerCase().includes(q));
  }, [selectedCountries, selectedSearch]);

  const availableListItems = useMemo(
    () => filteredAvailable.map((c) => <CountryItem key={c.id} country={c} />),
    [filteredAvailable]
  );

  const selectedListItems = useMemo(
    () => filteredSelected.map((c) => <CountryItem key={c.id} country={c} />),
    [filteredSelected]
  );

  return (
    <Stack gap="md">
      <Paper withBorder p="md" radius="md">
        <Stack gap="xs">
          <Text fw={600} size="sm">
            Zufällige Auswahl
          </Text>
          <Group align="flex-end" gap="sm" wrap="wrap">
            <NumberInput
              label="Anzahl Flaggen"
              min={1}
              max={availableCountries.length}
              value={randomCount}
              onChange={setRandomCount}
              w={160}
            />
            <Button
              leftSection={<IconDice size={16} />}
              variant="light"
              onClick={() =>
                handleRandomSelect(
                  typeof randomCount === "number"
                    ? randomCount
                    : availableCountries.length
                )
              }
            >
              Zufällig befüllen
            </Button>
            <Button
              leftSection={<IconSelectAll size={16} />}
              variant="subtle"
              onClick={() => {
                setRandomCount(availableCountries.length);
                handleRandomSelect(availableCountries.length);
              }}
            >
              Max Anzahl ({availableCountries.length})
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Flex
        gap="md"
        justify="center"
        direction={{ base: "column", md: "row", lg: "row" }}
      >
        <Stack w="100%">
          <Title order={3}>Verfügbare Flaggen</Title>
          <SearchInput
            value={availableSearch}
            onChange={setAvailableSearch}
            placeholder="Flagge suchen..."
          />
          <ScrollArea mah={800} type="auto">
            <List
              data={filteredAvailable}
              setData={() => undefined}
              listItem={availableListItems}
              renderValueByKey="country"
              onClickItem={handleSelectCountry}
              onDeleteItem={handleDeselectCountry}
              emptyListText="Keine Flaggen gefunden."
              clickable
            />
          </ScrollArea>
        </Stack>
        <Stack w="100%">
          <Title order={3}>Ausgewählte Flaggen</Title>
          <SearchInput
            value={selectedSearch}
            onChange={setSelectedSearch}
            placeholder="Flagge suchen..."
          />
          <ScrollArea mah={800} type="auto">
            <List
              emptyListText={
                selectedSearch.length > 0
                  ? "Keine Flaggen gefunden."
                  : "Füge deine erste Flagge hinzu!"
              }
              data={filteredSelected}
              setData={setSelectedCountries}
              listItem={selectedListItems}
              renderValueByKey="country"
              editable
              deletableItems
            />
          </ScrollArea>
        </Stack>
      </Flex>
    </Stack>
  );
};

export default FlaggenConfigurator;
