import React, { Component } from 'react'
import { list } from "./apiUser";
import DefaultProfile from "../images/default_profile.jpg"
import {Link} from "react-router-dom"

export default class Users extends Component {

    // create state
    constructor() {
        super()
        this.state = {
            users: []
        };
    }

    componentDidMount() {
        // list method to list all the users
        list().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({users: data})
            }
        });
    }

    renderUsers = (users) => (
        <div className="row">
            {users.map((user, i) => (
                <div className="card col-md-3" key={i}>
                    <img 
                        style={{ height: "200px", width: "auto" }}
                        className="img-thumbnail" 
                        src={DefaultProfile} 
                        alt={user.name} 
                    />
                    <div className="card-body">
                        <h5 className="card-title">
                            {user.name}
                        </h5>
                        <p className="card-text">
                            {user.email}
                        </p>
                        <Link to={`/user/${user._id}`} className="btn btn-raised btn-secondary">
                            View profile
                        </Link>
                    </div>
                </div>
            )
            )}
        </div>
    )

    render() {
        const {users} = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Users </h2>

                {this.renderUsers(users)}
            </div>
        )
    }
}
