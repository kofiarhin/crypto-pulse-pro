import { useQuery } from "@tanstack/react-query";
import { marketService } from "../../services/marketService";

export const useSummaryQuery = (symbol, options = {}) =>
  useQuery({
    queryKey: ["summary", symbol],
    queryFn: ({ signal }) => marketService.getSummary(symbol, signal),
    enabled: Boolean(symbol) && (options.enabled ?? true),
    refetchInterval: 10_000,
    retry: 1,
  });
