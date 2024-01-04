import type { OpenContextModal } from "@mantine/modals/lib/context";
import ChangeRoleModal from "./ChangeRoleModal";
import PricingModal from "./PricingModal";
import UserDetailsModal from "./UserDetailsModal";
import { modals as modalsContext } from "@mantine/modals";

export const modals = {
  userDetails: UserDetailsModal,
  changeRole: ChangeRoleModal,
  pricing: PricingModal,
};

// export const pricingModalContextPayload: OpenContextModal<any> & { modal: "pricing" } = {
//   modal: "pricing",
//   size: "50vw",
//   innerProps: null,
// };

export const openPricingModal = () => {
  modalsContext.openContextModal({
    modal: "pricing",
    size: "50vw",
    innerProps: {},
  });
};
