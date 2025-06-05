import { StyleSheet, ViewStyle } from "react-native";
import { borderRadius, spacing } from "../theme";
import { FC, PropsWithChildren } from "react";
import { useTheme } from "@react-navigation/native";
import { Typography } from "./Typography";
import { Button } from "./shared";
import { colors } from "../colors";
import TVFocusGuideHelper from "./helpers/TVFocusGuideHelper";

interface ModalContainerProps {
  title: string;
  onClose: () => void;
  containerStyle?: ViewStyle;
}

export const ModalContainer: FC<PropsWithChildren<ModalContainerProps>> = ({
  title,
  onClose,
  containerStyle,
  children,
}) => {
  const { colors } = useTheme();

  return (
    <TVFocusGuideHelper
      trapFocusDown
      trapFocusUp
      trapFocusLeft
      trapFocusRight
      style={[styles.container, { backgroundColor: colors.theme50 }, containerStyle]}
    >
      <TVFocusGuideHelper autoFocus style={styles.header}>
        <Typography fontSize="sizeLg" fontWeight="SemiBold" color={colors.theme950} style={styles.headerText}>
          {title}
        </Typography>
        <Button hasTVPreferredFocus style={styles.button} onPress={onClose} icon="Close" />
      </TVFocusGuideHelper>
      {children}
    </TVFocusGuideHelper>
  );
};

const styles = StyleSheet.create({
  button: { paddingHorizontal: 6, paddingVertical: 6 },
  container: {
    borderRadius: borderRadius.radiusMd,
    elevation: 10,
    padding: spacing.xl,
    shadowColor: colors.black20percent,
    shadowOffset: { width: 0, height: spacing.sm },
    shadowRadius: spacing.xl,
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.lg,
  },
  headerText: { alignSelf: "center" },
});
