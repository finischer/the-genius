import { Button, darken, type ButtonProps } from "@mantine/core";
import { IconBrandDiscordFilled, IconBrandFacebookFilled, IconBrandGoogle } from "@tabler/icons-react";
import React from "react";
import { signIn } from "next-auth/react";
import classes from "./signInButton.module.css";

const DISCORD_PRIMARY_COLOR = "#7289DA";

export const GoogleButton: React.FC<ButtonProps> = ({ ...props }) => {
  const handleSignIn = () => {
    void signIn("google");
  };

  return (
    <Button
      className={classes.signinBtnGoogle}
      leftSection={<IconBrandGoogle />}
      variant="filled"
      color="gray"
      onClick={handleSignIn}
      {...props}
    />
  );
};

export function FacebookButton(props: ButtonProps) {
  return (
    <Button
      leftSection={<IconBrandFacebookFilled />}
      style={(theme) => ({
        backgroundColor: "#4267B2",
      })}
      {...props}
    />
  );
}

export function DiscordButton(props: ButtonProps) {
  const handleSignIn = () => {
    void signIn("discord");
  };
  return (
    <Button
      className={classes.signinBtnDiscord}
      color={DISCORD_PRIMARY_COLOR}
      leftSection={<IconBrandDiscordFilled size="1.5rem" />}
      onClick={handleSignIn}
      {...props}
    />
  );
}

const SignInButton = () => {
  return (
    <>
      <GoogleButton>Mit Google fortfahren</GoogleButton>
      <DiscordButton>Mit Discord einloggen</DiscordButton>
    </>
  );
};

export default SignInButton;
