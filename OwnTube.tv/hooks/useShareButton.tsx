import { usePathname } from "expo-router";
import { useFullScreenModalContext } from "../contexts";
import Share from "../components/VideoControlsOverlay/components/modals/Share";
import { SHAREABLE_ROUTE_ANALYTICS_EVENT_TYPES, SHAREABLE_ROUTE_MODAL_TITLES } from "../navigation/constants";
import { useCustomDiagnosticsEvents } from "../diagnostics/useCustomDiagnosticEvents";
import { CustomPostHogEvents } from "../diagnostics/constants";

export const useShareButton = () => {
  const pathname = usePathname();
  const { captureDiagnosticsEvent } = useCustomDiagnosticsEvents();
  const { toggleModal, setContent } = useFullScreenModalContext();
  const handleToggleShareModal = ({
    staticHeaderKey,
    staticLink,
  }: {
    staticHeaderKey?: string;
    staticLink?: string;
  }) => {
    toggleModal(true);
    setContent(
      <Share
        staticLink={staticLink}
        titleKey={staticHeaderKey || SHAREABLE_ROUTE_MODAL_TITLES[pathname]}
        onClose={() => toggleModal(false)}
      />,
    );

    const routeAnalyticsEventType = SHAREABLE_ROUTE_ANALYTICS_EVENT_TYPES[pathname];

    if (routeAnalyticsEventType) {
      captureDiagnosticsEvent(CustomPostHogEvents.Share, { type: routeAnalyticsEventType });
    }
  };
  const isRouteShareable = Object.keys(SHAREABLE_ROUTE_MODAL_TITLES).includes(pathname);

  return { handleToggleShareModal, isRouteShareable };
};
