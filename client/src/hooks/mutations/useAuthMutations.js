import { useMutation } from "@tanstack/react-query";
import { useDispatch } from "react-redux";
import {
  clearAuth,
  setAuthError,
  setAuthLoading,
  setCredentials,
} from "../../features/auth/authSlice";
import { extractApiError } from "../../lib/apiClient";
import { authService } from "../../services/authService";

export const useLoginMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.login,
    onMutate: () => {
      dispatch(setAuthLoading());
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
    onError: (error) => {
      dispatch(setAuthError(extractApiError(error)));
    },
  });
};

export const useRegisterMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.register,
    onMutate: () => {
      dispatch(setAuthLoading());
    },
    onSuccess: (data) => {
      dispatch(setCredentials(data));
    },
    onError: (error) => {
      dispatch(setAuthError(extractApiError(error)));
    },
  });
};

export const useLogoutMutation = () => {
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      dispatch(clearAuth());
    },
  });
};
