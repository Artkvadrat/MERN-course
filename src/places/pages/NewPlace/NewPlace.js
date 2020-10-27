import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';
import './NewPlace.css';
//importing components
import Input from "../../../shared/components/FormElements/Input/Input";
import Button from "../../../shared/components/FormElements/Button/Button";
import ErrorModal from "../../../shared/components/Modal/ErrorModal";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/LoadingSpinner";
//import custom hooks
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
//import context
import { AuthContext } from "../../../shared/context/auth-context";
//importing validators
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../../shared/util/validators";

const NewPlace = () => {

    const auth = useContext(AuthContext);
    const { sendRequest, error, isLoading, clearError } = useHttpClient();

    const [formState, inputHandler] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
        address: {
            value: '',
            isValid: false
        }
    }, false);

    const history = useHistory();

    const placeSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                'http://localhost:5000/api/places',
                'POST',
                {
                    title:  formState.inputs.title.value,
                    description:  formState.inputs.description.value,
                    address:  formState.inputs.address.value,
                    creator: auth.userId
                },
                {
                    'Content-Type': 'application/json'
                }
            );
            history.push('/');
        } catch (err) {
            console.error(err);
        }

    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            <form className='place-form' onSubmit={placeSubmitHandler}>
                {isLoading && <LoadingSpinner asOverlay/>}
                <Input element="input"
                       id='title'
                       type='text'
                       label='Title'
                       validators={[VALIDATOR_REQUIRE()]}
                       onInput={inputHandler}
                       errorText='Please enter a valid title.'/>
                <Input element="textarea"
                       id='description'
                       label='Description'
                       validators={[VALIDATOR_MINLENGTH(5)]}
                       onInput={inputHandler}
                       errorText='Please enter a valid description. (at least 5 character)'/>
                <Input element="input"
                       id='address'
                       label='Address'
                       validators={[VALIDATOR_REQUIRE()]}
                       onInput={inputHandler}
                       errorText='Please enter a valid address'/>
                <Button type='submit' disabled={!formState.isValid}>ADD PLACE</Button>
            </form>
        </React.Fragment>
    );
};

export default NewPlace;
