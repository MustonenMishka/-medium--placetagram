import React, {useContext, useState} from 'react';

import styles from './PlaceItem.module.scss';
import Modal from "../../../shared/components/UIElements/Modals/Modal";
import Map from "../../../shared/components/Map/Map";
import ButtonPanel from "../../../shared/components/UIElements/Button/ButtonPanel";
import Button from "../../../shared/components/UIElements/Button/Button";
import {AuthContext} from "../../../shared/context/auth-context";
import {useHttpClient} from "../../../shared/hooks/HttpHook";
import Spinner from "../../../shared/components/UIElements/Spinner/Spinner";

const PlaceItem = ({item, onDelete}) => {
    const auth = useContext(AuthContext);

    const [showMap, setShowMap] = useState(false);
    const [showDeletion, setShowDeletion] = useState(false);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const openMapHandler = () => setShowMap(true);
    const closeMapHandler = () => setShowMap(false);

    const openDeletionHandler = () => {setShowDeletion(true)};
    const closeDeletionHandler = () => {setShowDeletion(false)};
    const confirmDeletionHandler = () => {
        setShowDeletion(false);
        sendRequest(`api/places/${item.id}`, 'DELETE', null, {Authorization: 'Bearer ' + auth.token}).then(() => {
            onDelete(item.id)
        })
    };

    return (
        <React.Fragment>

            <Modal
                header="Searching place error"
                show={!!error}
                close={clearError}>
                <p>{error}</p>
            </Modal>

            {isLoading && <Spinner centered/>}

            <li className={styles.PlaceItem}>
                <div className={styles.Card}>
                    <div className={styles.header}>
                        <div className={styles.image}>
                            <img src={item.image} alt={item.title}/>
                        </div>
                        <h3 className={styles.title}>{item.title}</h3>
                        <h4 className={styles.address}>{item.address}</h4>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.subtitle}>About</div>
                        <p className={styles.desc}>{item.description}</p>
                    </div>
                    <ButtonPanel>
                        <Button inverse onClick={openMapHandler}>View on map</Button>
                        {auth.loggedUserId === item.creator && <Button to={`/places/${item.id}`}>Edit</Button>}
                        {auth.loggedUserId === item.creator && <Button danger onClick={openDeletionHandler}>Delete</Button>}
                    </ButtonPanel>
                </div>
            </li>

            <Modal show={showMap}
                   close={closeMapHandler}
                   header={item.address}
                   headerImage={item.image}>
                <div className={styles.MapContainer}>
                    <Map center={item.location} zoom={16}/>
                </div>
            </Modal>

            <Modal
                header="Warning"
                show={showDeletion}
                close={closeDeletionHandler}
                footer={
                    <ButtonPanel>
                        <Button danger onClick={confirmDeletionHandler}>Delete</Button>
                    </ButtonPanel>
                }>
                <p>Are you sure you want to delete this place? Please note that it can't be undone thereafter.</p>
            </Modal>
        </React.Fragment>

    )
};

export default PlaceItem;
