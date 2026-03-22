import { useQuery } from "@tanstack/react-query";
import { marketService } from "../../services/marketService";

export const useTradesQuery = (symbol, options = {}) =>
  useQuery({
    queryKey: ["trades", symbol],
    queryFn: ({ signal }) => marketService.getTrades(symbol, signal),
    enabled: Boolean(symbol) && (options.enabled ?? true),
    refetchInterval: 8_000,
    retry: 1,
  });
