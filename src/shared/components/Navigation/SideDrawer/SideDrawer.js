import React from 'react';
import './SideDrawer.css';

const SideDrawer = (props) => {
    const { isOpen } = props;
    return (
        <aside className={`side-drawer ${isOpen ? 'open' : ''}`}>
            {props.children}
        </aside>
    );
};

export default SideDrawer;
