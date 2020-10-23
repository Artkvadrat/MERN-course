import React from 'react';
//importing components
import PlaceList from "../../components/PlaceList/PlaceList";
import { useParams } from 'react-router-dom';

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

const UserPlaces = () => {
    const userId = useParams().userID;
    const loadedPlaces = DUMMY_PLACES.filter( place => place.creatorId === userId );
    return (
        <div className='center'>
            <PlaceList items={loadedPlaces}/>
        </div>
    );
};

export default UserPlaces;
