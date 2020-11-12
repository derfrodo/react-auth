import { WebStorageStateStore } from "oidc-client";
import { useCallback } from "react";
import { DEFAULT_AUTH_PROVIDER_NAME } from "../../constants";
import { AuthServiceOidcClientConfig } from "../../Services";
import { useCreateAuthUrisForProvider } from "./useCreateAuthUrisForProvider";

export const useCreateAuthServiceOidcClientConfigSettings = (
    provider: string = DEFAULT_AUTH_PROVIDER_NAME
): ((
    config: Partial<AuthServiceOidcClientConfig>
) => AuthServiceOidcClientConfig | undefined) => {
    const authRoutes = useCreateAuthUrisForProvider(provider);

    const result = useCallback<
        (
            config: Partial<AuthServiceOidcClientConfig>
        ) => AuthServiceOidcClientConfig | undefined
    >(
        (config) => {
            return {
                response_type: "token id_token",
                scope: ["openid", "profile"].join(" "),
                ...authRoutes,
                automaticSilentRenew: false,
                silentRequestTimeout: 10000,
                checkSessionInterval: 10000,
                userStore: new WebStorageStateStore({
                    store: window.localStorage,
                }),
                accessTokenExpiringNotificationTime: 60,
                loadUserInfo: true,
                ...config,
            };
        },
        [authRoutes]
    );
    return result;
};
