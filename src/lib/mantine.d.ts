import type { modals } from "~/components/shared/modals/modalComponents";

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}
