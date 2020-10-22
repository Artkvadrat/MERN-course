import React from 'react';
import './NewPlace.css';
//importing components
import Input from "../../../shared/components/FormElements/Input/Input";
import Button from "../../../shared/components/FormElements/Button/Button";
//import custom hook
import { useForm } from "../../../shared/hooks/form-hook";
//importing validators
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../../shared/util/validators";

const NewPlace = () => {

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
    }, false)

    const placeSubmitHandler = event => {
        event.preventDefault();
        console.log(formState); //send this to the backend
    }

    return (
        <form className='place-form' onSubmit={placeSubmitHandler}>
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
    );
};

export default NewPlace;
