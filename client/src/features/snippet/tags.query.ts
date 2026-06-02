import { useQuery } from "@tanstack/react-query";
import { getUserTags } from "./tags.api";
import { tagQueryKey } from "./tags.constant";

export const useUserTagsQuery = () => {
  return useQuery({
    queryKey: [tagQueryKey.tags],
    queryFn: getUserTags,
    staleTime: 10 * 60 * 1000,
  });
};
