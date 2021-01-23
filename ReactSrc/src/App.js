import React, {Suspense} from 'react';
import {BrowserRouter, Route, Redirect, Switch} from 'react-router-dom';

import './App.scss';
import Users from "./user/pages/Users";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import {AuthContext} from "./shared/context/auth-context";
import {useAuth} from "./shared/hooks/AuthHook";
import Spinner from "./shared/components/UIElements/Spinner/Spinner";

const NewPlace = React.lazy(() => import("./places/pages/NewPlace"));
const UserPlaces = React.lazy(() => import("./places/pages/UserPlaces"));
const UpdatePlace = React.lazy(() => import("./places/pages/UpdatePlace"));
const Auth = React.lazy(() => import("./user/pages/Auth"));

const App = () => {
    const {token, login, logout, loggedUserId} = useAuth();

    let routes;
    if (token) {
        routes = (
            <Switch>
                <Route path="/" exact component={Users}/>
                <Route path="/:userId/places" exact component={UserPlaces}/>
                <Route path="/places/new" exact component={NewPlace}/>
                <Route path="/places/:placeId" exact component={UpdatePlace}/>
                <Redirect to="/"/>
            </Switch>
        )
    } else {
        routes = (
            <Switch>
                <Route path="/" exact component={Users}/>
                <Route path="/:userId/places" exact component={UserPlaces}/>
                <Route path="/auth" exact component={Auth}/>
                <Redirect to="/auth"/>
            </Switch>
        )
    }

    return <AuthContext.Provider value={{isLogged: !!token, token, login, logout, loggedUserId}}>
        <BrowserRouter>
            <MainNavigation/>
            <main>
                <Suspense fallback={<Spinner centered/>}>
                    {routes}
                </Suspense>
            </main>
        </BrowserRouter>
    </AuthContext.Provider>
};

export default App;
