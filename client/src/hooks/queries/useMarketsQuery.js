import { useQuery } from "@tanstack/react-query";
import { marketService } from "../../services/marketService";

export const useMarketsQuery = (limit = 30) =>
  useQuery({
    queryKey: ["markets", limit],
    queryFn: ({ signal }) => marketService.getMarkets(limit, signal),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
