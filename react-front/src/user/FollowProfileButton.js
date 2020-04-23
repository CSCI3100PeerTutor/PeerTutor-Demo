import React, { Component } from 'react'
import {follow, unfollow} from './apiUser'

export default class FollowProfileButton extends Component {

    followClick = () => {
        this.props.onButtonClick(follow)
    }

    unfollowClick = () => {
        this.props.onButtonClick(unfollow)
    }

    render() {
        return (
            <div className="d-inline-block " >
                {
                    !this.props.following ? 
                    (
                        <button onClick={this.followClick} className="btn btn-success btn-outline mr-5">
                            Follow
                        </button>
                    ) : (
                        <button onClick={this.unfollowClick} className="btn btn-dark btn-outline">
                            Unfollow
                         </button>
                    )
                }
                
                
            </div>
        )
    }
}
