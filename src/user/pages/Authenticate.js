import React, { useState, useContext } from 'react';
//import custom hook
import { useForm } from "../../shared/hooks/form-hook";
//importing components
import Button from "../../shared/components/FormElements/Button/Button";
import Input from "../../shared/components/FormElements/Input/Input";
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
//importing context
import { AuthContext } from "../../shared/context/auth-context";

const Authenticate = () => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true)

    const [formState, inputHandler, setFormData ] = useForm({
        email: {
            value: '',
            isValid: false
        },
        password: {
            value: '',
            isValid: false
        }
    }, false);

    const switchModeHandler = () => {
        if (!isLoginMode) {
            setFormData({
                ...formState.inputs,
                name: undefined
            }, formState.inputs.email.isValid && formState.inputs.password.isValid)
        } else {
            setFormData({
                ...formState.inputs,
                name: {
                    value: '',
                    isValid: false
                }
            }, false)
        }

        setIsLoginMode(prevMode => !prevMode );
    };

    const authSubmitHandler = event => {
        event.preventDefault();
        auth.login();
        console.log(formState); //send this to the backend
    }

    return (
        <form className='place-form' onSubmit={authSubmitHandler}>
            { !isLoginMode &&
                <Input element="input"
                       id='name'
                       type='text'
                       label='Name'
                       validators={[VALIDATOR_REQUIRE()]}
                       onInput={inputHandler}
                       errorText='Please enter a valid name.'/>}
            <Input element="input"
                   id='email'
                   type='text'
                   label='Email'
                   validators={[VALIDATOR_EMAIL()]}
                   onInput={inputHandler}
                   errorText='Please enter a valid email.'/>
            <Input element="input"
                   id='password'
                   label='Password'
                   type='password'
                   validators={[VALIDATOR_MINLENGTH(6)]}
                   onInput={inputHandler}
                   errorText='Please enter a valid password. (at least 6 character)'/>
            <Button type='submit' disabled={!formState.isValid}>{isLoginMode ? 'LOGIN' : 'SIGNUP'}</Button>
            <Button inverse onClick={ switchModeHandler }>{isLoginMode ? 'SIGNUP' : 'LOGIN'}</Button>
        </form>
    );
};

export default Authenticate;
