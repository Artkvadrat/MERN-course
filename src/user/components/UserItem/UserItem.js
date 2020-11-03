import React from 'react';
import './UserItem.css';
//importing components
import { Link } from "react-router-dom";
import Card from "../../../shared/components/Card/Card";


/*
* Transform data into li item with all information.
*
* @param {data} object with following keys : {
*   @param {id} string,
*   @param {name} string,
*   @param {image} string,
*   @param {places} array
* }
*
* @return <li> component ;
*
* */

const UserItem = ({data}) => {
    const {id, name, image, places } = data;
    return (
        <li key={id} className='userCardContainer'>
            <Link to={`/api/places/user/${id}`}>
                <div className='userCard'>
                    <Card>
                        <div className='userImage'>
                            <img src={image} alt={name}/>
                        </div>
                        <div className='userInfo'>
                            <p>{name}</p>
                            <p>{places.length} {(places.length===1) ? 'place' : 'places'}</p>
                        </div>
                    </Card>
                </div>
            </Link>
        </li>
    );
};

export default UserItem;
