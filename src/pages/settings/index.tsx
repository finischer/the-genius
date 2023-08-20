import { Tabs, Title } from '@mantine/core';
import { IconSettings, IconUser } from '@tabler/icons-react';
import PageLayout from '~/components/layout';
import AccountSettingsSection from '~/components/settings/AccountSettingsSection';
import GeneralSettingsSection from '~/components/settings/GeneralSettingsSection';

const SettingsPage = () => {
    return (
        <PageLayout>
            <Title order={2}>Einstellungen</Title>

            <Tabs defaultValue="general">
                <Tabs.List>
                    <Tabs.Tab value="general" icon={<IconSettings />}>Allgemein</Tabs.Tab>
                    <Tabs.Tab value="account" icon={<IconUser />}>Account</Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="general" pt="xs">
                    <GeneralSettingsSection />
                </Tabs.Panel>

                <Tabs.Panel value="account" pt="xs">
                    <AccountSettingsSection />
                </Tabs.Panel>
            </Tabs>
        </PageLayout>
    )
}

export default SettingsPage