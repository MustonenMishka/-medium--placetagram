import React, {useEffect, useState, useContext} from 'react';
import {useHistory, useParams} from 'react-router-dom';

import styles from './PlaceForm.module.scss';
import Input from "../../shared/components/UIElements/Input/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/utils/validators";
import Button from "../../shared/components/UIElements/Button/Button";
import ButtonPanel from "../../shared/components/UIElements/Button/ButtonPanel";
import {useForm} from "../../shared/hooks/FormHook";
import {useHttpClient} from "../../shared/hooks/HttpHook";
import Spinner from "../../shared/components/UIElements/Spinner/Spinner";
import Modal from "../../shared/components/UIElements/Modals/Modal";
import {AuthContext} from "../../shared/context/auth-context";

const UpdatePlace = props => {
    const placeId = useParams().placeId;
    const auth = useContext(AuthContext);
    const history = useHistory();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();
    const [loadedPlace, setLoadedPlace] = useState();

    const [formState, inputHandler, setFormData] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        }
    }, false);

    useEffect(() => {
        const requestPlace = () => {
            sendRequest(`api/places/${placeId}`).then((res) => {
                setLoadedPlace(res.data.place);
                setFormData({
                    title: {
                        value: res.data.place.title,
                        isValid: true
                    },
                    description: {
                        value: res.data.place.description,
                        isValid: true
                    }
                }, true)
            })
        };
        requestPlace();
    }, [setFormData, placeId, sendRequest])

    const updateSubmitHandler = e => {
        e.preventDefault();
        sendRequest(`api/places/${placeId}`, 'PATCH', {
            title: formState.inputs.title.value,
            description: formState.inputs.description.value
        }, {Authorization: 'Bearer ' + auth.token}).then(() => {
            history.push(`/${auth.loggedUserId}/places`)
        })
    }

    return (<React.Fragment>
            <Modal
                header="Searching place error"
                show={!!error}
                close={clearError}>
                <p>{error}</p>
            </Modal>

            {isLoading && <Spinner centered/>}

            {!isLoading && loadedPlace && <div className={styles.container}>
                <div className={styles.sticker}>
                    <h2 className={styles.heading}>Update place</h2>
                    <p className={styles.desc}>Got an idea to edit some place? Nice! Users should have an up-to-date
                        info!</p>
                </div>
                <form className={styles.PlaceForm} onSubmit={updateSubmitHandler}>
                    <div className={styles.formContent}>
                        <Input id='title' element='input' type='text' label='Title'
                               errorText='Enter a valid name' validators={[VALIDATOR_REQUIRE()]}
                               onInput={inputHandler}
                               initialValue={loadedPlace.title}
                               initialValid={true}/>
                        <Input id='description' element='textarea' type='text' label='Description'
                               errorText='Enter some description (>5 characters)' validators={[VALIDATOR_MINLENGTH(5)]}
                               onInput={inputHandler}
                               initialValue={loadedPlace.description}
                               initialValid={true}/>
                    </div>
                    <ButtonPanel>
                        <Button size='big' type='submit' inverse disabled={!formState.isValid}>Update place</Button>
                    </ButtonPanel>
                </form>
            </div>}
        </React.Fragment>
    )
}

export default UpdatePlace