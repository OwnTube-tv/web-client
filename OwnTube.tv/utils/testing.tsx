/* eslint-disable react/display-name */
import { PropsWithChildren } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const createQueryClientWrapper =
  () =>
  ({ children }: PropsWithChildren) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
  };
