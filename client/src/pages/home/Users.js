import React from 'react'
import classNames from 'classnames';
import { Col, Image } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client'
import { useMessageDispatch, useMessageState } from '../../context/message'



const GET_USERS = gql`
    query getUsers{
        getUsers{
            username 
            createdAt 
            imageUrl
            latestMessage{
                uuid 
                from 
                to 
                content 
                createdAt
            }
        }
    }
`

export default function Users() {
    const dispatch = useMessageDispatch();
    const { users } = useMessageState();
    const selectedUser = users?.find( u => u.selected === true)?.username

    const { loading } = useQuery(GET_USERS, {
        onCompleted: data => dispatch({ type: 'SET_USERS', payload: data.getUsers }),
        onError: err => console.log(err)
    });

    let usersMarkup
    if(!users || loading ){
        usersMarkup = <p>Loading... </p>
    } else if (users.length === 0){
        usersMarkup = <p>No users have joined yet </p>
    } else if (users.length > 0){
        usersMarkup = users.map((user) => { 
            const selected = selectedUser === user.username;
            return (
                <div 
                    role="button"
                    className={classNames("d-flex p-3 user-div bg-secondary", { 'bg-white': selected })}
                    onClick={() => dispatch({ type: 'SET_SELECTED_USER', payload: user.username })}
                    key={user.username}>
                    <Image 
                        src={user.imageUrl} 
                        roundedCircle 
                        className="mr-2" 
                        style={{width:50, height:50, objectFit:'cover'}}/>
                    <div>
                        <p className="text-success">{user.username}</p>
                        <p className="font-weight-light">{user.latestMessage ? user.latestMessage.content : 'you are connected'}</p>
                    </div>
                </div>)
        })
    }


    return (
        <Col xs={4} className="p-0 ">
            {usersMarkup}
        </Col>
    )
}
