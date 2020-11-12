import { PathHelper } from "@derfrodo/frodo-s-little-helpers/dist";
import { useMemo } from "react";
import { useOrigin } from "..";

export const useCreateAuthUrisForProvider = (provider: string = "basic") => {
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