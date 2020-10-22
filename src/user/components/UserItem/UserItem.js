import React from 'react';
import './UserItem.css';
//importing components
import { Link } from "react-router-dom";
import Card from "../../../shared/components/Card/Card";

const UserItem = ({data}) => {
    const {id, name, image, places } = data;
    return (
        <li key={id} className='userCardContainer'>
            <Link to={`/${id}/places`}>
                <div className='userCard'>
                    <Card>
                        <div className='userImage'>
                            <img src={image} alt={name}/>
                        </div>
                        <div className='userInfo'>
                            <p>{name}</p>
                            <p>{places} {(places===1) ? 'place' : 'places'}</p>
                        </div>
                    </Card>
                </div>
            </Link>
        </li>
    );
};

export default UserItem;
