import { useBreakpoints, useViewHistory, ViewHistoryEntry } from "../hooks";
import { SectionList, StyleSheet, View } from "react-native";
import { Loader } from "./Loader";
import { Spacer } from "./shared/Spacer";
import { Typography } from "./Typography";
import { VideoListItem } from "./VideoListItem";
import { useTranslation } from "react-i18next";
import { useCallback, useMemo } from "react";
import { Screen } from "../layouts";
import { spacing } from "../theme";
import { Button } from "./shared";
import { useTheme } from "@react-navigation/native";
import { groupHistoryEntriesByTime } from "../utils";
import { ModalContainer } from "./ModalContainer";
import Animated, { SlideInUp, SlideOutUp } from "react-native-reanimated";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../app/_layout";
import { ROUTES } from "../types";
import { useAppConfigContext, useFullScreenModalContext } from "../contexts";
import { EmptyPage } from "./EmptyPage";
import { InfoFooter } from "./InfoFooter";

export const ViewHistory = () => {
  const { t } = useTranslation();
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.HISTORY]>();
  const {
    viewHistory = [],
    clearInstanceHistory,
    isFetching,
    deleteVideoFromHistory,
  } = useViewHistory({ backendToFilter: backend });
  const { isMobile } = useBreakpoints();
  const { colors } = useTheme();
  const { currentInstanceConfig } = useAppConfigContext();

  const { toggleModal, setContent } = useFullScreenModalContext();

  const handleClearConfirmation = () => {
    toggleModal(true);
    setContent(
      <Animated.View
        entering={SlideInUp}
        exiting={SlideOutUp}
        style={styles.clearModalWrapper}
        pointerEvents="box-none"
      >
        <ModalContainer
          onClose={() => toggleModal(false)}
          title={t("clearSiteHistoryQuestion", {
            appName: currentInstanceConfig?.customizations?.pageTitle ?? backend,
          })}
        >
          <View style={styles.modalContentContainer}>
            <Button onPress={() => toggleModal(false)} text={t("cancel")} />
            <Button
              icon="Trash"
              contrast="high"
              text={t("clearAllHistory")}
              onPress={() => {
                toggleModal(false);
                clearInstanceHistory(backend);
              }}
            />
          </View>
        </ModalContainer>
      </Animated.View>,
    );
  };

  const sections = useMemo(() => {
    return groupHistoryEntriesByTime(viewHistory);
  }, [viewHistory]);

  const renderItem = useCallback(
    ({ item }: { item: ViewHistoryEntry }) => (
      <VideoListItem
        handleDeleteFromHistory={() => deleteVideoFromHistory(item.uuid)}
        video={item}
        backend={item.backend}
        timestamp={item.timestamp}
        lastViewedAt={item.lastViewedAt}
      />
    ),
    [deleteVideoFromHistory],
  );

  if (!viewHistory?.length && !isFetching) {
    return <EmptyPage text={t("viewHistoryEmpty")} />;
  }

  if (isFetching) {
    return <Loader />;
  }

  return (
    <Screen
      style={{
        paddingHorizontal: isMobile ? spacing.sm : spacing.xl,
        ...styles.screenContainer,
      }}
    >
      <View style={styles.headerContainer}>
        <Typography
          fontSize={isMobile ? "sizeXL" : "sizeXXL"}
          fontWeight="ExtraBold"
          color={colors.theme900}
          style={styles.header}
        >
          {t("yourWatchHistory")}
        </Typography>
        <Button
          icon="Trash"
          onPress={handleClearConfirmation}
          text={t("clearSiteHistory", {
            appName: currentInstanceConfig?.customizations?.pageTitle ?? backend,
          })}
        />
      </View>
      <Spacer height={spacing.xl} />
      <SectionList
        style={styles.sectionListContainer}
        renderItem={renderItem}
        sections={sections}
        renderSectionHeader={({ section: { titleKey } }) => (
          <Typography style={styles.sectionHeader} color={colors.theme900} fontWeight="Bold" fontSize="sizeLg">
            {t(titleKey)}
          </Typography>
        )}
        ItemSeparatorComponent={() => <Spacer height={spacing.xl} />}
        renderSectionFooter={() => <Spacer height={spacing.xxl} />}
      />
      <InfoFooter />
    </Screen>
  );
};

const styles = StyleSheet.create({
  clearModalWrapper: { alignItems: "center", flex: 1, justifyContent: "center" },
  header: { marginBottom: 16 },
  headerContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  modalContentContainer: { flexDirection: "row", gap: spacing.lg, justifyContent: "flex-end" },
  screenContainer: { maxWidth: 900, paddingVertical: spacing.xl },
  sectionHeader: { paddingBottom: spacing.xl },
  sectionListContainer: { overflow: "visible", width: "100%" },
});
