import React from 'react';

import styles from './ErrorModal.module.scss';
import ErrorIcon from '../../../../assets/media/svg/error-icon.svg';
import Button from "../Button/Button";
import ButtonPanel from "../Button/ButtonPanel";

const ErrorModal = props => {
    return (
        <div className={styles.Modal}>
            <div className={styles.image}>
                <ErrorIcon/>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{props.modalTitle}</h3>
                <p className={styles.desc}>{props.children}</p>
            </div>
            {props.buttonText && (
                <ButtonPanel>
                    <Button to={`${props.buttonLink}`}>{props.buttonText}</Button>
                </ButtonPanel>
            )}
        </div>
    )
};

export default ErrorModal;