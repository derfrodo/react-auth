// This file has been generated by reducer-gen (@Stefan Pauka) written in 2020.

// import AuthService from "../../../Services/AuthService";
// import IDENTITY_PROVIDERS from "game-logic/dist/interfaces/IDENTITY_PROVIDERS";
import IAuthService from "../../../interfaces/IAuthService";
import { UserInfo } from "../../../interfaces/UserInfo";
import extenededActions from "./../actions/action.extended";

/**
 * You may add here extending reducer actions for this features reducer
 */

export type AuthReducerActionsExtended =
    | ({ type: extenededActions } & {
          type: extenededActions.SET_AUTH_PROVIDER_SERVICE;
          provider: string;
          next: IAuthService | undefined | null;
      })
    | {
          type: extenededActions.SET_AUTH_USER;
          provider: string;
          next: UserInfo | undefined | null;
      };

export const isAuthReducerActionsExtended = (
    item: any
): item is AuthReducerActionsExtended => {
    if (!item) {
        return false;
    }
    if (typeof item === "object") {
        const { type } = item;

        return (
            typeof type === "string" && extenededActions.hasOwnProperty(type)
        );
    }
    return false;
};

export default AuthReducerActionsExtended;
