import React, { Component } from "react";
import { singlePost, update } from "./apiPost";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";

class EditPost extends Component {
    constructor() {
        super();
        this.state = {
            id: "",
            title: "",
            body: "",
            postType: "",
            redirectToProfile: false,
            error: "",
        };
    }

    init = postId => {
        singlePost(postId).then(data => {
            if (data.error) {
                this.setState({ redirectToProfile: true });
            } else {
                this.setState({
                    // id is not post.postedBy._id
                    id: data.postedBy._id,
                    title: data.title,
                    body: data.body,
                    postType: data.postType,
                    error: ""
                });
            }
        });
    };

    componentDidMount() {
        // this.postData = new FormData();
        const postId = this.props.match.params.postId;
        this.init(postId);
    }

    isValid = () => {
        const { title, body, postType} = this.state;
        if (title.length === 0 || body.length === 0) {
            this.setState({ error: "All fields are required", loading: false });
            return false;
        }
        if(title.length > 20) {
            this.setState({error: "Subject must be less than 20 characters"})
            return false
        }
        if(postType !== "teach" && postType !== "learn") {
            this.setState({error: "type must be either teach or learn"})
            return false
        }
        return true;
    };

    handleChange = name => event => {
        this.setState({ error: "" });
        // const value = name ===  event.target.value;
        // this.postData.set(name, value);
        this.setState({ [name]: event.target.value});
    };

    clickSubmit = event => {
        event.preventDefault();
        const {title, body, postType} = this.state
        const post = {
            title,
            body,
            postType
        }
        if (this.isValid()) {
            const postId = this.props.match.params.postId;
            const token = isAuthenticated().token;

            update(postId, token, post).then(data => {
                if (data.error) this.setState({ error: data.error });
                else {
                    this.setState({
                        title: "",
                        body: "",
                        postType: "",
                        redirectToProfile: true
                    });
                }
            });
        }
    };

    editPostForm = (title, body, postType) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input
                    onChange={this.handleChange("title")}
                    type="text"
                    className="form-control"
                    value={title}
                />
            </div>

            <div className='form-group'>
                <label className='text-muted'>Post Type (teach/learn)</label>
                <input 
                    onChange= {this.handleChange("postType")} 
                    type="text" 
                    className="form-control"
                    value={postType}
                />
            </div>

            <div className="form-group">
                <label className="text-muted">Body</label>
                <textarea
                    onChange={this.handleChange("body")}
                    type="text"
                    className="form-control"
                    value={body}
                />
            </div>

            <button
                onClick={this.clickSubmit}
                className="btn btn-raised btn-primary"
            >
                Update Post
            </button>
        </form>
    );

    render() {
        const {
            id,
            title,
            body,
            postType,
            redirectToProfile,
            error,
        } = this.state;

        if (redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />;
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">{title}</h2>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>

                {isAuthenticated().user.role === "admin" &&
                    this.editPostForm(title, body, postType)}

                {isAuthenticated().user._id === id &&
                    this.editPostForm(title, body, postType)}

                {isAuthenticated().user.role === "admin" ||
                    (isAuthenticated().user._id === id &&
                        this.editPostForm(title, body, postType))}
            </div>
        );
    }
}

export default EditPost;
