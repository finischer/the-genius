import type { ModalProps } from "@mantine/core";
import type { ContextModalProps } from "@mantine/modals";
import type { User } from "@prisma/client";

export interface IUserDetailsModalProps extends ContextModalProps<any> {
  user: User;
}
