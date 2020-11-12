import { PathHelper } from "@derfrodo/frodo-s-little-helpers/dist";
import { useMemo } from "react";
import { useOrigin } from "..";
import { DEFAULT_AUTH_PROVIDER_NAME } from "../../constants";

export const useCreateAuthUrisForProvider = (
    provider: string = DEFAULT_AUTH_PROVIDER_NAME
) => {
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
