import React, {useEffect, useState} from 'react';

import ItemList from "../../shared/components/ItemList/ItemList";
import Modal from "../../shared/components/UIElements/Modals/Modal";
import Spinner from "../../shared/components/UIElements/Spinner/Spinner";
import {useHttpClient} from "../../shared/hooks/HttpHook";


const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    useEffect(() => {
        const requestUsers = async () => {
            const res = await sendRequest('api/users')
            setLoadedUsers(res.data.users);
        };
        requestUsers();
    }, [sendRequest]);

    return (<React.Fragment>
            <Modal
                header="User loading error"
                show={!!error}
                close={clearError}>
                <p>{error}</p>
            </Modal>
            {isLoading && <Spinner centered/>}
            {!isLoading && loadedUsers && <ItemList items={loadedUsers}
                                                    errorModalText='No users registered yet...'
                                                    itemType='user'/>}
        </React.Fragment>
    );
};

export default Users;

