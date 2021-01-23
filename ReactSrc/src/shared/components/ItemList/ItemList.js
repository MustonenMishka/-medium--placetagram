import React from 'react';

import styles from './ItemList.module.scss';
import ErrorCard from "../UIElements/Cards/ErrorCard";
import PlaceItem from '../../../places/components/PlaceItem/PlaceItem';
import UserItem from "../../../user/components/UserItem/UserItem";

const components = {
    user: UserItem,
    place: PlaceItem
};

const ItemList = props => {
    const ItemType = components[props.itemType];

    return (
        props.items.length === 0 ? (
            <ErrorCard errorText={props.errorModalText}>{props.errorModalControls}</ErrorCard>
        ) : (
            <ul className={styles.ItemList}>
                {props.items.map(item => <ItemType
                    item={item}
                    key={item.id}
                    onDelete={props.onDeleteItem}
                />)}
            </ul>
        )
    )
};

export default ItemList;