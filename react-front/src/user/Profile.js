import React, { Component } from 'react'
import {isAuthenticated} from "../auth"
import { Redirect, Link } from 'react-router-dom'
import { read } from './apiUser'
import DefaultProfile from "../images/default_profile.jpg"
import DeleteUser from './DeleteUser'
import FollowProfileButton from "./FollowProfileButton"
import ProfileTabs from "./ProfileTabs"
import {listByUser} from "../post/apiPost"

export default class Profile extends Component {

    constructor() {
        super()
        this.state = {
            user: {following: [], followers: []},
            redirectToSignin: false,
            following: false,
            error: "",
            posts: []
        }
    }

    // check follow status
    checkFollow = (user) => {
        const jwt = isAuthenticated()
        const match = user.followers.find(follower => {
            // one id has many other followers id
            return follower._id === jwt.user._id
        })
        return match
    }

    //make post request to backend for follow status update
    clickFollowButton = callApi => {
        const userId = isAuthenticated().user._id
        const token = isAuthenticated().token
        callApi(userId, token, this.state.user._id)
        .then(data => {
            if(data.error) {
                this.setState({error: data.error})
            } else {
                // alter following status
                this.setState({user: data, following: !this.state.following})
            }
        })
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => { 
            if(data.error) {
                // redirect the user to sign in page
                this.setState({redirectToSignin: true})
            } else {
                let following = this.checkFollow(data) // either T or F
                // populate the state with returned data, and update following
                this.setState({ user: data, following })
                // pass userId to listByUser method
                this.loadPosts(data._id)
            }
        })
    }

    loadPosts = userId => {
        const token = isAuthenticated().token
        listByUser(userId, token).then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({ posts: data})
            }
        })
    }

    // when page first loads
    componentDidMount() {
        const userId = this.props.match.params.userId
        this.init(userId);
    }

    // when there's changes componentDidUpdate
    UNSAFE_componentWillReceiveProps(props) {
        const userId = props.match.params.userId
        this.init(userId);
    }

    render() {
        // redirect to sign in page
        const {redirectToSignin, user, posts} = this.state;
        if(redirectToSignin) return <Redirect to="/signin" />

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Profile</h2>
                <div className="row">
                    <div className="col-md-4">
                        <img 
                            style={{ height: "200px", width: "auto" }}
                            className="img-thumbnail" 
                            src={DefaultProfile} 
                            alt={user.name} 
                        />
                    </div>
                    <div className="col-md-6">
                        <div className="lead">
                            <p>Name: {user.name}</p>
                            <p>Email: {user.email}</p>
                            <p>{`Joined ${new Date(user.created).toDateString()}`} </p>
                        </div>
                    {isAuthenticated().user && (isAuthenticated().user._id === user._id) ? (
                        <div className="inline-block.mt-5">
                            <Link 
                                className="btn btn-raised btn-info mr-5"
                                to={`/user/edit/${user._id}`}>
                                Edit profile
                            </Link>
                            <DeleteUser userId={user._id}/>
                        </div>
                    ) : (
                        <FollowProfileButton 
                            following={this.state.following}
                            onButtonClick={this.clickFollowButton}
                        />
                    )}

                    

                    </div>
                </div>
                <div className="row">
                    <div className="col md-12 mt-5 mb-5" >
                        <hr />
                            <p className="lead">{user.about}</p>
                        <hr />

                        <ProfileTabs 
                        followers={user.followers} 
                        following={user.following} 
                        posts={posts}
                        />
                    </div>
                </div>
            </div>
        )
    }
}
