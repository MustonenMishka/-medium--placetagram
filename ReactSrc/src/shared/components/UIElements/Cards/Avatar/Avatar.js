import React from 'react';

import styles from './Avatar.module.scss';

const Avatar = props => {
    return (
        <div className={`${styles.Avatar} ${props.square ? styles.square : ''}`} >
            <img
                src={props.image}
                alt={props.alt}
                style={{width: props.width, height: props.width}}
            />
        </div>
    );
};

export default Avatar;
