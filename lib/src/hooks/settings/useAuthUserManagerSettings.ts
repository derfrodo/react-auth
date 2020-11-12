import { WebStorageStateStore } from "oidc-client";
import { useMemo } from "react";
import { AuthServiceOidcClientConfig } from "../../Services";
import { useCreateAuthUrisForProvider } from "./useCreateAuthUrisForProvider";

export const useAuthServiceOidcClientConfigSettings = (
    config: Partial<AuthServiceOidcClientConfig>,
    provider: string = "/basic"
): AuthServiceOidcClientConfig => {
    const authRoutes = useCreateAuthUrisForProvider(provider);

    const result = useMemo<AuthServiceOidcClientConfig>(() => {
        return {
            response_type: "token id_token",
            scope: ["openid", "profile"].join(" "),
            ...authRoutes,
            automaticSilentRenew: false,
            silentRequestTimeout: 10000,
            checkSessionInterval: 10000,
            userStore: new WebStorageStateStore({ store: window.localStorage }),
            accessTokenExpiringNotificationTime: 60,
            loadUserInfo: true,
            ...config,
        };
    }, [config, provider]);
    return result;
};
