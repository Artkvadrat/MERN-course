import React, { useState, useContext } from 'react';
import './Authenticate.css';
//import custom hooks
import { useForm } from "../../shared/hooks/form-hook";
import { useHttpClient } from "../../shared/hooks/http-hook";
//importing components
import Button from "../../shared/components/FormElements/Button/Button";
import Input from "../../shared/components/FormElements/Input/Input";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/components/Modal/ErrorModal";
//import validators
import {VALIDATOR_EMAIL, VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE } from "../../shared/util/validators";
//importing context
import { AuthContext } from "../../shared/context/auth-context";

/*
*
* Component that sends a fetch requests (login and signup)
* Redirects to 'users' page if entered params are valid,
* and don't redirect when params is invalid and throw error in modal
* window that something went wrong.
*
* */

const Authenticate = () => {
    const auth = useContext(AuthContext);

    const [isLoginMode, setIsLoginMode] = useState(true);

    const {isLoading, error, sendRequest, clearError} = useHttpClient()

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

    const authSubmitHandler = async (event) => {
        event.preventDefault();

        if (isLoginMode) {
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users/login',
                    'POST',
                    {
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    },
                    {
                        'Content-Type': 'application/json'
                    }
                );

                auth.login(responseData.user.id);
            } catch (err) {
                //console.error(err.message);
            }
        } else {
            try {
                const responseData = await sendRequest('http://localhost:5000/api/users/signup',
                    'POST',
                    {
                        name: formState.inputs.name.value,
                        email: formState.inputs.email.value,
                        password: formState.inputs.password.value
                    },
                    {'Content-Type': 'application/json'}
                );

                auth.login(responseData.user.id);
            } catch (err) {
                console.error(err.message);

            }
        }

    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <div className='auth'>
                {isLoading && <LoadingSpinner asOverlay/>}
                <h2>{isLoginMode ? 'Login please' : 'Signup please'}</h2>
                <hr/>
                <form onSubmit={authSubmitHandler}>
                    { !isLoginMode &&
                        <Input element="input"
                               id='name'
                               type='text'
                               label='Name'
                               validators={[VALIDATOR_REQUIRE()]}
                               onInput={inputHandler}
                               errorText='Please enter a valid name.'/>
                    }
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
                </form>
                <Button inverse onClick={ switchModeHandler }>{isLoginMode ? 'SWITCH TO SIGNUP' : 'SWITCH TO LOGIN'}</Button>
            </div>
        </React.Fragment>
    );
};

export default Authenticate;
