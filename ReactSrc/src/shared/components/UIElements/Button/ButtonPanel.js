import React from 'react';

import styles from './ButtonPanel.module.scss';

const ButtonPanel = props => {
    return (
        <div className={styles.ButtonPanel}>
            {props.children}
        </div>
    )
};

export default ButtonPanel;