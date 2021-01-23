import React from 'react';

import styles from './ErrorCard.module.scss';
import ErrorIcon from '../../../../assets/media/svg/error-icon.svg';
import ButtonPanel from "../Button/ButtonPanel";

const ErrorCard = props => {
    return (
        <div className={styles.Modal}>
            <div className={styles.image}>
                <ErrorIcon/>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{props.errorText || 'Oops! An error occurred!'}</h3>
            </div>
            {props.children && (
                <ButtonPanel>
                    {props.children}
                </ButtonPanel>
            )}
        </div>
    )
};

export default ErrorCard;