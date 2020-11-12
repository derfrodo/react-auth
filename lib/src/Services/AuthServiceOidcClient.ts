import { doBindPrototype } from "@derfrodo/frodo-s-little-helpers/dist";
import log from "loglevel";
import { User, UserManager, UserManagerSettings } from "oidc-client";
import {
    IdTokenClaims,
    RemoteUserInfo,
    UserInfo,
} from "../interfaces/UserInfo";
import IAuthService from "../interfaces/IAuthService";

export type AuthServiceOidcClientConfig = UserManagerSettings;

export class AuthServiceOidcClient implements IAuthService {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _userManager: UserManager = {} as any;
    private _isInitialized = false;

    private renewingSilently = false;

    constructor(
        private _userManagerSettings: AuthServiceOidcClientConfig,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        private onUserMayHasChanged: (user?: UserInfo | undefined | null) => any
    ) {
        doBindPrototype(this, AuthServiceOidcClient.prototype);
        this._userManager = this.getUserManager(this._userManagerSettings);
    }

    get userManagerSettings(): AuthServiceOidcClientConfig {
        return this._userManagerSettings;
    }

    get userManager(): UserManager {
        return this._userManager;
    }

    get isInitialized(): boolean {
        return this._isInitialized;
    }

    async initialize(): Promise<void> {
        try {
            log.debug("Initializing OIDC-Client");
            const user = await this._userManager.getUser();

            log.debug("Bind auth manager events");
            this._userManager.events.addAccessTokenExpiring(async () => {
                log.debug(
                    `Access token is going to expire. Currently renewing: `,
                    this.renewingSilently
                );
            });
            this._userManager.events.addUserLoaded((user) => {
                log.debug(`User loaded`, user);
            });
            this._userManager.events.addUserUnloaded(() => {
                log.debug(`User unloaded`);
            });

            this._userManager.events.addSilentRenewError(async (error) => {
                log.error("Silent renew error", error);

                try {
                    log.error("Removing user from storage.");
                    await this.clearUser();
                } catch (e) {
                    log.error("Removing user from storage failed.", e);
                }
            });

            this.callOnUserMayHasChanged(user);
            this._isInitialized = true;
        } catch (err) {
            log.error("Initializing OIDC-Client failed", err);
            throw err;
        }
    }

    verifyIsInitialized(): void {
        if (!this._isInitialized) {
            log.error(
                "Auth service has been tried to be used before being initialized."
            );
            throw new Error(
                "Please initalize Auth service before first usage!"
            );
        }
    }

    async getUser(): Promise<RemoteUserInfo | null> {
        this.verifyIsInitialized();
        const account = await this._userManager.getUser();

        return account !== null ? this.toRemoteUser(account) : null;
    }

    async clearUser(): Promise<void> {
        this.verifyIsInitialized();
        await this.userManager.clearStaleState();
        await this.userManager.removeUser();
        this.callOnUserMayHasChanged();
    }

    async signinSilent(): Promise<RemoteUserInfo | null> {
        this.verifyIsInitialized();
        try {
            if (this.renewingSilently) {
                log.warn("Already renewing token silently");
                await new Promise((r) => setTimeout(r, 250));
            }
            this.renewingSilently = true;
            const currentUser = await this.getUser();
            const idp = currentUser?.idTokenClaims.idp;
            const sub = currentUser?.idTokenClaims.sub;
            const name = currentUser?.idTokenClaims.name;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const sid = (currentUser?.idTokenClaims as any).sid;
            const args =
                idp && typeof idp === "string" && sub && typeof sub === "string"
                    ? {
                          login_hint: name,
                          // prompt: "none",
                          extraQueryParams: {
                              domain_hint: idp,
                              sid: sid || undefined,
                          },
                      }
                    : undefined;
            log.debug(`Data for current user`, args);
            try {
                const user = await this._userManager.signinSilent(args);
                this.callOnUserMayHasChanged(user);
                return this.toRemoteUser(user);
            } catch (err) {
                // we may want to try something different like popup, dont we?
                const user2 = await this._userManager.signinPopup(args);
                this.callOnUserMayHasChanged(user2);
                return this.toRemoteUser(user2);
            }
        } catch (err) {
            log.error("Failed to signin silently", err);
            try {
                await this.clearUser();
            } finally {
                throw err;
            }
        } finally {
            this.renewingSilently = false;
        }
    }

