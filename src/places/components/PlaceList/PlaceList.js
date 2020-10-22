import React from 'react';
import './PlaceList.css';
//importing components
import PlaceItem from "../PlaceItem/PlaceItem";
import Button from "../../../shared/components/FormElements/Button/Button";


const PlaceList = ({items}) => {
    if ( items.length === 0 ) {
        return (
            <div className='noPlaceContainer'>
                <h2>No places found! Maybe create one?</h2>
                <Button to='/places/new'>Share place</Button>
            </div>
        )
    }

    return (
        <ul className='place-list'>
            {items.map( item => <PlaceItem key={item.id}
                                            place={item} />)}
        </ul>
    )
};

export default PlaceList;
