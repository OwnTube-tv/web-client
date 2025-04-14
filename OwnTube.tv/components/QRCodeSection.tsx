import { View, StyleSheet } from "react-native";
import QrCode from "react-qr-code";
import { colors } from "../colors";
import { borderRadius, spacing } from "../theme";

interface QRCodeSectionProps {
  link: string;
}

export const QRCodeSection = ({ link }: QRCodeSectionProps) => {
  return (
    <View accessible={false} style={styles.container}>
      <View style={styles.qrCodeContainer}>
        <QrCode value={link} size={224} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center" },
  qrCodeContainer: { backgroundColor: colors.white, borderRadius: borderRadius.radiusMd, padding: spacing.lg },
});
