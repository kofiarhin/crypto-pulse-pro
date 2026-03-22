import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import { USER_PREFERENCES_QUERY_KEY } from "../queries/useUserPreferencesQuery";

export const useUpdatePreferencesMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ accessToken, payload }) =>
      userService.updatePreferences({ accessToken, payload }),
    onSuccess: (preferences) => {
      queryClient.setQueryData(USER_PREFERENCES_QUERY_KEY, preferences);
    },
  });
};
