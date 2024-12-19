import { getErrorTextKeys, QUERY_KEYS, useGetChannelsCollectionQuery, useGetChannelsQuery } from "../../api";
import { Screen } from "../../layouts";
import { spacing } from "../../theme";
import { EmptyPage, ErrorPage, InfoFooter, Loader, VideoGrid } from "../../components";
import { StyleSheet } from "react-native";
import { useMemo } from "react";
import { getAvailableVidsString } from "../../utils";
import { ROUTES } from "../../types";
import { useTranslation } from "react-i18next";
import { useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { ErrorForbiddenLogo } from "../../components/Svg";

export const ChannelsScreen = () => {
  const { backend } = useLocalSearchParams();
  const queryClient = useQueryClient();
  const {
    data: channels,
    isFetching: isFetchingChannels,
    isError: isChannelsError,
    error: channelsError,
  } = useGetChannelsQuery({ enabled: true });
  const { t } = useTranslation();
  const {
    data: channelSections,
    isFetching: isFetchingChannelsCollection,
    isError: isChannelsCollectionError,
  } = useGetChannelsCollectionQuery(channels?.map(({ name }) => name));
  const isError = isChannelsError || isChannelsCollectionError;
  const isFetching = isFetchingChannels || isFetchingChannelsCollection;
  const retry = async () => {
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.channels] });
    await queryClient.refetchQueries({ queryKey: [QUERY_KEYS.channelsCollection] });
  };

  const renderScreenContent = useMemo(() => {
    if (isFetching) {
      return <Loader />;
    }

    if (isError) {
      const { title, description } = getErrorTextKeys(channelsError);

      return (
        <ErrorPage
          title={t(title)}
          description={t(description)}
          logo={<ErrorForbiddenLogo />}
          button={{ text: t("tryAgain"), action: retry }}
        />
      );
    }

    return channelSections?.map(({ data, isFetching, refetch }) => {
      const channelInfoSection = channels?.find(({ name }) => name === data?.id);

      return (
        <>
          <VideoGrid
            isLoading={isFetching}
            refetch={refetch}
            headerLink={{
              text: t("visitChannel") + getAvailableVidsString(data?.total),
              href: { pathname: `/${ROUTES.CHANNEL}`, params: { backend, channel: channelInfoSection?.name } },
            }}
            variant="channel"
            key={data?.id}
            title={channelInfoSection?.displayName}
            data={data?.data}
            channelLogoUri={channelInfoSection?.avatars?.[0]?.path}
          />
          <InfoFooter />
        </>
      );
    });
  }, [isFetching, isFetchingChannels, channelSections, channels, backend]);

  if (!channelSections.length) {
    return <EmptyPage text={t("noChannelsAvailable")} />;
  }

  return <Screen style={styles.screenContainer}>{renderScreenContent}</Screen>;
};

const styles = StyleSheet.create({
  screenContainer: {
    alignItems: "center",
    flex: 1,
    gap: spacing.xl,
    justifyContent: "center",
    padding: 0,
  },
});
