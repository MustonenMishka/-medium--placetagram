import {useCallback, useState, useEffect} from 'react';

let logoutTimer;

export const useAuth = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [loggedUserId, setLoggedUserId] = useState(null);

    const login = useCallback((userId, token, tokenExpiration) => {
        setToken(token);
        setLoggedUserId(userId);

        const tokenExpirationDate = tokenExpiration || new Date(new Date().getTime() + 1000 * 60 * 60) // 1 hour
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem('userData', JSON.stringify({
            userId, token,
            tokenExpiration: tokenExpirationDate.toISOString()
        }))
    }, []);
    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setLoggedUserId(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime)
        } else {
            clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate]);

    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData
            && storedData.token
            && new Date(storedData.tokenExpiration) > new Date()) {
            login(storedData.userId, storedData.token, new Date(storedData.tokenExpiration));
        }
    }, [login]);

    return { token, login, logout, loggedUserId }
}