import { Button, type ButtonProps } from '@mantine/core';
import { IconBrandDiscordFilled, IconBrandFacebookFilled, IconBrandGoogle } from '@tabler/icons-react';
import React from 'react';
import { signIn } from 'next-auth/react';


const DISCORD_PRIMARY_COLOR = "#7289DA"

export const GoogleButton: React.FC<ButtonProps> = ({ ...props }) => {
    return <Button leftIcon={<IconBrandGoogle />} variant="filled" color="gray" onClick={() => signIn("google")} {...props} />;
}

export function FacebookButton(props: ButtonProps) {
    return (
        <Button
            leftIcon={<IconBrandFacebookFilled />}
            sx={(theme) => ({
                backgroundColor: '#4267B2',
                color: '#fff',
                '&:not([data-disabled]):hover': {
                    backgroundColor: theme.fn.darken('#4267B2', 0.1),
                },
            })}
            {...props}
        />
    );
}

export function DiscordButton(props: ButtonProps) {
    return (
        <Button
            leftIcon={<IconBrandDiscordFilled size="1.5rem" />}
            sx={(theme) => ({
                backgroundColor: DISCORD_PRIMARY_COLOR,
                '&:not([data-disabled]):hover': {
                    backgroundColor: theme.fn.darken(DISCORD_PRIMARY_COLOR, 0.05),
                },
            })}
            {...props}
        />
    );
}

const SignInButton = () => {
    return (
        <>
            <GoogleButton>Mit Google fortfahren</GoogleButton>
            {/* <DiscordButton>Mit Discord einloggen</DiscordButton> */}
        </>
    )
}

export default SignInButton