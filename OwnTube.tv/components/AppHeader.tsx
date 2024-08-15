import { Pressable, StyleSheet, View } from "react-native";
import { spacing } from "../theme";
import { Link } from "expo-router";
import { ROUTES } from "../types";
import { IcoMoonIcon } from "./IcoMoonIcon";
import { useTheme } from "@react-navigation/native";
import { useColorSchemeContext } from "../contexts";
import { useBreakpoints } from "../hooks";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface AppHeaderProps {
  backend: string | null;
}

export const AppHeader = ({ backend }: AppHeaderProps) => {
  const { colors } = useTheme();
  const { toggleScheme, scheme } = useColorSchemeContext();
  const { isDesktop } = useBreakpoints();
  const { top } = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: isDesktop ? 20 : spacing.sm,
          marginTop: top,
          backgroundColor: colors.theme50,
        },
      ]}
    >
      <View />
      <View />
      <View style={[styles.controlsContainer, { gap: isDesktop ? spacing.sm : spacing.xl }]}>
        <Pressable onPress={toggleScheme} style={styles.button}>
          <IcoMoonIcon color={colors.theme950} name={scheme === "dark" ? "Light-mode" : "Dark-mode"} size={24} />
        </Pressable>
        <Link style={styles.button} href={{ pathname: ROUTES.SETTINGS, params: { backend, tab: "history" } }}>
          <IcoMoonIcon color={colors.theme950} name="Settings" size={24} />
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: { padding: 6 },
  container: {
    alignItems: "center",
    flexDirection: "row",
    height: 52,
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
    width: "100%",
  },
  controlsContainer: { flexDirection: "row" },
});
