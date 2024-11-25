import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { ModalContainer } from "../../../../ModalContainer";
import { Typography } from "../../../../Typography";
import { useTranslation } from "react-i18next";
import { Checkbox, Separator } from "../../../../shared";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import build_info from "../../../../../build-info.json";
import QrCode from "react-qr-code";
import { useMemo, useState } from "react";
import { useGlobalSearchParams, usePathname } from "expo-router";
import { useTheme } from "@react-navigation/native";
import { borderRadius, spacing } from "../../../../../theme";
import { Input } from "../../../../shared";
import { Spacer } from "../../../../shared/Spacer";
import { getHumanReadableDuration } from "../../../../../utils";
import { useViewHistory } from "../../../../../hooks";
import { colors } from "../../../../../colors";
import { ROUTES } from "../../../../../types";
import TVFocusGuideHelper from "../../../../helpers/TVFocusGuideHelper";

interface ShareProps {
  onClose: () => void;
  titleKey: string;
}

const Share = ({ onClose, titleKey }: ShareProps) => {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const params = useGlobalSearchParams();
  const [isTimestampAdded, setIsTimestampAdded] = useState(false);
  const pathname = usePathname();
  const { getViewHistoryEntryByUuid } = useViewHistory();

  const addedTimestamp = useMemo(() => {
    return getViewHistoryEntryByUuid(params?.id as string)?.timestamp || 0;
  }, [params?.id]);

  const link = useMemo(() => {
    const paramsCopy = { ...params };
    delete paramsCopy.timestamp;
    return `${build_info.WEB_URL?.toLowerCase()}${pathname}?${new URLSearchParams(paramsCopy as Record<string, string>)}${isTimestampAdded ? `&timestamp=${addedTimestamp}` : ""}`;
  }, [isTimestampAdded, pathname, params, addedTimestamp]);

  const isTimestampShown = pathname === `/${ROUTES.VIDEO}`;

  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={styles.animatedContainer} pointerEvents="box-none">
      <ModalContainer onClose={onClose} title={t(titleKey)} containerStyle={styles.modalContainer}>
        <ScrollView>
          {isTimestampShown && (
            <>
              <TVFocusGuideHelper autoFocus style={styles.startAtContainer}>
                <View>
                  <Checkbox label={t("startAt")} checked={isTimestampAdded} onChange={setIsTimestampAdded} />
                </View>
                <Input
                  style={{ width: 96, ...(Platform.isTVOS ? { padding: 0 } : {}) }}
                  editable={false}
                  readOnly
                  value={getHumanReadableDuration(addedTimestamp * 1000)}
                />
              </TVFocusGuideHelper>
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
