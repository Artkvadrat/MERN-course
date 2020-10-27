import React, { useEffect, useState } from 'react';

import UserList from "../components/UsersList/UsersList";
import ErrorModal from "../../shared/components/Modal/ErrorModal";
import LoadingSpinner from "../../shared/components/LoadingSpinner/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";

/*
*
* Components that sends fetch with method 'GET' to backend and receive an array of users.
*
* @return <UserList/> component
*
* */

const Users = () => {
    const [loadedUsers, setLoadedUsers] = useState();
    const { isLoading, error, sendRequest, clearError } = useHttpClient()

    useEffect(() => {
        // useEffect doesn't like promises, so should to create new async function inside of useEffect
        // it is 'cause useEffect must return a cleanup function of nothing
        const fetchUsers = async () => {
            try {
                //GET is default method and we don't send any data to backend
                const responseData = await sendRequest('http://localhost:5000/api/users');

                setLoadedUsers(responseData.users);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, [sendRequest]);

    return (
        <React.Fragment>
            {isLoading && <div className='center'>
                <LoadingSpinner asOverlay/>
            </div>}
            <ErrorModal error={error} onClear={clearError}/>
            {!isLoading && loadedUsers && <UserList items={loadedUsers}/>}
        </React.Fragment>
    );
};

export default Users;
