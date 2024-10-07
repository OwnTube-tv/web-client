import { FC } from "react";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { Link } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { ROUTES } from "../types";
import { useTranslation } from "react-i18next";
import { useColorSchemeContext, useFullScreenModalContext } from "../contexts";
import { StyleSheet, View } from "react-native";
import { Button, Separator } from "./shared";
import { spacing } from "../theme";
import { Spacer } from "./shared/Spacer";
import { useBreakpoints, useInstanceConfig } from "../hooks";
import { InstanceInfo } from "./InstanceInfo";
import { Settings } from "./VideoControlsOverlay/components/modals";
import { useNetInfo } from "@react-native-community/netinfo";

const SIDEBAR_ROUTES = [
  {
    nameKey: "home",
    icon: "Home",
    href: { pathname: "/" },
    routeName: "(home)/index",
  },
  {
    nameKey: "history",
    icon: "History",
    href: { pathname: `/${ROUTES.HISTORY}` },
    routeName: `(home)/${ROUTES.HISTORY}`,
    isAvailableOffline: true,
  },
  {
    nameKey: "channels",
    icon: "Channel",
    href: { pathname: `/${ROUTES.CHANNELS}` },
    routeName: `(home)/${ROUTES.CHANNELS}`,
  },
  {
    nameKey: "playlistsPageTitle",
    icon: "Playlist",
    href: { pathname: `/${ROUTES.PLAYLISTS}` },
    routeName: `(home)/${ROUTES.PLAYLISTS}`,
  },
  {
    nameKey: "categories",
    icon: "Category",
    href: { pathname: `/${ROUTES.CATEGORIES}` },
    routeName: `(home)/${ROUTES.CATEGORIES}`,
  },
];

interface SidebarProps extends DrawerContentComponentProps {
  backend?: string;
}

export const Sidebar: FC<SidebarProps> = ({ backend, ...navigationProps }) => {
  const { colors } = useTheme();
  const { scheme, toggleScheme } = useColorSchemeContext();
  const { t } = useTranslation();
  const isDarkMode = scheme === "dark";
  const breakpoints = useBreakpoints();
  const shouldExpand = breakpoints.isDesktop || breakpoints.isMobile;
  const { toggleModal, setContent } = useFullScreenModalContext();
  const { currentInstanceConfig } = useInstanceConfig();
  const { isConnected } = useNetInfo();

  const handleOpenSettings = () => {
    toggleModal(true);
    setContent(<Settings onClose={() => toggleModal(false)} />);
  };

  return (
    <DrawerContentScrollView
      {...navigationProps}
      style={[
        styles.container,
        {
          backgroundColor: colors.theme50,
          paddingHorizontal: shouldExpand ? spacing.md : spacing.sm,
          width: "100%",
        },
      ]}
    >
      {shouldExpand ? (
        <View style={styles.expandedInstanceInfo}>
          <View style={styles.header}>
            <InstanceInfo backend={backend} />
            {breakpoints.isMobile && (
              <Button style={styles.backButton} icon="Arrow-Left" onPress={navigationProps.navigation.toggleDrawer} />
            )}
          </View>
        </View>
      ) : (
        <InstanceInfo backend={backend} showText={false} />
      )}
      <View style={styles.routesContainer}>
        {SIDEBAR_ROUTES.filter(({ nameKey }) => {
          switch (nameKey) {
            case "history":
              return !currentInstanceConfig?.customizations?.menuHideHistoryButton;
            case "channels":
              return !currentInstanceConfig?.customizations?.menuHideChannelsButton;
            case "playlistsPageTitle":
              return !currentInstanceConfig?.customizations?.menuHidePlaylistsButton;
            case "categories":
              return !currentInstanceConfig?.customizations?.menuHideCategoriesButton;
            default:
              return true;
          }
        }).map(({ nameKey, icon, href, routeName, isAvailableOffline }) => {
          const isActive =
            navigationProps.state.index === navigationProps.state.routes.findIndex(({ name }) => name === routeName);
          const isDisabled = !isConnected && !isAvailableOffline;

          return (
            <Link href={{ ...href, params: { backend } }} key={routeName} asChild>
              <Button
                disabled={isDisabled}
                isActive={isActive}
                justifyContent="flex-start"
                icon={icon}
                text={shouldExpand ? t(nameKey) : undefined}
                style={styles.backButton}
              />
            </Link>
          );
        })}
      </View>
      <Spacer height={spacing.xs} />
      <View style={styles.separatorContainer}>
        <Separator />
      </View>
      <Button
        justifyContent="flex-start"
        onPress={toggleScheme}
        icon={isDarkMode ? "Light-mode" : "Dark-mode"}
        text={shouldExpand ? t(isDarkMode ? "lightMode" : "darkMode") : undefined}
      />
      <Button
        justifyContent="flex-start"
        onPress={handleOpenSettings}
        icon="Settings"
        text={shouldExpand ? t("settingsPageTitle") : undefined}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  backButton: { height: 36, paddingVertical: 6 },
  container: {
    paddingTop: 18,
  },
  expandedInstanceInfo: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    paddingBottom: spacing.lg,
    paddingLeft: spacing.xs,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.md,
    justifyContent: "space-between",
    width: "100%",
  },
  routesContainer: { gap: 4 },
  separatorContainer: { paddingVertical: spacing.sm },
});
