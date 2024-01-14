import { Tabs, Title } from "@mantine/core";
import { IconSettings, IconUser } from "@tabler/icons-react";
import PageLayout from "~/components/layout/PageLayout";
import AccountSettingsSection from "~/components/settings/AccountSettingsSection";
import GeneralSettingsSection from "~/components/settings/GeneralSettingsSection";
import NextHead from "~/components/shared/NextHead";

const SettingsPage = () => {
  return (
    <>
      <NextHead title="Einstellungen" />
      <PageLayout>
        <Title order={2}>Einstellungen</Title>

        <Tabs defaultValue="account">
          <Tabs.List>
            {/* <Tabs.Tab
              value="general"
              leftSection={<IconSettings />}
              disabled
            >
              Allgemein
            </Tabs.Tab> */}
            <Tabs.Tab
              value="account"
              leftSection={<IconUser />}
            >
              Account
            </Tabs.Tab>
          </Tabs.List>

          {/* <Tabs.Panel
            value="general"
            pt="xs"
          >
            <GeneralSettingsSection />
          </Tabs.Panel> */}

          <Tabs.Panel
            value="account"
            pt="xs"
          >
            <AccountSettingsSection />
          </Tabs.Panel>
        </Tabs>
      </PageLayout>
    </>
  );
};

export default SettingsPage;
