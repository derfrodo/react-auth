import log from "loglevel";
import React from "react";
import { useHistory, useParams } from "react-router";
import useAuthState from "../hooks/useAuthState";
import useStatefulAuthService from "../hooks/useStatefulAuthService";

export const LogoutCallback: React.FC<{
    onError: (error: any) => any;
    children?: React.ReactNode;
}> = ({ onError, children }) => {
    const { provider } = useParams<{ provider: string | undefined }>();
    const service = useStatefulAuthService(provider);

    const { redirectToStatePath } = useAuthState();
    const h = useHistory();

    const [loggedIn, setLoggedIn] = React.useState(false);
    React.useEffect(() => {
        (async () => {
            if (loggedIn || !service) {
                return;
            }
            log.debug("logout callback");
            try {
                const { logoutCallback } = service;
                console.log(provider);
                const user = await logoutCallback();
                const next = !loggedIn ? user !== undefined : loggedIn;
                setLoggedIn(() => next);
                h.push("/");
            } catch (err) {
                // not signed in or error while signed out?
                if (onError) {
                    onError(err);
                }
            }
        })();
    }, [onError, h, loggedIn, provider, redirectToStatePath, service]);

    return <>{children}</>;
};

export default LogoutCallback;
