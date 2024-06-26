import type { NavigateOptions } from "@tanstack/react-router";
import { createContext, useCallback, useMemo, useRef, useState } from "react";
import type { AuthenticationState, UserInfo } from "./actions";
import { authenticate, getUserInfo, initialUserInfo, logout } from "./actions";

export interface AuthenticationContextType {
  userInfo: UserInfo | null;
  reloadUserInfo: () => void;
  signInAction: (_: AuthenticationState, formData: FormData) => Promise<AuthenticationState>;
  signOutAction: () => Promise<AuthenticationState>;
}

export const AuthenticationContext = createContext<AuthenticationContextType>({
  userInfo: initialUserInfo,
  reloadUserInfo: () => {},
  signInAction: async () => ({}),
  signOutAction: async () => ({})
});

export interface AuthenticationProviderProps {
  children: React.ReactNode;
  navigate?: (navigateOptions: NavigateOptions) => void;
  afterSignOut?: NavigateOptions["to"];
  afterSignIn?: NavigateOptions["to"];
}

/**
 * Provide authentication context to the application.
 */
export function AuthenticationProvider({
  children,
  navigate,
  afterSignIn,
  afterSignOut
}: Readonly<AuthenticationProviderProps>) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(initialUserInfo);
  const fetching = useRef(false);

  const reloadUserInfo = useCallback(async () => {
    if (fetching.current) return;
    fetching.current = true;
    try {
      const newUserInfo = await getUserInfo();
      setUserInfo(newUserInfo);
    } catch (error) {
      setUserInfo(null);
    }
    fetching.current = false;
  }, []);

  const signOutAction = useCallback(async () => {
    const result = await logout();
    setUserInfo(null);
    if (navigate && afterSignOut) navigate({ to: afterSignOut });

    return result;
  }, [navigate, afterSignOut]);

  const signInAction = useCallback(
    async (state: AuthenticationState, formData: FormData) => {
      const result = await authenticate(state, formData);
      if (result.success) setUserInfo(await getUserInfo());

      if (result.success && navigate && afterSignIn) navigate({ to: afterSignIn });
      return result;
    },
    [navigate, afterSignIn]
  );

  const authenticationContext = useMemo(
    () => ({
      userInfo,
      reloadUserInfo,
      signInAction,
      signOutAction
    }),
    [userInfo, reloadUserInfo, signInAction, signOutAction]
  );

  return <AuthenticationContext.Provider value={authenticationContext}>{children}</AuthenticationContext.Provider>;
}
