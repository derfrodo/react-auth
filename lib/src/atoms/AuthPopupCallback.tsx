import log from "loglevel";
import React from "react";
import { useParams } from "react-router";
import {
    authActionCreators,
    useAuthReducerContextDispatch,
} from "../Auth/reducer";
import { useAuthState } from "../hooks/useAuthState";
import useStatefulAuthService from "../hooks/useStatefulAuthService";

export const AuthPopupCallback: React.FC<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError?: (error: any) => any;
    children?: React.ReactNode;
}> = ({ onError, children }) => {
    const { provider } = useParams<{ provider: string | undefined }>();
    const service = useStatefulAuthService(provider);

    const { redirectToStatePath } = useAuthState();

    const [loggedIn, setLoggedIn] = React.useState(false);
    const dispatch = useAuthReducerContextDispatch();
    React.useEffect(() => {
        (async () => {
            if (loggedIn || !service) {
                return;
            }
            log.debug(`Signing in silently with provider ${provider}`);
            try {
                const { silentSigninPopupCallback } = service;
                const user = await silentSigninPopupCallback();
                log.debug(`Silent signin returned user`, user);
                const next = !loggedIn ? user !== undefined : loggedIn;
                setLoggedIn(() => next);
                if (provider) {
                    dispatch(
                        authActionCreators.setUser(provider, user ?? undefined)
                    );
                }
            } catch (err) {
                // not signed in
                log.error("Failed to signin silently", err);
                if (onError) {
                    onError(err);
                }
            }
        })();
    }, [dispatch, loggedIn, onError, provider, redirectToStatePath, service]);

    return <div>{children}</div>;
};

export default AuthPopupCallback;
