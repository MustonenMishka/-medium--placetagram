import React, {useContext, useState} from 'react';

import styles from './Auth.module.scss';
import Input from "../../shared/components/UIElements/Input/Input";
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../shared/utils/validators";
import ButtonPanel from "../../shared/components/UIElements/Button/ButtonPanel";
import Button from "../../shared/components/UIElements/Button/Button";
import {useForm} from "../../shared/hooks/FormHook";
import SwitchButton from "../../shared/components/UIElements/Button/SwitchButton";
import {AuthContext} from "../../shared/context/auth-context";
import Spinner from "../../shared/components/UIElements/Spinner/Spinner";
import Modal from "../../shared/components/UIElements/Modals/Modal";
import {useHttpClient} from "../../shared/hooks/HttpHook";
import ImageUpload from "../../shared/components/UIElements/Input/ImageUpload";

const Auth = props => {
        const auth = useContext(AuthContext);

        const [isSignUp, setIsSignUp] = useState(false);
        const {isLoading, error, sendRequest, clearError} = useHttpClient();


        const [formState, inputHandler, setFormData] = useForm({
            email: {
                value: '',
                isValid: false
            },
            password: {
                value: '',
                isValid: false
            }
        }, false);

        const authSubmitHandler = e => {
            e.preventDefault();

            if (isSignUp) {
                const formData = new FormData();
                formData.append('email', formState.inputs.email.value);
                formData.append('name', formState.inputs.name.value);
                formData.append('about', formState.inputs.about.value);
                formData.append('password', formState.inputs.password.value);
                formData.append('image', formState.inputs.image.value);

                sendRequest('api/users/signup', 'POST', formData)
                    .then((res) => auth.login(res.data.userId, res.data.token));
            } else {
                sendRequest('api/users/login', 'POST', {
                    email: formState.inputs.email.value,
                    password: formState.inputs.password.value
                }).then((res) => auth.login(res.data.userId, res.data.token));
            }
        };

        const toggleSignUpHandler = () => {
            if (isSignUp) {
                setFormData({
                    ...formState.inputs,
                    name: undefined,
                    about: undefined,
                    image: undefined
                }, formState.inputs.email.isValid && formState.inputs.password.isValid);
            } else {
                setFormData(
                    {
                        ...formState.inputs,
                        name: {
                            value: '',
                            isValid: false
                        },
                        about: {
                            value: '',
                            isValid: false
                        },
                        image: {
                            value: null,
                            isValid: false
                        }
                    }, false)
            }
            setIsSignUp(prevMode => !prevMode)
        };


        return <React.Fragment>
            <Modal
                header="Authentication error"
                show={!!error}
                close={clearError}>
                <p>{error}</p>
            </Modal>

            <div className={styles.container}>
                <div className={styles.sticker}>
                    <h2 className={styles.heading}>Login</h2>
                    <p className={styles.desc}>Enter your email and password to sign-in / register if you are a new user</p>
                </div>
                <form className={styles.AuthForm} onSubmit={authSubmitHandler}>
                    <div className={styles.spinner}>{isLoading && <Spinner size="small"/>}</div>
                    <div className={styles.SignModeSwitch}>
                        <SwitchButton onClick={toggleSignUpHandler} opt1='Sign-in' opt2='Sign-up' checked={isSignUp}/>
                    </div>
                    <div className={styles.formContent}>
                        {isSignUp && <ImageUpload id="image" onInput={inputHandler} errorText="Choose profile image (jpg/png)"/>}
                        <Input id='email' element='input' type='text' label='Email' invertedColors
                               errorText='Enter a valid email' validators={[VALIDATOR_EMAIL()]}
                               onInput={inputHandler}/>
                        <Input id='password' element='input' type='password' label='Password' invertedColors
                               errorText='Enter a valid password (>5 symbols)' validators={[VALIDATOR_MINLENGTH(5)]}
                               onInput={inputHandler}/>
                        {isSignUp && <Input id='name' element='input' type='text' label='Name' invertedColors
                                            errorText='Enter a name' validators={[VALIDATOR_REQUIRE()]}
                                            onInput={inputHandler} />}
                        {isSignUp && <Input id='about' element='textarea' type='text' label='About you' invertedColors
                                            errorText='Enter some description (>5 characters)' validators={[VALIDATOR_MINLENGTH(5)]}
                                            onInput={inputHandler}/>}
                            </div>
                    <ButtonPanel>
                        <Button size='big' type='submit'
                                disabled={!formState.isValid}>Sign-{isSignUp ? 'up' : 'in'}</Button>
                    </ButtonPanel>
                </form>
            </div>
        </React.Fragment>
    }
;

export default Auth