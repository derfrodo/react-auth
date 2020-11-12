import { PathHelper } from "@derfrodo/frodo-s-little-helpers/dist";
import { OidcMetadata, WebStorageStateStore } from "oidc-client";
import { useCallback, useMemo } from "react";
import { AuthServiceOidcClientConfig } from "../../Services";
import { useOrigin } from "../useOrigin";

export const useCreateAuthUrisForProvider = (provider: string = "/basic") => {
    const origin = useOrigin();
    return useMemo(() => {
        const shelper = new PathHelper();

        return {
            end_session_endpoint: "/auth/logout",
            redirect_uri: shelper.createPath(origin, "auth", provider),
            post_logout_redirect_uri: shelper.createPath(
                origin,
                "auth",
                "logout",
                provider
            ),
            popup_redirect_uri: shelper.createPath(
                origin,
                "auth",
                "authPopup",
                provider
            ),
            silent_redirect_uri: shelper.createPath(
                origin,
                "auth",
                "authSilent",
                provider
            ),
        };
    }, [origin]);
};

export const useCreateMetaData = (
    metadataUrl: string,
    overwritingMetaData?: Partial<OidcMetadata>
) => {
    return useCallback(async () => {
        return overwritingMetaData && metadataUrl
            ? {
                  ...(await (await fetch(metadataUrl)).json()),
                  ...overwritingMetaData,
              }
            : metadataUrl
            ? await (await fetch(metadataUrl)).json()
            : overwritingMetaData;
    }, [metadataUrl, overwritingMetaData]);
};

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
