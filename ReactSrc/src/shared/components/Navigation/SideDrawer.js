import React, {useState} from 'react';
import ReactDOM from 'react-dom';

import styles from './SideDrawer.module.scss';
import Backdrop from "../UIElements/Backdrop/Backdrop";

const SideDrawer = props => {
    const [drawerIsOpen, setDrawerOpen] = useState(false);

    const toggleDrawer = () => {
      setDrawerOpen(!drawerIsOpen)
    };

    const content =
        <React.Fragment>
            <Backdrop onClick={toggleDrawer} show={drawerIsOpen} animation='toRight'/>
            <aside className={styles.SideDrawer} onClick={toggleDrawer}>
                <button className={`${styles.burger} ${drawerIsOpen ? styles.burger_Opened : ''}`} onClick={toggleDrawer}><span className={styles.line}/></button>
                <nav className={drawerIsOpen ? styles.navLinksSide : styles.navLinksSide_Closed}>
                    {props.children}
                </nav>
            </aside>;
        </React.Fragment>;

    return ReactDOM.createPortal(content, document.getElementById('drawer-portal'))
};

export default SideDrawer;