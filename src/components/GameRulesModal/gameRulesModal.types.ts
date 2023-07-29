import { type ModalProps } from "@mantine/core";

export interface IGameRulesModal extends ModalProps {
  gameName: string;
  rules: string;
}
