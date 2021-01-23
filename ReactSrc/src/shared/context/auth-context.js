import {createContext} from 'react';

export const AuthContext = createContext({
    isLogged: false,
    loggedUserId: null,
    token: null,
    login: () => {},
    logout: () => {}
});