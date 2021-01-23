import React from 'react';

import styles from  './MainHeader.module.scss';
import {Link} from "react-router-dom";

const MainHeader = props => {
    return <header className={styles.MainHeader}>
        <h1 className={styles.title}><Link to="/">Placetagram</Link></h1>
        <nav className={styles.navLinksHead}>{props.children}</nav>
    </header>
};

export default MainHeader;