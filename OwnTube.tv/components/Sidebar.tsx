import React from "react";
import { FC } from "react";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { Link } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { ROUTES, STORAGE } from "../types";
import { useTranslation } from "react-i18next";
import { useAppConfigContext, useColorSchemeContext, useFullScreenModalContext } from "../contexts";
import { Platform, StyleSheet, View } from "react-native";
import { Button, Separator } from "./shared";
import { spacing } from "../theme";
import { Spacer } from "./shared/Spacer";
import { useBreakpoints, useInstanceConfig } from "../hooks";
import { InstanceInfo } from "./InstanceInfo";
import { Settings } from "./VideoControlsOverlay/components/modals";
import { useNetInfo } from "@react-native-community/netinfo";
import { writeToAsyncStorage } from "../utils";
import useLeaveInstancePermission from "../hooks/useLeaveInstancePermission";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { QrCodeLinkModal } from "./QRCodeLinkModal";

const SIDEBAR_ROUTES = [
  {
    nameKey: "home",
    icon: "Home",
    href: { pathname: "/home" },
    routeName: "(home)/home",
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
  const { isLeaveInstanceAllowed } = useLeaveInstancePermission(navigationProps);
  const { primaryBackend } = useAppConfigContext();
  const safeArea = useSafeAreaInsets();

  const isLeaveInstanceShown =
    !primaryBackend && isLeaveInstanceAllowed && !currentInstanceConfig?.customizations?.menuHideLeaveButton;

  const handleOpenSettings = () => {
    toggleModal(true);
    setContent(<Settings onClose={() => toggleModal(false)} />);
  };

  const handleLeaveInstance = () => {
    writeToAsyncStorage(STORAGE.DATASOURCE, "").then(() => {
      navigationProps.navigation.navigate(`(home)/${ROUTES.INDEX}`);
    });
  };

  return (
    <DrawerContentScrollView
      {...navigationProps}
      contentContainerStyle={{
        padding: 0,
        paddingTop: safeArea.top,
      }}
      style={[
        styles.container,
        {
          backgroundColor: colors.theme50,
          paddingHorizontal: shouldExpand ? spacing.md : ["ios", "android"].includes(Platform.OS) ? 0 : spacing.sm,
          width: "100%",
          paddingTop: breakpoints.isDesktop ? 18 : undefined,
        },
      ]}
    >
      {shouldExpand ? (
        <View style={styles.expandedInstanceInfo}>
          <InstanceInfo backend={backend} />
          {breakpoints.isMobile && (
            <Button style={styles.button} icon="Arrow-Left" onPress={navigationProps.navigation.toggleDrawer} />
          )}
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
                style={{ ...styles.button, ...styles.paddingHHelper }}
              />
            </Link>
          );
        })}
      </View>
      <Spacer height={spacing.xs} />
      <View style={styles.separatorContainer}>
        <Separator />
      </View>
      {Number(currentInstanceConfig?.customizations?.menuExternalLinks?.length) > 0 && (
        <>
          {currentInstanceConfig?.customizations?.menuExternalLinks?.map(({ label, url }) => (
            <React.Fragment key={url}>
              {Platform.isTV ? (
                <Button
                  onPress={() => {
                    toggleModal(true);
                    setContent(<QrCodeLinkModal link={url} />);
                  }}
                  justifyContent="flex-start"
                  icon={"External-Link"}
                  text={label}
                  style={{ ...styles.button, ...styles.paddingHHelper, width: "100%" }}
                />
              ) : (
                <Link target="_blank" rel="noreferrer noopener" href={url} asChild={Platform.OS !== "web"}>
                  <Button
                    justifyContent="flex-start"
                    icon={"External-Link"}
                    text={shouldExpand ? label : undefined}
                    style={{ ...styles.button, ...styles.paddingHHelper, width: "100%" }}
                  />
                </Link>
              )}
            </React.Fragment>
          ))}
          <View style={styles.separatorContainer}>
            <Separator />
          </View>
        </>
      )}
      <View style={styles.routesContainer}>
        <Button
          justifyContent="flex-start"
          onPress={toggleScheme}
          icon={isDarkMode ? "Light-mode" : "Dark-mode"}
          text={shouldExpand ? t(isDarkMode ? "lightMode" : "darkMode") : undefined}
          style={styles.paddingHHelper}
        />
        <Button
          justifyContent="flex-start"
          onPress={handleOpenSettings}
          icon="Settings"
          text={shouldExpand ? t("settingsPageTitle") : undefined}
          style={styles.paddingHHelper}
        />
        {isLeaveInstanceShown && (
          <Button
            justifyContent="flex-start"
            onPress={handleLeaveInstance}
            contrast="none"
            icon="Exit"
            text={shouldExpand ? t("leaveSite") : undefined}
            style={styles.paddingHHelper}
          />
        )}
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 48,
    paddingVertical: 6,
  },
  container: {
    paddingTop: 8,
  },
  expandedInstanceInfo: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.sm,
    justifyContent: "space-between",
    paddingBottom: spacing.lg,
    paddingLeft: spacing.xs,
  },
  paddingHHelper: {
    height: 48,
    paddingHorizontal: ["ios", "android"].includes(Platform.OS) ? 8 : undefined,
  },
  routesContainer: { gap: 4 },
  separatorContainer: { paddingVertical: spacing.sm },
});
