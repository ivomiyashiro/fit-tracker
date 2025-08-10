import { useQueryClient } from "@tanstack/react-query";

export const useCache = <T>(queryKey: readonly string[]): T | undefined => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData(queryKey) as T | undefined;
};
