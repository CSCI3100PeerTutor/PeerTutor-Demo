import React, { Component } from 'react'
import { list } from "./apiPost";
import {Link} from "react-router-dom"

export default class Posts extends Component {

    // create state
    constructor() {
        super()
        this.state = {
            posts: []
        };
    }

    componentDidMount() {
        // list method to list all the users
        list().then(data => {
            if(data.error) {
                console.log(data.error)
            } else {
                this.setState({posts: data})
            }
        });
    }

    renderPosts = posts => {
        return (
            <div className="row">
                {posts.map((post, i) => {
                    const posterId = post.postedBy
                        ? `/user/${post.postedBy._id}`
                        : "";
                    const posterName = post.postedBy
                        ? post.postedBy.name
                        : " Unknown";

                    return (
                        <div className="card col-md-4" key={i}>
                            <div className="card-body.">
                                <h5 className="card-title">{post.title}</h5>
                                <p className="card-text">
                                    {post.body.substring(0, 100)}
                                </p>
                                <br />
                                <p className="font-italic mark">
                                    Posted by{" "}
                                    <Link to={`${posterId}`}>
                                        {posterName}{" "}
                                    </Link>
                                    on {new Date(post.created).toDateString()}
                                </p>
                                <Link
                                    to={`/post/${post._id}`}
                                    className="align-self-end btn btn-raised btn-secondary btn-sm"
                                    
                                >
                                    Read more
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };
    

    render() {
        const {posts} = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Recent Posts </h2>

                {this.renderPosts(posts)}
            </div>
        )
    }
}
