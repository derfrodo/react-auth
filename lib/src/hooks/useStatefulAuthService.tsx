import React, { useMemo } from "react";
import { DEFAULT_AUTH_PROVIDER_NAME } from "..";
import { useAuthReducerContextState } from "../Auth/reducer";
import IAuthService from "../interfaces/IAuthService";

export const useStatefulAuthService = (
    provider?: string | undefined | null
): IAuthService | undefined => {
    const { services } = useAuthReducerContextState();
    const service = useMemo(
        () =>
            services
                ? services[provider ?? DEFAULT_AUTH_PROVIDER_NAME]
                : undefined,
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
                  initialize: authService.initialize, // : () => Promise.reject("not implemented yet"), //Promise<void>;
                  getUser: authService.getUser, //: () => Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  clearUser: authService.clearUser, //: () => Promise.reject("not implemented yet"), // (): Promise<void>;
                  signinSilent: authService.signinSilent, //: () => Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  signinRedirect: authService.signinRedirect,
                  //   signinRedirect: (options?: {
                  //       stateString?: string | undefined;
                  //       promptValue?: undefined | string;
                  //   }) => Promise.reject("not implemented yet"),

                  signoutRedirect: authService.signoutRedirect, //: () => Promise.reject("not implemented yet"), //(stateString?: string | undefined): Promise<void>;
                  logoutCallback: authService.logoutCallback, //: () => Promise.reject("not implemented yet"), //(): Promise<void>;
                  signinCallback: authService.signinCallback, //: () => Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  silentSigninCallback: authService.silentSigninCallback, //: () =>
                  //   Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  silentSigninPopupCallback: authService.silentSigninPopupCallback, //: () =>
                  //   Promise.reject("not implemented yet"), //(): Promise<RemoteUserInfo | null>;
                  getAccessToken: getAccessToken.current,
              };
    }, [authService]);
};

export default useStatefulAuthService;
