import { CheckIcon, ColorSwatch, Flex, Group, Text, Tooltip, rem, useMantineTheme } from "@mantine/core";
import useSettings from "~/hooks/useSettings/useSettings";
import { capitalize } from "~/utils/strings";

const GeneralSettingsSection = () => {
  const { updatePrimaryColor, primaryColor } = useSettings();
  const theme = useMantineTheme();

  // const swatches = Object.keys(theme.colors)
  //   .slice(2)
  //   .map((color) => {
  //     const checked = color === primaryColor;
  //     const displayedColor = theme.colors[color] || "";

  //     return (
  //       <Tooltip
  //         key={color}
  //         label={capitalize(color)}
  //       >
  //         <ColorSwatch
  //           component="button"
  //           color={displayedColor[5]}
  //           style={{ color: "#fff", cursor: "pointer" }}
  //           onClick={() => updatePrimaryColor(color)}
  //         >
  //           {checked && <CheckIcon width={rem(10)} />}
  //         </ColorSwatch>
  //       </Tooltip>
  //     );
  //   });
  return (
    <Flex direction="column">
      <Flex
        gap={4}
        direction="column"
      >
        {/* <Text fz="sm">Akzentfarbe</Text> */}
        {/* <Group>{swatches}</Group> */}
      </Flex>
    </Flex>
  );
};

export default GeneralSettingsSection;
