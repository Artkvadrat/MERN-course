import React, { useEffect, useState } from 'react';
import './UpdatePlace.css';
//import custom hook
import { useForm } from "../../../shared/hooks/form-hook";
//importing components
import { useParams } from 'react-router-dom';
import Input from "../../../shared/components/FormElements/Input/Input";
import Button from "../../../shared/components/FormElements/Button/Button";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../../shared/util/validators";

const DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Place title',
        description: 'Place description',
        image: 'https://images.pexels.com/photos/3787903/pexels-photo-3787903.jpeg?cs=srgb&dl=pexels-bongkarn-thanyakij-3787903.jpg&fm=jpg',
        address: 'Nowhere',
        creatorId: 'u1',
        coordinates: {
            lat: -34.397,
            lng: 150.644
        }
    },
    {
        id: 'p1',
        title: 'Place title',
        description: 'Place description',
        image: 'https://images.pexels.com/photos/3787903/pexels-photo-3787903.jpeg?cs=srgb&dl=pexels-bongkarn-thanyakij-3787903.jpg&fm=jpg',
        address: 'Nowhere',
        creatorId: 'u2',
        coordinates: 'Somwhere'
    }
]

const UpdatePlace = () => {

    const [isLoading, setIsLoading] = useState(true);
    const placeID = useParams().placeId;

    const [ formState, inputHandler, setFormData ] = useForm({
        title: {
            value: '',
            isValid: false
        },
        description: {
            value: '',
            isValid: false
        },
    }, false);

    const identifiedPlace = DUMMY_PLACES.find(item => item.id === placeID );

    useEffect(() => {
        if (identifiedPlace) {
            setFormData({
                title: {
                    value: identifiedPlace.title,
                    isValid: true
                },
                description: {
                    value: identifiedPlace.description,
                    isValid: false
                },
            }, true);
        }
        setIsLoading(false)
    }, [setFormData, identifiedPlace])

    const placeUpdateSubmitHandler = event => {
        event.preventDefault();
        console.log(formState.inputs);
    }

    if (!identifiedPlace) {
        return <h2>Couldn't find place!</h2>
    }

    if (isLoading) {
        return <h2>Loading...</h2>
    }

    return (
        <form action="" className='place-form' onSubmit={placeUpdateSubmitHandler}>
            <Input id='title'
                   element='input'
                   type='text'
                   label='Title'
                   validators={[VALIDATOR_REQUIRE()]}
                   errorText='Please, enter valid text'
                   onInput={inputHandler}
                   initialValue={formState.inputs.title.value}
                   initialValid={formState.inputs.title.isValid}/>
            <Input id='description'
                   element='textarea'
                   label='Description'
                   validators={[VALIDATOR_MINLENGTH(5)]}
                   errorText='Please, enter valid description'
                   onInput={inputHandler}
                   initialValue={formState.inputs.description.value}
                   initialValid={formState.inputs.description.isValid}/>
            <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
        </form>
    );
};

export default UpdatePlace;
