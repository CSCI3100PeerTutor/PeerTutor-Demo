import React, { Component } from 'react'
import {singlePost, remove} from "./apiPost"
import {Link, Redirect} from "react-router-dom"
import {isAuthenticated} from "../auth"
import Comment from "./Comment"

export default class SinglePost extends Component {

    state = {
        post: "",
        redirectToHome: false,
        redirectToSignin: false, 
        comments: []
    }
    // populate the state (somehowcomment is not populated when page loads)
    componentDidMount = () =>{
        const postId = this.props.match.params.postId
        
        singlePost(postId).then(data => {
            console.log("This is the comments array: ", data.comments)
            console.log("This is the data: ", data)
            if(data.error) {
                console.log(data.error)
            }
            this.setState({
                post: data,
                comments: data.comments,
            })
        })
    }

    deletePost = () => {
        const postId = this.props.match.params.postId;
        const token = isAuthenticated().token;
        remove(postId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.setState({ redirectToHome: true });
            }
        });
    };

    deleteConfirmed = () => {
        let answer = window.confirm('Are you sure you want to delete your post?');
        if (answer) {
            this.deletePost();
        }
    };
    
    updateComments = comments => {
        this.setState({comments})
    }

    renderPost = (post) => {
        // in case post has no author
        const posterId = post.postedBy
            ? `/user/${post.postedBy._id}`
            : "";
        const posterName = post.postedBy
            ? post.postedBy.name
            : " Unknown";
        return (
                <div className="card-body">
                    <p className="card-text">
                        {post.body}
                    </p>
                    <br />
                    <p className="font-italic mark">
                        Posted by{" "}
                        <Link to={`${posterId}`}>
                            {posterName}{" "}
                        </Link>
                        on {new Date(post.created).toDateString()}
                    </p>
                    <div className="d-inline-block">
                        <Link
                            to={"/"}
                            className="btn btn-raised btn-primary btn-sm mr-5">
                            Back to frontpage
                        </Link>
                        
                        {isAuthenticated().user && isAuthenticated().user._id === posterId.slice(6,) && (
                            <>
                                <Link to={`/post/edit/${post._id}`} className="btn btn-raised btn-info btn-sm mr-5">
                                    Update Post
                                </Link>
                                <button onClick={this.deleteConfirmed} className="btn btn-raised btn-dark btn-sm">
                                    Delete Post
                                </button>
                            </>
                        )}
                    </div>
                </div>                    
        )
    }


    render() {
        const {post, redirectToHome, redirectToSignin, comments } = this.state;

        if (redirectToHome) {
            return <Redirect to={`/`} />;
        } else if (redirectToSignin) {
            return <Redirect to={`/signin`} />;
        }

        return (
            <div className="container"> 
                <h2 className="display-2 mt-5 mb-5">{post.title}</h2>
                {this.renderPost(post)}
                <hr/>
                <Comment 
                    postId={post._id} 
                    comments={comments} 
                    updateComments={this.updateComments} 
                />
            </div>
        )
    }
}
