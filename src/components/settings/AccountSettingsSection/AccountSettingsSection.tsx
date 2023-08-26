import { Avatar, Button, Flex, Text, TextInput, rem } from '@mantine/core';
import { IconCheck, IconEdit } from '@tabler/icons-react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useUser } from '~/hooks/useUser';

const AccountSettingsSection = () => {
    const { data: session, update: updateSession } = useSession();
    const [editMode, setEditMode] = useState(false)
    const [username, setUsername] = useState<string>(session?.user.username ?? "")
    const isEditable = editMode && session?.user.username
    const { updateUsername, isLoading, user } = useUser()

    const handleUpdateUsername = async () => {
        if (!username) return
        await updateUsername(username)
        setEditMode(false)
        setUsername(user.username || "")
    }

    return (
        <Flex direction="column" gap="md" maw={rem(300)}>
            <Avatar src={session?.user.image} radius="100%" size="xl" />
            <>
                <Flex align="flex-end" gap="sm" >
                    <TextInput
                        readOnly={!isEditable}
                        disabled={!isEditable}
                        label='Username'
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {editMode ?
                        <Button onClick={handleUpdateUsername} loading={isLoading}>
                            <IconCheck />
                        </Button>
                        :
                        <Button variant='default' onClick={() => setEditMode(true)} loading={isLoading}>
                            <IconEdit />
                        </Button>
                    }
                </Flex>
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