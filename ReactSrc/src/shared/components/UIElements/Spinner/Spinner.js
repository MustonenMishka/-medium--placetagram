import React from 'react';

import styles from './Spinner.module.scss';

const Spinner = props => {
    return (
        <div className={`${styles.Loader} 
        ${props.size ? styles[props.size] : ''} 
        ${props.centered ? styles.centered : ''}
        ${props.lightColor ? styles.lightColor : ''}`}>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
        </div>
    )
}

export default Spinner