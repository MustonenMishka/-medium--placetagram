import React, {useContext} from 'react';
import {useHistory} from 'react-router-dom';

import styles from './PlaceForm.module.scss';
import Input from "../../shared/components/UIElements/Input/Input";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/utils/validators";
import ButtonPanel from "../../shared/components/UIElements/Button/ButtonPanel";
import Button from "../../shared/components/UIElements/Button/Button";
import {useForm} from "../../shared/hooks/FormHook";
import {useHttpClient} from "../../shared/hooks/HttpHook";
import {AuthContext} from "../../shared/context/auth-context";
import Spinner from "../../shared/components/UIElements/Spinner/Spinner";
import Modal from "../../shared/components/UIElements/Modals/Modal";
import ImageUpload from "../../shared/components/UIElements/Input/ImageUpload";

const NewPlace = () => {
    const auth = useContext(AuthContext);
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        image: {
            value: null,
            isValid: false
        }
    }, false)

    const history = useHistory();

    const placeSubmitHandler = e => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('title', formState.inputs.title.value);
        formData.append('address', formState.inputs.address.value);
        formData.append('description', formState.inputs.description.value);
        formData.append('image', formState.inputs.image.value);

        sendRequest('api/places', 'POST', formData, {Authorization: 'Bearer ' + auth.token}).then(() => {history.push('/')})
    };

    return (<React.Fragment>
            <Modal
                header="Creating place error"
                show={!!error}
                close={clearError}>
                <p>{error}</p>
            </Modal>
            <div className={styles.container}>
                <div className={styles.sticker}>
                    <h2 className={styles.heading}>New Place</h2>
                    <p className={styles.desc}>Create a new place you've been visited, don't forget to add location,
                        some interesting story and breathtaking pictures.</p>
                </div>
                <form className={styles.PlaceForm} onSubmit={placeSubmitHandler}>
                    <div className={styles.spinner}>{isLoading && <Spinner size="small" lightColor />}</div>
                    <div className={styles.formContent}>
                        <ImageUpload id="image" buttonInverse square onInput={inputHandler} errorText="Choose profile image (jpg/png)"/>
                        <Input id='title' element='input' type='text' label='Title'
                               errorText='Enter a valid name' validators={[VALIDATOR_REQUIRE()]}
                               onInput={inputHandler}/>
                        <Input id='address' element='input' type='text' label='Address'
                               errorText='Enter a valid address' validators={[VALIDATOR_REQUIRE()]}
                               onInput={inputHandler}/>
                        <Input id='description' element='textarea' type='text' label='Description'
                               errorText='Enter some description (>5 characters)' validators={[VALIDATOR_MINLENGTH(5)]}
                               onInput={inputHandler}/>
                    </div>
                    <ButtonPanel>
                        <Button size='big' type='submit' inverse disabled={!formState.isValid}>Add place</Button>
                    </ButtonPanel>
                </form>
            </div>
        </React.Fragment>
    );
};

export default NewPlace;