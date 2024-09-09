import { useQuery } from "@tanstack/react-query";
import { InstanceInformationApiImpl } from "../instance";
import { retry } from "../helpers";
import { InstanceSearchServiceImpl } from "../instanceSearchApi";

import { QUERY_KEYS } from "../constants";

export const useGetInstancesQuery = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.instances],
    queryFn: async () => {
      return await InstanceSearchServiceImpl.searchInstances();
    },
    refetchOnWindowFocus: false,
    select: ({ data }) => data,
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
    retry,
  });
};
