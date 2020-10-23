import React from 'react';
import UserList from "../components/UsersList/UsersList";

const Users = () => {
    const USERS = [
        {id: 'u1',
            name: 'Nabok Daniel',
            image: 'https://images.pexels.com/photos/839011/pexels-photo-839011.jpeg?cs=srgb&dl=pexels-andrea-piacquadio-839011.jpg&fm=jpg',
            places: 3}
        ]
    return (
        <div>
            <UserList items={USERS}/>
        </div>
    );
};

export default Users;
