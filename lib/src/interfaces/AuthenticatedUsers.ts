import { UserInfo } from "./UserInfo";

export type AuthenticatedUsers = RemoteAuthenticatedUsers;

export type RemoteAuthenticatedUsers = {
    [key in string]?: UserInfo | undefined | null;
};
export default AuthenticatedUsers;
