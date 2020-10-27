import React from 'react';
import './UsersList.css'
//importing components
import UserItem from "../UserItem/UserItem";
import Card from "../../../shared/components/Card/Card";

/*
*
* Receive an array of users and transform it in array
* of <li> tags with data through <UserItem/> component
*
* @param {items} array
* @return <ul> component
*
* */

const UserList = ({items}) => {
    if (items.length === 0) {
        return (
            <div className="center">
                <Card>
                    <h2>No Users found!</h2>
                </Card>
            </div>
        )
    }

    return (
        <ul>
            {items.map( user => {
                return <UserItem key={ user.id } data={user} />
            })}
        </ul>
    )
};

export default UserList;
