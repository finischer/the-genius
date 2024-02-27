import { Button, Text, type ButtonProps, LoadingOverlay } from "@mantine/core";
import { IconBrandDiscordFilled, IconBrandGoogle } from "@tabler/icons-react";
import { signIn } from "next-auth/react";
import React, { useState, type MouseEventHandler } from "react";
import classes from "./signInButton.module.css";

const DISCORD_PRIMARY_COLOR = "#7289DA";

enum Provider {
  GOOGLE = "google",
  DISCORD = "discord",
}

interface ISignInButton extends ButtonProps {
  onClick: MouseEventHandler<HTMLButtonElement>;
}

export const GoogleButton: React.FC<ISignInButton> = ({ onClick, ...props }) => {
  return (
    <Button
      className={classes.signinBtnGoogle}
      leftSection={<IconBrandGoogle />}
      variant="default"
      onClick={onClick}
      size="xl"
      {...props}
    />
  );
};

export const DiscordButton: React.FC<ISignInButton> = ({ onClick, ...props }) => {
  return (
    <Button
      className={classes.signinBtnDiscord}
      leftSection={<IconBrandDiscordFilled size="1.5rem" />}
      onClick={onClick}
      variant="default"
      size="xl"
      {...props}
    />
  );
};

const SignInButton = () => {
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (provider: Provider) => {
    setLoading(true);
    await signIn(provider);
  };

  return (
    <>
      <LoadingOverlay visible={loading} />
      <GoogleButton onClick={() => handleSignIn(Provider.GOOGLE)}>
        <Text>Mit Google fortfahren</Text>
      </GoogleButton>
      <DiscordButton onClick={() => handleSignIn(Provider.DISCORD)}>
        <Text>Mit Discord einloggen</Text>
      </DiscordButton>
    </>
  );
};

export default SignInButton;
