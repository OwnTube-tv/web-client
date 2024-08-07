import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { ModalContainer } from "../../../ModalContainer";
import { Typography } from "../../../Typography";
import { useTranslation } from "react-i18next";
import { Checkbox, Separator } from "../../../shared";
import { ScrollView, StyleSheet, View } from "react-native";
import build_info from "../../../../build-info.json";
import QrCode from "react-qr-code";
import { useMemo, useRef, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../../../app/_layout";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../../../../theme";
import { Input } from "../../../shared";
import * as Clipboard from "expo-clipboard";
import { Spacer } from "../../../shared/Spacer";
import { getHumanReadableDuration } from "../../../../utils";
import { useViewHistory } from "../../../../hooks";
import { colors } from "../../../../colors";

interface ShareProps {
  onClose: () => void;
}

export const Share = ({ onClose }: ShareProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { backend = "", id = "" } = useLocalSearchParams<RootStackParams["video"]>();
  const [copyButtonText, setCopyButtonText] = useState(t("copy"));
  const [isTimestampAdded, setIsTimestampAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { getViewHistoryEntryByUuid } = useViewHistory();

  const addedTimestamp = useMemo(() => {
    return getViewHistoryEntryByUuid(id)?.timestamp || 0;
  }, [id]);

  const link = useMemo(() => {
    return `${build_info.WEB_URL}/video?${new URLSearchParams({ id, backend })}${isTimestampAdded ? `&timestamp=${addedTimestamp}` : ""}`;
  }, [id, backend, isTimestampAdded]);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(link);
    setCopyButtonText(t("linkCopied"));
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopyButtonText(t("copy"));
    }, 3_000);
  };

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={styles.animatedContainer} pointerEvents="box-none">
      <ModalContainer onClose={onClose} title={t("shareVideo")} containerStyle={styles.modalContainer}>
        <ScrollView>
          <Input buttonText={copyButtonText} readOnly value={link} handleButtonPress={handleCopy} />
          <Spacer height={spacing.xl} />
          <View style={styles.startAtContainer}>
            <Checkbox label={t("startAt")} checked={isTimestampAdded} onChange={setIsTimestampAdded} />
            <Input
              style={{ width: 96 }}
              editable={false}
              readOnly={!isTimestampAdded}
              value={getHumanReadableDuration(addedTimestamp * 1000)}
            />
          </View>
          <Spacer height={spacing.xl} />
          <Separator />
          <Typography
            fontSize="sizeLg"
            fontWeight="SemiBold"
            color={colors.theme950}
            style={{ marginVertical: spacing.xl }}
          >
            {t("qrCode")}
          </Typography>
          <View accessible={false} style={{ alignItems: "center" }}>
            <View style={styles.qrCodeContainer}>
              <QrCode value={link} size={224} />
            </View>
          </View>
        </ScrollView>
      </ModalContainer>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  animatedContainer: { alignItems: "center", flex: 1, justifyContent: "center" },
  modalContainer: { maxHeight: "90%", maxWidth: "90%", width: 500 },
  qrCodeContainer: { backgroundColor: colors.white, borderRadius: borderRadius.radiusMd, padding: spacing.lg },
  startAtContainer: { flexDirection: "row", gap: spacing.xl },
});
