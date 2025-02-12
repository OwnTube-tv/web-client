import { usePathname } from "expo-router";
import { useFullScreenModalContext } from "../contexts";
import Share from "../components/VideoControlsOverlay/components/modals/Share";
import { SHAREABLE_ROUTE_MODAL_TITLES } from "../navigation/constants";

export const useShareButton = () => {
  const pathname = usePathname();
  const { toggleModal, setContent } = useFullScreenModalContext();
  const handleToggleShareModal = () => {
    toggleModal(true);
    setContent(<Share titleKey={SHAREABLE_ROUTE_MODAL_TITLES[pathname]} onClose={() => toggleModal(false)} />);
  };
  const isRouteShareable = Object.keys(SHAREABLE_ROUTE_MODAL_TITLES).includes(pathname);

  return { handleToggleShareModal, isRouteShareable };
};
