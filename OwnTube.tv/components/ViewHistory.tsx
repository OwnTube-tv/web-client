import { useBreakpoints, useViewHistory, ViewHistoryEntry } from "../hooks";
import { SectionList, StyleSheet, View } from "react-native";
import { Loader } from "./Loader";
import { Spacer } from "./shared/Spacer";
import { Typography } from "./Typography";
import { ViewHistoryListItem } from "./ViewHistoryListItem";
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
import { useFullScreenModalContext } from "../contexts";

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

  const { toggleModal, setContent } = useFullScreenModalContext();

  const handleClearConfirmation = () => {
    toggleModal(true);
    setContent(
      <Animated.View
        entering={SlideInUp}
        exiting={SlideOutUp}
        style={{ alignItems: "center", flex: 1, justifyContent: "center" }}
        pointerEvents="box-none"
      >
        <ModalContainer
          containerStyle={{ maxWidth: 328 }}
          onClose={() => toggleModal(false)}
          title={t("clearSiteHistoryQuestion")}
        >
          <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: spacing.lg }}>
            <Button onPress={() => toggleModal(false)} text={t("cancel")} />
            <Button
              icon="Trash"
              contrast="high"
              text="Clear all history"
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
      <ViewHistoryListItem handleDeleteFromHistory={() => deleteVideoFromHistory(item.uuid)} video={item} />
    ),
    [deleteVideoFromHistory],
  );

  if (!viewHistory?.length && !isFetching) {
    return <Typography>{t("viewHistoryEmpty")}</Typography>;
  }

  if (isFetching) {
    return <Loader />;
  }

  return (
    <>
      <Screen style={{ paddingHorizontal: isMobile ? spacing.sm : spacing.xl, ...styles.screenContainer }}>
        <View style={styles.headerContainer}>
          <Typography
            fontSize={isMobile ? "sizeXL" : "sizeXXL"}
            fontWeight="ExtraBold"
            color={colors.theme900}
            style={styles.header}
          >
            {t("yourWatchHistory")}
          </Typography>
          <Button icon="Trash" onPress={handleClearConfirmation} text={t("clearSiteHistory")} />
        </View>
        <Spacer height={spacing.xl} />
        <SectionList
          style={styles.sectionListContainer}
          renderItem={renderItem}
          sections={sections}
          renderSectionHeader={({ section: { title } }) => (
            <Typography style={styles.sectionHeader} color={colors.theme900} fontWeight="Bold" fontSize="sizeLg">
              {title}
            </Typography>
          )}
          ItemSeparatorComponent={() => <Spacer height={spacing.xl} />}
          renderSectionFooter={() => <Spacer height={spacing.xxl} />}
        />
      </Screen>
    </>
  );
};

const styles = StyleSheet.create({
  header: { marginBottom: 16 },
  headerContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",
  },
  screenContainer: { maxWidth: 900, paddingVertical: spacing.xl },
  sectionHeader: { paddingBottom: spacing.xl },
  sectionListContainer: { width: "100%" },
});
