import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../constants";
import { retry } from "../helpers";
import { UsersApiImpl } from "../usersApi";

export const useGetMyUserInfoQuery = () => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();

  return useQuery({
    queryKey: [QUERY_KEYS.myUserInfo, backend],
    queryFn: async () => {
      return await UsersApiImpl.getMyUserInfo(backend!);
    },
    enabled: false,
    retry,
  });
};

export const useGetSubscriptionByChannelQuery = (channelHandle: string, enabled: boolean) => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.INDEX]>();

  return useQuery({
    queryKey: [QUERY_KEYS.myChannelSubscription, backend, channelHandle],
    queryFn: async () => {
      return await UsersApiImpl.getSubscriptionByChannel(backend!, channelHandle);
    },
    enabled: !!channelHandle && enabled,
    retry: 1,
  });
};
