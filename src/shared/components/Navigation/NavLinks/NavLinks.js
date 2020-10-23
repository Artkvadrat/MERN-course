import React, { useContext } from 'react';
import './NavLinks.css';
//importing components
import { NavLink } from "react-router-dom";
//import context
import { AuthContext } from "../../../context/auth-context";

const NavLinks = () => {
    const auth = useContext(AuthContext);
    return (
        <ul className="navLinksList">
            <li>
                <NavLink to='/' activeClassName='activeLink' exact>
                    All users
                </NavLink>
            </li>
            {auth.isLoggedIn && (
                <li>
                <NavLink to='/u1/places' activeClassName='activeLink'>
                    My places
                </NavLink>
            </li>
            )}
            {auth.isLoggedIn && (
                <li>
                <NavLink to='/places/new' activeClassName='activeLink'>
                    Add place
                </NavLink>
            </li>
            )}
            {!auth.isLoggedIn && (
                <li>
                <NavLink to='/authenticate' activeClassName='activeLink'>
                    Authenticate
                </NavLink>
            </li>
            )}
            {auth.isLoggedIn && (
                <button className='logoutButton' onClick={auth.logout}>Logout</button>
            )}
        </ul>
    );
};

export default NavLinks;
