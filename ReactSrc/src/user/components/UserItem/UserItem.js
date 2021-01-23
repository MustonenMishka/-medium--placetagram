import React from 'react';

import styles from './UserItem.module.scss';
import Avatar from "../../../shared/components/UIElements/Cards/Avatar/Avatar";
import ButtonPanel from "../../../shared/components/UIElements/Button/ButtonPanel";
import Button from "../../../shared/components/UIElements/Button/Button";

const UserItem = ({item: {image, name, about, places, id}}) => {
    return (
        <li className={styles.UserItem}>
            <div className={styles.Card}>
                <div className={styles.header}>
                    <div className={styles.blur} style={{backgroundImage: `url(${image})`}}></div>
                    <div className={styles.image}>
                        <Avatar image={image} alt={name}/>
                    </div>
                    <h3 className={styles.fullname}>{name}</h3>
                    <h4 className={styles.places}>{places.length} {places.length === 1 ? 'Place' : 'Places'}</h4>
                </div>
                <div className={styles.content}>
                    <div className={styles.subtitle}>About</div>
                    <p className={styles.desc}>{about}
                    </p>
                </div>
                <ButtonPanel>
                    <Button to={`/${id}/places`}>
                        Show place
                    </Button>
                </ButtonPanel>
            </div>
        </li>
    );
};

export default UserItem;