    async signinRedirect({
        stateString,
        promptValue,
    }: {
        stateString?: string | undefined;
        promptValue?: undefined | string;
    }): Promise<void> {
        try {
            const result =
                typeof promptValue !== "undefined"
                    ? await this.userManager.signinRedirect({
                          state: stateString,
                      })
                    : await this.getUserManager({
                          ...this._userManagerSettings,
                          prompt: "select_account",
                      }).signinRedirect({ state: stateString });
            await this.callOnUserMayHasChanged();
            return result;
        } catch (err) {
            log.error("Failed to redirect for signin", { error: err });
        }
    }

    async signoutRedirect(
        stateString: string | undefined = undefined
    ): Promise<void> {
        try {
            await this._userManager.revokeAccessToken();
        } catch (err) {
            log.error(`failed while revoking access token `, err);
        }
        try {
            await this._userManager.removeUser();
        } catch (err) {
            log.error(`failed while removing user `, err);
        }
        try {
            await this._userManager.signoutRedirect({ state: stateString });
        } catch (err) {
            log.error("failed during logout", err);
        }
        await this.callOnUserMayHasChanged();
    }

    async logoutCallback(): Promise<void> {
        try {
            const r = await this.userManager.signoutCallback();
            await this.callOnUserMayHasChanged();
            log.debug("Signout response", { response: r });
        } catch (err) {
            log.error(`failed to logout.`, { error: err });
        }
    }

    async signinCallback(): Promise<RemoteUserInfo | null> {
        try {
            const user = await this.userManager.signinRedirectCallback();
            log.debug("user signed in", { user });
            return this.toRemoteUser(user);
        } finally {
            await this.callOnUserMayHasChanged();
        }
    }

    async silentSigninPopupCallback(): Promise<RemoteUserInfo | null> {
        try {
            const user = await this.userManager.signinPopupCallback();
            return user ? this.toRemoteUser(user) : null;
        } finally {
            await this.callOnUserMayHasChanged();
        }
    }

    async silentSigninCallback(): Promise<RemoteUserInfo | null> {
        try {
            const user = await this.userManager.signinSilentCallback();
            return user ? this.toRemoteUser(user) : null;
        } finally {
            await this.callOnUserMayHasChanged();
        }
    }

    async getAccessToken(forceRefresh = false): Promise<string | null> {
        if (forceRefresh) {
            try {
                await this.signinSilent();
            } catch (err) {
                log.error(
                    "Signin silently failed. (refresh has been forced by parameter)",
                    { error: err }
                );
            }
            // TODO: Handle refresh!
        }
        let user = await this._userManager.getUser();
        if (forceRefresh) {
            this.callOnUserMayHasChanged(user);
        }

        if (
            user &&
            (user.expired ||
                user.expires_in <
                    (this._userManagerSettings
                        .accessTokenExpiringNotificationTime ?? 60))
        ) {
            try {
                await this.signinSilent();
            } catch (err) {
                log.error("Signin silently failed", { error: err });
            } finally {
                user = await this._userManager.getUser();
                this.callOnUserMayHasChanged(user);
            }
        }

        return user ? user.access_token ?? null : null;
    }

    private async callOnUserMayHasChanged(user?: User | null) {
        try {
            const up =
                user !== undefined ? user : await this.userManager.getUser();
            try {
                this.onUserMayHasChanged(up ? this.toRemoteUser(up) : null);
            } catch (e) {
                log.warn("Calling user might have changed callback failed", {
                    error: e,
                });
            }
        } catch (err) {
            log.warn(
                "Failed to resolve user for calling possible changed callback",
                {
                    error: err,
                }
            );
            this.onUserMayHasChanged();
        }
    }

    private toRemoteUser(user: User): RemoteUserInfo {
        // TODO: Validate user / Token Claims

        const id_token = user.id_token
            ? atob(user.id_token.split(".")[1])
            : undefined;
        const access_token = user.access_token
            ? atob(user.access_token.split(".")[1])
            : undefined;

        const result: RemoteUserInfo = {
            name: user.profile.name || "",
            sid: user.profile.sid || "",
            idTokenClaims: ({
                ...user.profile,
                ...(id_token ? JSON.parse(id_token) : {}),
                ...(access_token ? JSON.parse(access_token) : {}),
            } as unknown) as IdTokenClaims,
        };
        return result;
    }

    private getUserManager(settings: UserManagerSettings) {
        const userManager = new UserManager(settings);
        return userManager;
    }
}
