import type { modals } from "~/compositions/modals/modalComponents";

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}
