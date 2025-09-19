import { Platform, StyleSheet, View } from "react-native";
import { spacing } from "../theme";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "./shared";
import { InstanceInfo } from "./InstanceInfo";
import { DrawerHeaderProps } from "@react-navigation/drawer";
import { useShareButton } from "../hooks";
import { useFullScreenModalContext } from "../contexts";
import { SearchPopup } from "./SearchPopup";
import { usePathname } from "expo-router";
import { ROUTES } from "../types";

interface AppHeaderProps extends DrawerHeaderProps {
  backend?: string;
}

export const AppHeader = ({ backend, ...props }: AppHeaderProps) => {
  const { colors } = useTheme();
  const pathname = usePathname();
  const { top } = useSafeAreaInsets();
  const { isRouteShareable, handleToggleShareModal } = useShareButton();
  const { toggleModal, setContent } = useFullScreenModalContext();
  const disableSearch = pathname === `/${ROUTES.SEARCH}`;

  const handleSearchPress = () => {
    toggleModal(true);
    setContent(<SearchPopup backend={backend} handleClose={() => toggleModal(false)} />);
  };

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: Platform.isTV ? 0 : top,
          backgroundColor: colors.theme50,
        },
      ]}
    >
      <View style={styles.requiredElementsContainer}>
        <Button style={styles.menuBtn} onPress={props.navigation.toggleDrawer} icon="Menu" contrast="low" />
        <InstanceInfo backend={backend} />
      </View>
      <View style={{ flexDirection: "row", gap: spacing.sm }}>
        {!disableSearch && <Button style={styles.menuBtn} onPress={handleSearchPress} icon="Search" contrast="low" />}
        {isRouteShareable && (
          <Button style={styles.menuBtn} onPress={() => handleToggleShareModal({})} icon="Share" contrast="low" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flexDirection: "row",
    gap: spacing.xl,
    justifyContent: "space-between",
    padding: spacing.sm,
  },
  menuBtn: { height: 48, paddingVertical: 6 },
  requiredElementsContainer: { flexDirection: "row", flex: 1, gap: spacing.xl },
});
