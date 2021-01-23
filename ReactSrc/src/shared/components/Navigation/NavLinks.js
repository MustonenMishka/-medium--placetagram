import React, {useContext} from 'react';
import {NavLink} from 'react-router-dom';

import styles from './NavLinks.module.scss';
import UsersIcon from '../../../assets/media/svg/users-icon.svg';
import PlaceIcon from '../../../assets/media/svg/loaction-icon.svg';
import AddIcon from '../../../assets/media/svg/add-icon.svg';
import LoginIcon from '../../../assets/media/svg/login-icon.svg';
import LogoutIcon from '../../../assets/media/svg/logout-icon.svg';
import {AuthContext} from "../../context/auth-context";

const NavLinks = props => {
    const auth = useContext(AuthContext);

    return <ul className={styles.NavLinks}>
        <li>
            <NavLink to="/" title="Users" activeClassName={styles.activeLink} exact><UsersIcon /></NavLink>
        </li>
        {auth.isLogged && <li>
            <NavLink to={`/${auth.loggedUserId}/places`} title="Your places" activeClassName={styles.activeLink}><PlaceIcon /></NavLink>
        </li>}
        {auth.isLogged && <li>
            <NavLink to="/places/new" title="Create place" activeClassName={styles.activeLink}><AddIcon /></NavLink>
        </li>}
        {!auth.isLogged ? <li>
            <NavLink to="/auth" title="Login" activeClassName={styles.activeLink}><LoginIcon /></NavLink>
        </li> : <li>
            <NavLink to="/auth" title="Logout" onClick={auth.logout} activeClassName={styles.activeLink}><LogoutIcon /></NavLink>
        </li>}
    </ul>
};

export default NavLinks;
