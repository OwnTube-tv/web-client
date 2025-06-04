import { StyleSheet, View } from "react-native";
import { SkeletonLoader } from "./SkeletonLoader";
import { spacing } from "../../theme";
import { Spacer } from "../shared/Spacer";

export const SignInFormLoader = () => {
  return (
    <View>
      <Spacer height={4} />
      <SkeletonLoader containerStyle={styles.heightXL} />
      <Spacer height={spacing.xxl} />
      <SkeletonLoader containerStyle={styles.height48} />
      <Spacer height={spacing.xl} />
      <SkeletonLoader containerStyle={styles.height48} />
      <Spacer height={spacing.xl} />
      <SkeletonLoader containerStyle={styles.height48} />
      <Spacer height={spacing.xl} />
      <SkeletonLoader containerStyle={styles.heightLg} />
      <Spacer height={spacing.xs} />
      <SkeletonLoader containerStyle={styles.heightLg} />
    </View>
  );
};

const styles = StyleSheet.create({
  height48: { height: 48 },
  heightLg: { height: spacing.lg },
  heightXL: { height: spacing.xl },
});
