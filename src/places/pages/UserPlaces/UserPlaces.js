import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
//importing components
import PlaceList from "../../components/PlaceList/PlaceList";
import ErrorModal from "../../../shared/components/Modal/ErrorModal";
import LoadingSpinner from "../../../shared/components/LoadingSpinner/LoadingSpinner";
import Button from "../../../shared/components/FormElements/Button/Button";
//import custom hook
import { useHttpClient } from "../../../shared/hooks/http-hook";

const UserPlaces = () => {

    const [loadedPlaces, setLoadedPlaces] = useState();
    const {isLoading, error, sendRequest, clearError} = useHttpClient();

    const userId = useParams().userID;

    useEffect(() => {
        const getPlaces = async () => {
            try {
                const responseData = await sendRequest(`http://localhost:5000/api/places/user/${userId}`);
                setLoadedPlaces(responseData.places);
                console.log(responseData);
            } catch (err) {
                console.error(err);
            }
        }
        getPlaces();
    }, [sendRequest, userId]);

    return (
        <div className='center'>
            {isLoading && <LoadingSpinner asOverlay/>}
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && loadedPlaces && <PlaceList items={loadedPlaces}/>}
        </div>
    );
};

export default UserPlaces;
