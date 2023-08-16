import { Button, CheckIcon, ColorSwatch, Flex, Group, Text, Title, rem, useMantineTheme } from '@mantine/core';
import PageLayout from '~/components/layout';
import Tooltip from '~/components/shared/Tooltip/Tooltip';
import useSettings from '~/hooks/useSettings/useSettings';
import { capitalize } from '~/utils/strings';

const SettingsPage = () => {
    const { updatePrimaryColor, primaryColor } = useSettings()
    const theme = useMantineTheme();

    const swatches = Object.keys(theme.colors).slice(2).map((color) => {
        const checked = color === primaryColor
        const displayedColor = theme.colors[color] || ""

        return (
            <Tooltip label={capitalize(color)}>
                <ColorSwatch
                    component='button'
                    key={color}
                    color={displayedColor[5]}
                    sx={{ color: '#fff', cursor: 'pointer' }}
                    onClick={() => updatePrimaryColor(color)}
                >
                    {checked && <CheckIcon width={rem(10)} />}
                </ColorSwatch>
            </Tooltip>

        )

    });

    return (
        <PageLayout>
            <Title order={2}>Einstellungen</Title>
            <Flex mt="xl">
                <Group spacing="md">
                    <Text>Akzentfarbe:</Text>
                    <Group>
                        {swatches}
                    </Group>
                </Group>
            </Flex>
        </PageLayout>
    )
}

export default SettingsPage