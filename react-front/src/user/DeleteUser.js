import React, { Component } from 'react'
import {isAuthenticated} from "../auth"
import {remove} from "./apiUser"
import {signout} from "../auth"
import { Redirect } from 'react-router-dom';

export default class DeleteUser extends Component {

    state = {
        redirect: false
    };

    deleteAccount = () => {
        const token = isAuthenticated().token
        console.log("this is token: ", token)
        const userId = this.props.userId
        console.log("this is userId: ", userId)
        remove(userId, token)
        .then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                // signout user
                signout(() => console.log("User is deleted"));
                //redirect
                this.setState({redirect: true})
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm("This will delete you account, are you sure?");
        if(answer) {
            this.deleteAccount();
        }
    };

    render() {
        if(this.state.redirect) {
            return <Redirect to="/" />
        }
        return (
            <button onClick={this.deleteConfirmed}  className="btn btn-raised btn-dark">
                Delete profile
            </button>
        )
    }
}
