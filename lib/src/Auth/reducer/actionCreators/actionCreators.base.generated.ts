// This file has been generated by reducer-gen (@Stefan Pauka) written in 2020.
// DO NOT Change anything inside this file. Every time the generator is used, it will be overwritten.

import AuthenticatedUsers from "../../../interfaces/AuthenticatedUsers";
import AuthServices from "../../../interfaces/AuthServices";
import ReducerAction from "./../reducerActions/reducerActions.base.generated";
import actions from "./../actions/action.base.generated";

export const authActionCreatorsBase = {
    setIsInitialized: (nextIsInitialized:  boolean): ReducerAction => (
        {
            type: actions.AUTH_SET_IS_INITIALIZED,
            next: nextIsInitialized,
        }),
    setIsAuthenticating: (nextIsAuthenticating:  boolean): ReducerAction => (
        {
            type: actions.AUTH_SET_IS_AUTHENTICATING,
            next: nextIsAuthenticating,
        }),
    setServices: (nextServices:  AuthServices | undefined): ReducerAction => (
        {
            type: actions.AUTH_SET_SERVICES,
            next: nextServices,
        }),
    setUsers: (nextUsers:  AuthenticatedUsers | undefined): ReducerAction => (
        {
            type: actions.AUTH_SET_USERS,
            next: nextUsers,
        }),        
}

export default authActionCreatorsBase;
