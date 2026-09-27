import {
  Box,
  Flex,
  Group,
  NumberInput,
  ScrollArea,
  Stack,
  Text,
  Title
} from "@mantine/core";
import {
  IconPlayerPause,
  IconPlayerPlay,
  IconRotate,
  IconRotateClockwise
} from "@tabler/icons-react";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useImmer } from "use-immer";
import ActionIcon from "~/components/ActionIcon";
import List from "~/components/List";
import { StepperControlsContext } from "~/context/StepperControlsContext";
import {
  COUNTRIES,
  type TCountry
} from "~/games/AufDenKopfGestellt/aufDenKopfGestellt.data";
import type {
  TDrawAnimState,
  TSelectedCountry
} from "~/games/AufDenKopfGestellt/aufDenKopfGestellt.types";
import { CountrySvg } from "~/games/AufDenKopfGestellt/components/CountrySvg";
import { useGameshowConfig } from "~/hooks/useGameshowConfig/useGameshowConfig";
import { Game } from "~/games";
import classes from "./AufDenKopfGestelltConfigurator.module.css";

// All countries as selectable list items (default 15s duration)
const ALL_COUNTRY_ITEMS: TSelectedCountry[] = COUNTRIES.map((c) => ({
  id: c.shortName,
  name: c.name,
  shortName: c.shortName,
  durationSeconds: 15
}));

const CountryListItem = React.memo(
  ({ country }: { country: TSelectedCountry }) => (
    <Text fz="sm">{country.name}</Text>
  )
);

// --- SVG Preview Panel (no useSyncedRoom – local state only) ---
const SvgPreviewPanel = ({
  country,
  selectedCountry,
  onDurationChange
}: {
  country: TCountry | undefined;
  selectedCountry: TSelectedCountry | undefined;
  onDurationChange: (seconds: number) => void;
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);
  const [animState, setAnimState] = useState<TDrawAnimState>("idle");
  const [isRotated, setIsRotated] = useState(false);
  const [animKey, setAnimKey] = useState(0);

  const duration = selectedCountry?.durationSeconds ?? 15;

  // Reset + re-measure when country changes
  useEffect(() => {
    setAnimState("idle");
    setIsRotated(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (pathRef.current) {
          setPathLength(pathRef.current.getTotalLength());
        }
      });
    });
  }, [country?.shortName]);

  if (!country) {
    return (
      <Box className={classes.previewEmpty}>
        <Text c="dimmed" fz="sm">
          Wähle ein Land aus der Liste
        </Text>
      </Box>
    );
  }

  const startAnimation = () => {
    setAnimKey((k) => k + 1);
    setAnimState("running");
    setIsRotated(false);
  };

  const handlePlay = () => {
    if (animState === "idle" || animState === "done") startAnimation();
    else if (animState === "running") setAnimState("paused");
    else setAnimState("running");
  };

  return (
    <Stack gap="sm" h="100%">
      <Group justify="space-between">
        <Text fw={700}>{country.name}</Text>
        <Group gap="xs">
          <ActionIcon
            toolTip={isRotated ? "Kopfüber drehen" : "Aufrichten"}
            variant="default"
            size="md"
            onClick={() => setIsRotated((r) => !r)}
          >
            <IconRotate size={16} />
          </ActionIcon>
          <ActionIcon
            toolTip="Neu starten"
            variant="default"
            size="md"
            onClick={startAnimation}
            disabled={animState === "idle"}
          >
            <IconRotateClockwise size={16} />
          </ActionIcon>
          <ActionIcon
            toolTip={
              animState === "running"
                ? "Pausieren"
                : animState === "paused"
                  ? "Fortfahren"
                  : "Animation abspielen"
            }
            variant="filled"
            color={animState === "running" ? "yellow" : "green"}
            size="md"
            onClick={handlePlay}
          >
            {animState === "running" ? (
              <IconPlayerPause size={16} />
            ) : (
              <IconPlayerPlay size={16} />
            )}
          </ActionIcon>
        </Group>
      </Group>

      <NumberInput
        label="Animationsgeschwindigkeit"
        description="Sekunden bis der Umriss vollständig gezeichnet ist"
        min={3}
        max={60}
        step={1}
        suffix=" s"
        value={duration}
        onChange={(val) => {
          if (typeof val === "number" && val >= 3) onDurationChange(val);
        }}
        disabled={selectedCountry === undefined}
        w="100%"
      />

      <Box className={classes.svgWrapper}>
        <CountrySvg
          country={country}
          isRotated={isRotated}
          animState={animState}
          pathLength={pathLength}
          durationSeconds={duration}
          animKey={animKey}
          pathRef={pathRef}
          onAnimationEnd={() => setAnimState("done")}
          svgClassName={classes.countrySvg}
        />
      </Box>

      <Text fz="xs" c="dimmed" ta="center">
        {animState === "running" && "Animation läuft…"}
        {animState === "paused" && "Pausiert"}
        {animState === "done" && "Fertig – klicke ▶ zum Wiederholen"}
        {animState === "idle" && `▶ Zeichenanimation (${duration}s) starten`}
      </Text>
    </Stack>
  );
};

