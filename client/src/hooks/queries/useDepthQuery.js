import { useQuery } from "@tanstack/react-query";
import { marketService } from "../../services/marketService";

export const useDepthQuery = (symbol, options = {}) =>
  useQuery({
    queryKey: ["depth", symbol],
    queryFn: ({ signal }) => marketService.getDepth(symbol, signal),
    enabled: Boolean(symbol) && (options.enabled ?? true),
    refetchInterval: 8_000,
    retry: 1,
  });
