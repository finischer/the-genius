import { Button, Modal, TextInput, type ModalProps } from "@mantine/core";
import { useForm } from "@mantine/form";
import { UserRole } from "~/generated/prisma/enums";
import { useSession } from "next-auth/react";
import { type FC } from "react";
import SyncedRoomProvider from "~/context/SyncedRoomContext";
import { useUser } from "~/hooks/useUser";
import RoomUI from "~/compositions/room/RoomUI";

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;

// Defined at module level: a component declared inside RoomPage gets a new
// identity on every render, which remounts the modal and clears the form.
interface IUserInputModalProps extends ModalProps {
  user: ReturnType<typeof useUser>["user"];
  setUser: ReturnType<typeof useUser>["setUser"];
}

const UserInputModal: FC<IUserInputModalProps> = ({
  user,
  setUser,
  ...props
}) => {
  const form = useForm({
    initialValues: { username: "" },
    validate: {
      username: (value) => {
        if (value.length < MIN_USERNAME_LENGTH) {
          return `Username muss mindestens ${MIN_USERNAME_LENGTH} Zeichen lang sein`;
        }

        if (value.length > MAX_USERNAME_LENGTH) {
          return `Username darf maximal ${MAX_USERNAME_LENGTH} Zeichen lang sein`;
        }

        return null;
      }
    }
  });

  return (
    <Modal {...props}>
      <form
        onSubmit={form.onSubmit((values) =>
          setUser({
            ...user,
            username: values.username,
            role: UserRole.USER
          })
        )}
      >
        <TextInput
          withAsterisk
          label="Username"
          {...form.getInputProps("username")}
        />
        <Button type="submit" mt="md">
          Beitreten
        </Button>
      </form>
    </Modal>
  );
};

const RoomPage = () => {
  const { user, setUser } = useUser();
  const { status } = useSession();

  const showUserInputModal =
    user.role === UserRole.GUEST && status !== "loading";

  return (
    <SyncedRoomProvider>
      <UserInputModal
        user={user}
        setUser={setUser}
        opened={showUserInputModal}
        onClose={() => console.log("Close")}
        title="Wie willst du genannt werden?"
        withCloseButton={false}
      />
      <RoomUI />
    </SyncedRoomProvider>
  );
};

export default RoomPage;
