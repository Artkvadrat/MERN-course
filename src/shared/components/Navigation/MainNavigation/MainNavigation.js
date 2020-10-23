import React, {useState} from 'react';
import './MainNavigation.css';
//importing components
import MainHeader from "../MainHeader/MainHeader";
import { Link } from "react-router-dom";
import NavLinks from "../NavLinks/NavLinks";
import SideDrawer from "../SideDrawer/SideDrawer";

const MainNavigation = () => {

    const [ isOpen, setOpen ] = useState(false);

    // it can change on history change

    return (
        <React.Fragment>
            <SideDrawer isOpen={isOpen}>
                <NavLinks/>
            </SideDrawer>
            <MainHeader>
                <button className={`burgerIcon ${isOpen ? 'open' : '' }`}
                        onClick={() => setOpen(!isOpen)}>
                    <span />
                    <span />
                    <span />
                </button>
                <Link to='/'>
                    <h1>Your places</h1>
                </Link>
                <nav>
                    <NavLinks/>
                </nav>
            </MainHeader>
        </React.Fragment>
    );
};

export default MainNavigation;
