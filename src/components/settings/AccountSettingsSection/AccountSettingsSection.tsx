import { Avatar, Flex, Text, TextInput, rem } from '@mantine/core';
import { useSession } from 'next-auth/react';

const AccountSettingsSection = () => {
    const { data: session } = useSession();

    return (
        <Flex direction="column" gap="md" maw={rem(300)}>
            <Avatar src={session?.user.image} radius="100%" size="xl" />
            <>
                <TextInput
                    readOnly
                    disabled
                    label='Username'
                    type="text"
                    value={session?.user.username || "USERNAME NOT FOUND"}
                />
                <Text color="dimmed" size="sm">Der Username wird in den Spielshows verwendet und ist für andere User sichtbar</Text>
            </>
            <>
                <TextInput
                    readOnly
                    disabled
                    label='Name'
                    type="text"
                    value={session?.user.name || "NAME NOT FOUND"}
                />
                <Text color="dimmed" size="sm">Der Name wird nicht öffentlich angezeigt und kann nicht geändert werden</Text>
            </>
            <TextInput
                readOnly
                disabled
                label='Email'
                type="email"
                value={session?.user.email || "EMAIL NOT FOUND"}
            />
        </Flex>
    )
}

export default AccountSettingsSection