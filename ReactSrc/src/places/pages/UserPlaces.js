import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';

import ItemList from "../../shared/components/ItemList/ItemList";
import {useHttpClient} from "../../shared/hooks/HttpHook";
import Modal from "../../shared/components/UIElements/Modals/Modal";
import Spinner from "../../shared/components/UIElements/Spinner/Spinner";

const UserPlaces = () => {
    const [loadedPlaces, setLoadedPlaces] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const userId = useParams().userId;

    useEffect(() => {
        const requestPlaces = async () => {
            const res = await sendRequest(`api/places/user/${userId}`);
            setLoadedPlaces(res.data.places);
        };
        requestPlaces();
    }, [sendRequest, userId]);

    const placeDeleteHandler = (deletedId) => {
        setLoadedPlaces(prevPlaces => prevPlaces.filter(place => place.id !== deletedId))
    }

    return (<React.Fragment>
            <Modal
                header="Places loading error"
                show={!!error}
                close={clearError}>
                <p>{error}</p>
            </Modal>
            {isLoading && <Spinner centered/>}
            {!isLoading && loadedPlaces && <ItemList items={loadedPlaces}
                                                     errorModalText='No places yet...'
                                                     itemType='place'
                                                     onDeleteItem={placeDeleteHandler}/>}
        </React.Fragment>
    );
};

export default UserPlaces;