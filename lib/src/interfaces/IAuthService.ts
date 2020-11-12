import { RemoteUserInfo } from "./UserInfo";

export interface IAuthService {
    initialize(): Promise<void>;
    getUser(): Promise<RemoteUserInfo | null>;
    getAccessToken(forceRefresh?: boolean): Promise<string | null>;
    clearUser(): Promise<void>;
    signinSilent(): Promise<RemoteUserInfo | null>;
    signinRedirect(options: {
        stateString?: string | undefined;
        promptValue?: undefined | string;
    }): Promise<void>;
    signoutRedirect(stateString?: string | undefined): Promise<void>;
    logoutCallback(): Promise<void>;
    signinCallback(): Promise<RemoteUserInfo | null>;
    silentSigninCallback(): Promise<RemoteUserInfo | null>;
    silentSigninPopupCallback(): Promise<RemoteUserInfo | null>;
}

export default IAuthService;
