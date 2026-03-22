import { useQuery } from "@tanstack/react-query";
import { marketService } from "../../services/marketService";

export const useKlinesQuery = (symbol, interval, options = {}) =>
  useQuery({
    queryKey: ["klines", symbol, interval],
    queryFn: ({ signal }) => marketService.getKlines(symbol, interval, signal),
    enabled: Boolean(symbol && interval) && (options.enabled ?? true),
    refetchInterval: 30_000,
    retry: 1,
  });
