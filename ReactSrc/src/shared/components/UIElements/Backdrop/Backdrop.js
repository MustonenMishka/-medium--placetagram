import React from 'react';
import ReactDOM from 'react-dom';
import {CSSTransition} from 'react-transition-group';

import styles from './Backdrop.module.scss';

const Backdrop = props => {
    const content = <CSSTransition in={props.show}
                                   timeout={200}
                                   classNames={{
                                       enter: styles[`${props.animation}-enter`],
                                       enterActive: styles[`${props.animation}-enterActive`],
                                       exit: styles[`${props.animation}-exit`],
                                       exitActive: styles[`${props.animation}-exitActive`],
                                   }}
                                   mountOnEnter unmountOnExit>
            <div className={styles.Backdrop} onClick={props.onClick}></div>
        </CSSTransition>;

    return ReactDOM.createPortal(
        content, document.getElementById('backdrop-portal')
    )
};

export default Backdrop;