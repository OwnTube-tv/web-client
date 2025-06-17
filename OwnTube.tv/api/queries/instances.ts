import { useQueries, useQuery } from "@tanstack/react-query";
import { InstanceInformationApiImpl } from "../instance";
import { retry } from "../helpers";
import { InstanceSearchServiceImpl } from "../instanceSearchApi";

import { QUERY_KEYS, WRONG_SERVER_VERSION_STATUS_CODE } from "../constants";
import Toast from "react-native-toast-message";
import { OwnTubeError } from "../models";
import { useTranslation } from "react-i18next";

export const useGetInstancesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.instances],
    queryFn: async () => {
      return await InstanceSearchServiceImpl.searchInstances();
    },
    refetchOnWindowFocus: false,
    select: ({ data }) => data,
    staleTime: 0,
    retry,
  });
};

export const useGetInstanceInfoQuery = (backend?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.instance, backend],
    queryFn: async () => {
      return await InstanceInformationApiImpl.getInstanceInfo(backend!);
    },
    select: ({ instance }) => instance,
    enabled: !!backend,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry,
    gcTime: 1000 * 3600, // 1 day
    staleTime: 1000 * 3600, // 1 day
  });
};

export const useGetInstanceInfoCollectionQuery = (instances: string[]) => {
  return useQueries({
    queries: instances?.map((instance) => ({
      queryKey: [QUERY_KEYS.instance, instance],
      queryFn: async () => {
        const res = await InstanceInformationApiImpl.getInstanceInfo(instance);
        return { instance: { ...res.instance, hostname: instance } };
      },
      retry,
      refetchOnWindowFocus: false,
      staleTime: 0,
    })),
    combine: (result) => ({
      data: result.map(({ data }) => data?.instance),
      refetch: () => {
        result.forEach(({ refetch }) => refetch());
      },
    }),
  });
};

export const useGetInstanceServerConfigQuery = ({
  hostname,
  shouldValidate,
}: Partial<{
  hostname: string;
  shouldValidate: boolean;
}>) => {
  const { t } = useTranslation();

  return useQuery({
    queryKey: [QUERY_KEYS.instanceServerConfig, hostname],
    queryFn: async () => {
      if (shouldValidate) {
        Toast.show({ type: "info", text1: t("checkingInstance", { hostname }), autoHide: false });
      }

      const res = await InstanceInformationApiImpl.getInstanceConfig(hostname!);

      if (shouldValidate && !!res.serverVersion && Number(res.serverVersion[0]) < 5) {
        throw new OwnTubeError({
          message: t("incompatibleServerVersion", { serverVersion: res.serverVersion }),
          status: WRONG_SERVER_VERSION_STATUS_CODE,
        });
      }

      return res;
    },
    enabled: !!hostname,
    refetchOnWindowFocus: false,
    retry: false,
    staleTime: 0,
  });
};
