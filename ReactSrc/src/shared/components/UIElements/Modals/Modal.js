import React from 'react';
import ReactDOM from 'react-dom';
import {CSSTransition} from "react-transition-group";

import styles from './Modal.module.scss';
import Backdrop from "../Backdrop/Backdrop";

const ModalOverlay = props => {
    const content = (
        <div className={`${styles.Modal} ${props.className ? styles[props.className] : ''}`}>
            <div className={styles.close} onClick={props.close}><button></button></div>
            <header className={`${styles.header} ${props.headerClass ? styles[props.headerClass] : ''}`}>
                <h3 className={styles.title}>{props.header}</h3>
            </header>
            <form onSubmit={props.onSubmit ? props.onSubmit : e => e.preventDefault()}>
                <div className={`${styles.content} ${props.contentClass ? styles[props.contentClass] : ''}`}>
                    {props.children}
                </div>
                    {props.footer}
            </form>
        </div>
    );
    return ReactDOM.createPortal(content, document.getElementById('modal-portal'));
};

const Modal = props => {

    return <React.Fragment>
        <Backdrop onClick={props.onCancel} show={props.show} animation='scale'/>
        <CSSTransition in={props.show} mountOnEnter unmountOnExit timeout={200}
                       classNames={{
                           enter: styles.enter,
                           enterActive: styles.enterActive,
                           exit: styles.exit,
                           exitActive: styles.exitActive,
                       }}>
            <ModalOverlay {...props} />
        </CSSTransition>
    </React.Fragment>
};

export default Modal;