import React, { useMemo } from "react";
import { useAuthReducerContextState } from "../Auth/reducer";
import IAuthService from "../interfaces/IAuthService";

export const useStatefulAuthService = (
    provider: string | undefined | null
): IAuthService | undefined => {
    const { services } = useAuthReducerContextState();
    const service = useMemo(
        () => (provider && services ? services[provider] : undefined),
        [provider, services]
    );
    const authService = service ?? undefined;

    const getAccessToken = React.useRef<
        (forceRefresh?: boolean) => Promise<string | null>
    >(() => Promise.reject("Method has not been initialized"));
    const getAccessTokenCallback = React.useCallback(async () => {
        return (await authService?.getAccessToken()) || null;
    }, [authService]);

    React.useEffect(() => {
        getAccessToken.current = getAccessTokenCallback;
    }, [getAccessTokenCallback]);

    return React.useMemo<IAuthService | undefined>(() => {
        return !authService
            ? authService
            : {
                  initialize: () => Promise.reject("not implemented yet"), //Promise<void>;
                  getUser: () => Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  clearUser: () => Promise.reject("not implemented yet"), // (): Promise<void>;
                  signinSilent: () => Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  signinRedirect: (options: {
                      stateString?: string | undefined;
                      promptValue?: undefined | string;
                  }) => Promise.reject("not implemented yet"),

                  signoutRedirect: () => Promise.reject("not implemented yet"), //(stateString?: string | undefined): Promise<void>;
                  logoutCallback: () => Promise.reject("not implemented yet"), //(): Promise<void>;
                  signinCallback: () => Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  silentSigninCallback: () =>
                      Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  silentSigninPopupCallback: () =>
                      Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  ...(authService ? authService : {}),
                  getAccessToken: getAccessToken.current,
              };
    }, [authService]);
};

export default useStatefulAuthService;
