import React from 'react';

import styles from './SwitchButton.module.scss';

const SwitchButton = props => {
    return <button type='button' className={`${styles.SwitchButton} ${props.checked ? styles.Checked : ''}`} onClick={props.onClick}>
        <span className={styles.opt1}>{props.opt1}</span>
        <span className={styles.opt2}>{props.opt2}</span>
        <span className={styles.cursor}></span>
    </button>
}

export default SwitchButton