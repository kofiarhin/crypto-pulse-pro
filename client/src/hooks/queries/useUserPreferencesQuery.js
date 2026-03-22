import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/userService";

export const USER_PREFERENCES_QUERY_KEY = ["user", "preferences"];

export const useUserPreferencesQuery = ({ accessToken, enabled }) =>
  useQuery({
    queryKey: USER_PREFERENCES_QUERY_KEY,
    queryFn: () => userService.getPreferences(accessToken),
    enabled,
    retry: 1,
  });
