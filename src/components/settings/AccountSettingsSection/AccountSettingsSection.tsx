import { Avatar, Flex, TextInput, rem } from '@mantine/core';
import { useSession } from 'next-auth/react';

const AccountSettingsSection = () => {
    const { data } = useSession();

    return (
        <Flex direction="column" gap="md" maw={rem(300)}>
            <Avatar src={data?.user.image} radius="100%" size="xl" />
            <TextInput
                readOnly
                disabled
                label='Username'
                type="text"
                value={data?.user.name || "USERNAME NOT FOUND"}
            />
            <TextInput
                readOnly
                disabled
                label='Email'
                type="email"
                value={data?.user.email || "EMAIL NOT FOUND"}
            />
        </Flex>
    )
}

export default AccountSettingsSection