// --- Main Configurator ---
const AufDenKopfGestelltConfigurator = () => {
  const { disableContinueButton, enableContinueButton } = useContext(
    StepperControlsContext
  );
  const { aufDenKopfGestellt, updateGame } = useGameshowConfig(
    Game.AUF_DEN_KOPF_GESTELLT
  );

  const [selectedCountries, setSelectedCountries] = useImmer<
    TSelectedCountry[]
  >(aufDenKopfGestellt.selectedCountries);

  const [availableCountries, setAvailableCountries] = useImmer<
    TSelectedCountry[]
  >(
    ALL_COUNTRY_ITEMS.filter(
      (c) =>
        !aufDenKopfGestellt.selectedCountries.some(
          (s) => s.shortName === c.shortName
        )
    )
  );

  const [previewCountry, setPreviewCountry] = useState<TCountry | undefined>(
    COUNTRIES.find(
      (c) => c.shortName === aufDenKopfGestellt.selectedCountries[0]?.shortName
    )
  );
  const [previewSelected, setPreviewSelected] = useState<
    TSelectedCountry | undefined
  >(aufDenKopfGestellt.selectedCountries[0]);

  // Sync game state + continue-button whenever selection changes
  useEffect(() => {
    updateGame((draft) => {
      draft.selectedCountries = selectedCountries;
    });
    if (selectedCountries.length > 0) {
      enableContinueButton();
    } else {
      disableContinueButton();
    }
  }, [selectedCountries.length]);

  const handleSelectCountry = (item: TSelectedCountry) => {
    if (selectedCountries.find((c) => c.shortName === item.shortName)) return;
    setSelectedCountries((draft) => {
      draft.push(item);
    });
    setAvailableCountries((draft) =>
      draft.filter((c) => c.shortName !== item.shortName)
    );
    setPreviewCountry(COUNTRIES.find((c) => c.shortName === item.shortName));
    setPreviewSelected(item);
  };

  const handleDeselectCountry = (item: TSelectedCountry | undefined) => {
    if (!item) return;
    setSelectedCountries((draft) =>
      draft.filter((c) => c.shortName !== item.shortName)
    );
    setAvailableCountries((draft) => {
      draft.push(item);
    });
  };

  const handlePreviewCountry = (item: TSelectedCountry) => {
    setPreviewCountry(COUNTRIES.find((c) => c.shortName === item.shortName));
    setPreviewSelected(
      selectedCountries.find((c) => c.shortName === item.shortName)
    );
  };

  const handleDurationChange = (seconds: number) => {
    setSelectedCountries((draft) => {
      const idx = draft.findIndex(
        (c) => c.shortName === previewSelected?.shortName
      );
      if (idx !== -1 && draft[idx]) {
        draft[idx].durationSeconds = seconds;
      }
    });
    setPreviewSelected((prev) =>
      prev ? { ...prev, durationSeconds: seconds } : prev
    );
  };

  const availableListItems = availableCountries.map((c) => (
    <CountryListItem key={c.id} country={c} />
  ));
  const selectedListItems = selectedCountries.map((c) => (
    <CountryListItem key={c.id} country={c} />
  ));

  return (
    <Flex direction="column" gap="lg">
      {/* Global settings */}
      <Group gap="xl" align="flex-end">
        <NumberInput
          label="Maximale Punkte"
          description="Wie viele Runden werden gespielt"
          min={1}
          max={COUNTRIES.length}
          value={aufDenKopfGestellt.maxPoints}
          onChange={(val) => {
            updateGame((draft) => {
              draft.maxPoints = typeof val === "number" ? val : 7;
            });
          }}
          w={200}
        />
      </Group>

      {/* Three-column layout: Available | SVG Preview | Selected */}
      <Flex gap="md" align="flex-start">
        {/* Available */}
        <Stack w="220px" style={{ flexShrink: 0 }}>
          <Title order={4}>
            Verfügbare Länder{" "}
            <Text span c="dimmed" fz="sm" fw={400}>
              ({availableCountries.length})
            </Text>
          </Title>
          <ScrollArea h={500} type="auto">
            <List
              data={availableCountries}
              setData={setAvailableCountries}
              listItem={availableListItems}
              renderValueByKey="name"
              onClickItem={handleSelectCountry}
              clickable
            />
          </ScrollArea>
        </Stack>

        {/* SVG Preview */}
        <Box style={{ flex: 1 }}>
          <Title order={4} mb="sm">
            Vorschau
          </Title>
          <SvgPreviewPanel
            country={previewCountry}
            selectedCountry={previewSelected}
            onDurationChange={handleDurationChange}
          />
        </Box>

        {/* Selected */}
        <Stack w="220px" style={{ flexShrink: 0 }}>
          <Title order={4}>
            Ausgewählt{" "}
            <Text span c="dimmed" fz="sm" fw={400}>
              ({selectedCountries.length})
            </Text>
          </Title>
          <ScrollArea h={500} type="auto">
            <List
              emptyListText="Füge dein erstes Land hinzu!"
              data={selectedCountries}
              setData={setSelectedCountries}
              listItem={selectedListItems}
              renderValueByKey="name"
              onClickItem={handlePreviewCountry}
              onDeleteItem={handleDeselectCountry}
              editable
              deletableItems
              clickable
            />
          </ScrollArea>
        </Stack>
      </Flex>
    </Flex>
  );
};

export default AufDenKopfGestelltConfigurator;
