import { FC } from "react";
import { DrawerContentComponentProps, DrawerContentScrollView } from "@react-navigation/drawer";
import { Link } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { ROUTES } from "../types";
import { useTranslation } from "react-i18next";
import { useColorSchemeContext } from "../contexts";
import { StyleSheet, View } from "react-native";
import { Button, Separator } from "./shared";
import { spacing } from "../theme";
import { Spacer } from "./shared/Spacer";
import { useBreakpoints } from "../hooks";
import { CLOSED_DRAWER_WIDTH, OPEN_DRAWER_WIDTH } from "../app/_layout";
import { InstanceInfo } from "./InstanceInfo";

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
    href: { pathname: ROUTES.SETTINGS, params: { tab: "history" } },
    routeName: `(home)/${ROUTES.SETTINGS}`,
  },
  {
    nameKey: "channels",
    icon: "Channel",
    href: { pathname: ROUTES.CHANNELS },
    routeName: `(home)/${ROUTES.CHANNELS}`,
  },
  {
    nameKey: "categories",
    icon: "Category",
    href: { pathname: ROUTES.CATEGORIES },
    routeName: `(home)/${ROUTES.CATEGORIES}`,
  },
];

interface SidebarProps extends DrawerContentComponentProps {
  handleOpenSettings: () => void;
  backend?: string;
}

export const Sidebar: FC<SidebarProps> = ({ handleOpenSettings, backend, ...navigationProps }) => {
  const { colors } = useTheme();
  const { scheme, toggleScheme } = useColorSchemeContext();
  const { t } = useTranslation();
  const isDarkMode = scheme === "dark";
  const breakpoints = useBreakpoints();
  const shouldExpand = breakpoints.isDesktop || breakpoints.isMobile;

  return (
    <DrawerContentScrollView
      {...navigationProps}
      style={[
        styles.container,
        {
          width: !shouldExpand ? CLOSED_DRAWER_WIDTH : OPEN_DRAWER_WIDTH,
          backgroundColor: colors.theme50,
          paddingHorizontal: shouldExpand ? spacing.md : spacing.sm,
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
        {SIDEBAR_ROUTES.map(({ nameKey, icon, href, routeName }) => {
          const isActive =
            navigationProps.state.index === navigationProps.state.routes.findIndex(({ name }) => name === routeName);

          return (
            <Link href={{ ...href, params: { ...href.params, backend } }} key={routeName} asChild>
              <Button
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
