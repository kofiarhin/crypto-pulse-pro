import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  clearAuth,
  setAuthInitialized,
  setCredentials,
} from "../../features/auth/authSlice";
import { authService } from "../../services/authService";

export const useInitializeAuth = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    let cancelled = false;

    const initialize = async () => {
      try {
        const refreshed = await authService.refresh();
        const me = await authService.me(refreshed.accessToken);

        if (!cancelled) {
          dispatch(
            setCredentials({
              user: me.user,
              accessToken: refreshed.accessToken,
            }),
          );
        }
      } catch (_error) {
        if (!cancelled) {
          dispatch(clearAuth());
          dispatch(setAuthInitialized());
        }
      } finally {
        if (!cancelled) {
          dispatch(setAuthInitialized());
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);
};
