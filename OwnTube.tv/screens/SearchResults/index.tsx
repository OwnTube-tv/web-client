import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { SearchInput } from "../../components/SearchInput";
import { Screen } from "../../layouts";
import { ROUTES } from "../../types";
import { FlatList, Platform, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchQuery } from "../../api/queries/search";
import { Button, EmptyPage, ErrorPage, InfoFooter, Loader, Typography, VideoListItem } from "../../components";
import { useTranslation } from "react-i18next";
import { useTheme } from "@react-navigation/native";
import { Spacer } from "../../components/shared/Spacer";
import { spacing } from "../../theme";
import { Video, VideosSearchQuery } from "@peertube/peertube-types";
import { useAppConfigContext } from "../../contexts";
import { SEARCH_DEFAULTS } from "../../api/sharedConstants";
import { ErrorUnavailableLogo } from "../../components/Svg";
import { SearchSortControls } from "../../components/SearchSortControls";
import { useBreakpoints } from "../../hooks";
import TVFocusGuideHelper from "../../components/helpers/TVFocusGuideHelper";
import { TouchableOpacityProps } from "react-native-gesture-handler";

const InputFocusHelper: React.FC<PropsWithChildren<TouchableOpacityProps>> = ({ children, ...restProps }) => {
  if (Platform.isTV && Platform.OS === "android") {
    return (
      <TouchableOpacity hasTVPreferredFocus={false} activeOpacity={1} {...restProps}>
        {children}
      </TouchableOpacity>
    );
  }
  return children;
};

export const SearchResultsScreen = () => {
  const router = useRouter();
  const { currentInstanceConfig } = useAppConfigContext();
  const { t } = useTranslation();
  const breakpoints = useBreakpoints();
  const { colors } = useTheme();
  const { searchQuery, backend, sort = SEARCH_DEFAULTS.sort } = useLocalSearchParams<RootStackParams[ROUTES.SEARCH]>();
  const {
    fetchNextPage,
    data: searchResults,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isError,
    refetch,
    isRefetching,
  } = useSearchQuery({
    search: searchQuery || "",
    count: currentInstanceConfig?.customizations?.searchPageSize || SEARCH_DEFAULTS.count,
    sort: sort || SEARCH_DEFAULTS.sort,
  });
  const [inputValue, setInputValue] = useState("");
  const [isSortExpanded, setIsSortExpanded] = useState(false);
  const handleSubmit = () => {
    if (inputValue.trim().length === 0) {
      return;
    }

    router.setParams({ searchQuery: inputValue });
  };
  const renderItem = ({ item }: { item: Video }) => (
    <VideoListItem backend={backend} video={{ ...item, previewPath: `https://${backend}${item.previewPath}` }} />
  );
  const videos = useMemo(() => {
    return searchResults?.pages?.flatMap(({ data }) => data.flat());
  }, [searchResults]);

  useEffect(() => {
    setInputValue(searchQuery || "");
  }, [searchQuery]);

  useFocusEffect(
    useCallback(() => {
      return () => {
        setIsSortExpanded(false);
      };
    }, []),
  );

  const renderContent = () => {
    if (isError) {
      return (
        <ErrorPage
          title={t("failedToLoadVideoSection.search")}
          logo={<ErrorUnavailableLogo />}
          button={{ text: t("reload"), action: refetch }}
        />
      );
    }

    if (videos?.length === 0) {
      return <EmptyPage text={t("noResultsFound")} />;
    }

    return (
      <FlatList
        key={searchQuery}
        initialNumToRender={15}
        disableVirtualization
        data={videos || []}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <Spacer height={spacing.xl} />}
        contentInset={{ bottom: spacing.xl }}
        style={{ overflow: "visible" }}
        ListFooterComponent={
          hasNextPage ? (
            <View style={styles.showMoreContainer}>
              <Button contrast="low" text={t("showMore")} onPress={() => fetchNextPage()} />
              <View>{isFetchingNextPage && <Loader />}</View>
            </View>
          ) : (
            <Spacer height={spacing.xl} />
          )
        }
      />
    );
  };
  const setSort = (newSort: VideosSearchQuery["sort"]) => {
    router.setParams({ sort: newSort });
  };

  const inputFocusRef = useRef<TextInput | null>(null);

  return (
    <Screen
      style={{
        width: "100%",
        maxWidth: 900,
        padding: 0,
        paddingRight: breakpoints.isMobile ? spacing.sm : spacing.xl,
        paddingLeft: breakpoints.isMobile ? spacing.sm : spacing.xl,
        paddingTop: Platform.isTVOS ? spacing.xxxl : 0,
      }}
    >
      <Spacer height={spacing.xl} />
      <InputFocusHelper onFocus={() => inputFocusRef.current?.focus()}>
        <SearchInput
          ref={inputFocusRef}
          autoFocus={false}
          value={inputValue}
          setValue={setInputValue}
          style={styles.input}
          handleSubmit={handleSubmit}
        />
      </InputFocusHelper>
      <Spacer height={spacing.xl} />
      <TVFocusGuideHelper style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" }}>
        <View>
          <Typography color={colors.themeDesaturated500} fontSize="sizeMd" fontWeight="SemiBold">
            {t("nResultsFor", {
              resultsCount: isLoading
                ? t("loading")
                : !searchResults?.pages?.[0]?.total
                  ? t("noResults")
                  : searchResults?.pages?.[0]?.total,
            })}
          </Typography>
          <Spacer height={spacing.xs} />
          <Typography color={colors.theme900} fontSize="sizeXL" fontWeight="ExtraBold">
            {searchQuery}
          </Typography>
        </View>
        <Button
          onPress={() => setIsSortExpanded(!isSortExpanded)}
          contrast="low"
          icon="Sort"
          iconPosition="leading"
          text={t("sort")}
          hasTVPreferredFocus
        />
      </TVFocusGuideHelper>
      <SearchSortControls isExpanded={isSortExpanded} sort={sort} setSort={setSort} />
      <Spacer height={spacing.xxl} />
      {isLoading || isRefetching ? <Loader /> : renderContent()}
      <InfoFooter />
    </Screen>
  );
};

const styles = StyleSheet.create({
  input: { width: "100%" },
  showMoreContainer: { alignSelf: "flex-start", flexDirection: "row", gap: spacing.xl, marginVertical: spacing.xl },
});
