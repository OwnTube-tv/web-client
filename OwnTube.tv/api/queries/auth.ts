import { useMutation, useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { RootStackParams } from "../../app/_layout";
import { ROUTES } from "../../types";
import { MUTATION_KEYS, QUERY_KEYS } from "../constants";
import { retry } from "../helpers";
import { AuthApiImpl } from "../authApi";
import { LoginRequestArgs } from "../models";

export const useGetLoginPrerequisitesQuery = () => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.SIGNIN]>();

  return useQuery({
    queryKey: [QUERY_KEYS.loginPrerequisites, backend],
    queryFn: async () => {
      return await AuthApiImpl.getLoginPrerequisites(backend!);
    },
    enabled: !!backend,
    staleTime: 0,
    retry,
  });
};

export const useLoginWithUsernameAndPasswordMutation = () => {
  const { backend } = useLocalSearchParams<RootStackParams[ROUTES.SIGNIN]>();

  return useMutation({
    mutationKey: [MUTATION_KEYS.login],
    mutationFn: async ({ loginPrerequisites, username, password, otp }: LoginRequestArgs) => {
      return await AuthApiImpl.login(
        backend!,
        { ...loginPrerequisites, username, password, grant_type: "password" },
        otp,
      );
    },
  });
};
