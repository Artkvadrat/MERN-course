import React, { useState, useCallback } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
//importing components
import NewPlace from "./places/pages/NewPlace/NewPlace";
import Users from "./user/pages/Users";
import MainNavigation from "./shared/components/Navigation/MainNavigation/MainNavigation";
import UserPlaces from "./places/pages/UserPlaces/UserPlaces";
import UpdatePlace from "./places/pages/UpdatePlace/UpdatePlace";
import Authenticate from "./user/pages/Authenticate";
//importing context
import { AuthContext } from "./shared/context/auth-context";

const App = () => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState();

    const login = useCallback((uid) => {
        setIsLoggedIn(true);
        setUserId(uid);
    }, []);

    const logout = useCallback((uid) => {
        setIsLoggedIn(false);
        setUserId(null);
    }, []);

    let routes;

    if (isLoggedIn) {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users/>
                </Route>
                <Route path="/places/new">
                    <NewPlace/>
                </Route>
                <Route path="/api/places/user/:userID" exact>
                    <UserPlaces/>
                </Route>
                <Route path="/api/places/:placeId" exact>
                    <UpdatePlace/>
                </Route>
                <Redirect to='/'/>
            </Switch>
        )
    } else {
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Users/>
                </Route>
                <Route path="/:userID/places" exact>
                    <UserPlaces/>
                </Route>
                <Route path="/authenticate" exact>
                    <Authenticate/>
                </Route>
                <Redirect to='/authenticate'/>
            </Switch>
        )
    }

    return (
        <AuthContext.Provider value={{isLoggedIn: isLoggedIn, userId: userId, login: login, logout: logout}}>
            <Router>
                <MainNavigation/>
                    {routes}
            </Router>
        </AuthContext.Provider>
    );
};

export default App;
