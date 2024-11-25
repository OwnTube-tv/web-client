import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { ModalContainer } from "../../../../ModalContainer";
import { Typography } from "../../../../Typography";
import { useTranslation } from "react-i18next";
import { Checkbox, Separator } from "../../../../shared";
import { ScrollView, StyleSheet, View } from "react-native";
import build_info from "../../../../../build-info.json";
import QrCode from "react-qr-code";
import { useMemo, useRef, useState } from "react";
import { useGlobalSearchParams, usePathname } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../../../../../theme";
import { Input } from "../../../../shared";
import * as Clipboard from "expo-clipboard";
import { Spacer } from "../../../../shared/Spacer";
import { getHumanReadableDuration } from "../../../../../utils";
import { useViewHistory } from "../../../../../hooks";
import { colors } from "../../../../../colors";
import { ROUTES } from "../../../../../types";

interface ShareProps {
  onClose: () => void;
  titleKey: string;
}

const Share = ({ onClose, titleKey }: ShareProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const params = useGlobalSearchParams();
  const [copyButtonText, setCopyButtonText] = useState(t("copy"));
  const [isTimestampAdded, setIsTimestampAdded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const { getViewHistoryEntryByUuid } = useViewHistory();
  const pathname = usePathname();

  const addedTimestamp = useMemo(() => {
    return getViewHistoryEntryByUuid(params?.id as string)?.timestamp || 0;
  }, [params?.id]);

  const link = useMemo(() => {
    const paramsCopy = { ...params };
    delete paramsCopy.timestamp;
    return `${build_info.WEB_URL?.toLowerCase()}${pathname}?${new URLSearchParams(paramsCopy as Record<string, string>)}${isTimestampAdded ? `&timestamp=${addedTimestamp}` : ""}`;
  }, [isTimestampAdded, pathname, params, addedTimestamp]);

  const isTimestampShown = pathname === `/${ROUTES.VIDEO}`;

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
      <ModalContainer onClose={onClose} title={t(titleKey)} containerStyle={styles.modalContainer}>
        <ScrollView>
          <Input buttonText={copyButtonText} readOnly value={link} handleButtonPress={handleCopy} />
          <Spacer height={spacing.xl} />
          {isTimestampShown && (
            <>
              <View style={styles.startAtContainer}>
                <View>
                  <Checkbox label={t("startAt")} checked={isTimestampAdded} onChange={setIsTimestampAdded} />
                </View>
                <Input
                  style={{ width: 96 }}
                  editable={false}
                  readOnly={!isTimestampAdded}
                  value={getHumanReadableDuration(addedTimestamp * 1000)}
                />
              </View>
              <Spacer height={spacing.xl} />
            </>
          )}
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
  startAtContainer: { alignItems: "center", flexDirection: "row", gap: spacing.xl },
});

export default Share;
