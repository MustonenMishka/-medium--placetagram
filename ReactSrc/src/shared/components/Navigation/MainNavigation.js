import React from 'react';

import MainHeader from "./MainHeader";
import NavLinks from "./NavLinks";
import SideDrawer from "./SideDrawer";

const MainNavigation = props => {
    return (
        <React.Fragment>
            <SideDrawer>
                <NavLinks/>
            </SideDrawer>
            <MainHeader>
                <NavLinks/>
            </MainHeader>
        </React.Fragment>
    )
};

export default MainNavigation;