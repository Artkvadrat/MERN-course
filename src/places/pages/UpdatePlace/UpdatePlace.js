import React, { useEffect, useState, useContext } from 'react';
import './UpdatePlace.css';
//import custom hooks
import { useForm } from "../../../shared/hooks/form-hook";
import { useHttpClient } from "../../../shared/hooks/http-hook";
import { AuthContext } from "../../../shared/context/auth-context";
//importing components
import { useParams, useHistory } from 'react-router-dom';
import Input from "../../../shared/components/FormElements/Input/Input";
import Button from "../../../shared/components/FormElements/Button/Button";
import {VALIDATOR_MINLENGTH, VALIDATOR_REQUIRE} from "../../../shared/util/validators";
import ErrorModal from "../../../shared/components/Modal/ErrorModal";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/LoadingSpinner";

const UpdatePlace = () => {
    const auth = useContext(AuthContext);
    const { isLoading, error, sendRequest, clearError } = useHttpClient();
    const placeID = useParams().placeId;
    const [loadedPlace, setLoadedPlace] = useState();
    const history = useHistory();

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

    useEffect(() => {
        const updatePlace = async () => {
            try {
                const responseData = await sendRequest(
                    `http://localhost:5000/api/places/${placeID}`
                );

                setLoadedPlace(responseData.place);

                setFormData(
                    {
                        title: {
                            value: loadedPlace.title,
                            isValid: true
                        },
                        description: {
                            value: loadedPlace.description,
                            isValid: true
                        }
                    },
                    true
                )
            } catch (err) {
                console.error(err);
            }
        }
        updatePlace();
    }, [sendRequest, placeID, setFormData]);

    const placeUpdateSubmitHandler = async event => {
        event.preventDefault();
        try {
            await sendRequest(
                `http://localhost:5000/api/places/${placeID}`,
                'PATCH',
                {
                    title: formState.inputs.title.value,
                    description: formState.inputs.description.value
                },
                {
                    'Content-Type': 'application/json'
                }
            );
            history.push('/api/places/user/' + auth.userId);
        } catch (err) {
            console.error(err);
        }

    }

    if (isLoading) {
        return (
            <div className='center'>
                <LoadingSpinner asOverlay/>
            </div>
        )
    }

    if (!loadedPlace && !error) {
        return (
            <div className='center'>
                <h2>Could not find place</h2>
            </div>
        )
    }

    return (
        <React.Fragment>
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && loadedPlace && <form action="" className='place-form' onSubmit={placeUpdateSubmitHandler}>
                <Input id='title'
                       element='input'
                       type='text'
                       label='Title'
                       validators={[VALIDATOR_REQUIRE()]}
                       errorText='Please, enter valid text'
                       onInput={inputHandler}
                       initialValue={loadedPlace.title}
                       initialValid={true}/>
                <Input id='description'
                       element='textarea'
                       label='Description'
                       validators={[VALIDATOR_MINLENGTH(5)]}
                       errorText='Please, enter valid description'
                       onInput={inputHandler}
                       initialValue={loadedPlace.description}
                       initialValid={true}/>
                <Button type='submit' disabled={!formState.isValid}>UPDATE PLACE</Button>
            </form>}
        </React.Fragment>
    );
};

export default UpdatePlace;
