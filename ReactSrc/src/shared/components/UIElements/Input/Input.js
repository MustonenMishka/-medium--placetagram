import React, {useReducer, useEffect} from 'react';

import styles from './Input.module.scss';
import {validate} from "../../../utils/validators";

const inputReducer = (state, action) => {
    switch (action.type) {
        case 'CHANGE':
            return {
                ...state,
                value: action.val,
                isValid: validate(action.val, action.validators)
            };
        case 'TOUCH':
            return {
                ...state,
                isTouched: true
            };
        default:
            return state
    }
};

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue || '',
        isValid: props.initialValid || false,
        isTouched: false
    });

    const {id, onInput} = props;
    const {value, isValid} = inputState;
    useEffect(() => {
        onInput(id, value, isValid)
    }, [id, value, isValid, onInput])

    const changeHandler = e => {
        dispatch({type: 'CHANGE', val: e.target.value, validators: props.validators})
    };
    const touchHandler = () => {
        dispatch({type: 'TOUCH'})
    };

    const input = <React.Fragment>
        <input id={props.id} type={props.type} placeholder={props.placeholder}
               required onChange={changeHandler} value={inputState.value}
               onBlur={touchHandler}/>
        <span className={styles.bar}></span>
    </React.Fragment>;
    const textArea = <textarea id={props.id} rows={props.rows || 3}
                               required onChange={changeHandler}
                               value={inputState.value} onBlur={touchHandler}/>;

    return <div className={`${styles.FormControl} ${props.invertedColors ? styles.Inverted : ''} ${inputState.isTouched ?
        inputState.isValid ? styles.Valid : styles.Invalid : ''}`}>
        {props.element === 'textarea' ? textArea : input}
        <label htmlFor={props.id}>{props.label}</label>
        {!inputState.isValid && inputState.isTouched && <p className={styles.errorText}>{props.errorText}</p>}
    </div>
};

export default Input;