import React from 'react';
import { Link } from 'react-router-dom';

import styles from './Button.module.scss';

const Button = props => {
    if (props.href) {
        return (
            <a
                className={`${styles.Button} ${props.size ? styles[props.size] : ''} 
                ${props.inverse ? styles.inverse : ''} 
                ${props.danger ? styles.danger : ''} 
                ${props.borderless ? styles.borderless : ''}`}
                href={props.href}
            >
                {props.children}
            </a>
        );
    }
    if (props.to) {
        return (
            <Link
                to={props.to}
                exact={props.exact}
                className={`${styles.Button} ${props.size ? styles[props.size] : ''} 
                ${props.inverse ? styles.inverse : ''} 
                ${props.danger ? styles.danger : ''} 
                ${props.borderless ? styles.borderless : ''}`}
            >
                {props.children}
            </Link>
        );
    }
    return (
        <button
            className={`${styles.Button} ${props.size ? styles[props.size] : ''} 
            ${props.inverse ? styles.inverse : ''} 
            ${props.danger ? styles.danger : ''} 
            ${props.borderless ? styles.borderless : ''}`}
            type={props.type}
            onClick={props.onClick}
            disabled={props.disabled}
        >
            {props.children}
        </button>
    );
};

export default Button;