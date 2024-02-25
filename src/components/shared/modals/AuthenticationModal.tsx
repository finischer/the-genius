import { Box, Center, Container, Flex, Stack, Text, TextInput, Title, useMantineTheme } from "@mantine/core";
import SignInButton from "../SignInButton/SignInButton";
import TheGeniusLogo from "../TheGeniusLogo";

const AuthenticationModal = () => {
  // const { showErrorNotification } = useNotification()
  // const [isLoggingIn, setIsLoggingIn] = useState(false)
  // const [type] = useToggle<"login" | "register">(['login', 'register']);
  // const { mutate: register, isLoading: isRegistering } = api.users.create.useMutation({
  //     onSuccess: () => {
  //         void signIn("credentials", {
  //             ...form.values,
  //             redirect: false
  //         })

  //     },
  //     onError: (e) => {
  //         const errorMessage = e.data?.zodError?.fieldErrors;
  //         const errorMessagesArray = errorMessage ? Object.values(errorMessage) : []

  //         if (errorMessagesArray.length > 0) {
  //             errorMessagesArray.forEach(messages => {
  //                 if (messages && messages[0]) {
  //                     showErrorNotification({
  //                         title: "Ein Fehler ist aufgetreten",
  //                         message: messages[0]
  //                     })
  //                 }
  //             })
  //         }
  //         else {
  //             showErrorNotification({
  //                 title: "Ein Fehler ist aufgetreten",
  //                 message: e.message ?? "Probiere es später nochmal"
  //             })
  //         }
  //     }
  // })

  // const form = useForm({
  //     initialValues: {
  //         name: "",
  //         email: "",
  //         password: "",
  //         rememberMe: false
  //     },

  //     validate: {
  //         email: isEmail("Ungültige E-Mail"),
  //     },
  // })

  // const handleSubmit = form.onSubmit(async (formValues) => {
  //     if (type === "login") {
  //         setIsLoggingIn(true)
  //         const res = await signIn("credentials", {
  //             ...formValues,
  //             redirect: false
  //         })

  //         if (!res?.ok) {
  //             showErrorNotification({
  //                 title: "Falsche Zugangsdaten",
  //                 message: res?.error ?? "Probiere es später nochmal"
  //             })
  //         }

  //         setIsLoggingIn(false)

  //     } else if (type === "register") {
  //         register(formValues)
  //     }

  // })

  return (
    <Box
      size={420}
      my={40}
    >
      <Stack align="center">
        <TheGeniusLogo
          height={200}
          width={200}
        />
        <Center>
          <Text
            variant="gradient"
            size="xl"
            fw="bold"
          >
            The Genius
          </Text>
        </Center>
        <Title order={2}>Willkommen zurück!</Title>
        <Flex
          direction="column"
          color="green"
          mt="md"
          gap="md"
        >
          {/* Auth Providers SignInButtons */}
          <SignInButton />
          {/* Input for Beta Access Key */}

          {/* <Text color="dimmed" size="sm" align="center" mt={5}>
                    {type === "login" ? "Noch keinen Account? " : "Du hast bereits einen Account? "}
                    <Anchor size="sm" component="button" onClick={() => toggle()}>
                        {type === "login" ? "Registriere dich hier" : "Log dich ein"}
                    </Anchor>
                    </Text>
                    
                    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
                    <form onSubmit={handleSubmit}>
                    {type === "register" &&
                    <TextInput
                    label="Username"
                    placeholder="Quizmaster9000"
                    required {...form.getInputProps("name")}
                                disabled={isRegistering}
                                />

                        }
                        <TextInput
                            label="E-Mail"
                            placeholder="you@mail.de"
                            required {...form.getInputProps("email")}
                            disabled={isRegistering}
                        />
                        <PasswordInput
                            label="Passwort"
                            placeholder="Dein starkes Passwort 👀"
                            required
                            mt="md"
                            disabled={isRegistering}
                            
                            {...form.getInputProps("password")} />
                            {type === "login" &&
                            <Group position="apart" mt="lg">
                                <Checkbox label="Remember me" disabled {...form.getInputProps("rememberMe", { type: "checkbox" })} />
                                <Anchor component="button" size="sm">
                                    Passwort vergessen?
                                </Anchor>
                            </Group>
                        }
                        <Button fullWidth mt="xl" type='submit' disabled={isRegistering} loading={isLoggingIn || isRegistering}
                        >
                        {type === "login" ? "Einloggen" : "Registrieren"}
                        </Button>
                    </form>
                  </Paper> */}
        </Flex>
      </Stack>
    </Box>
  );
};

export default AuthenticationModal;
