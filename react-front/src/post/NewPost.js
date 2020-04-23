import React, { Component } from 'react'
import {isAuthenticated} from "../auth"
import { create } from './apiPost'
import { Redirect } from 'react-router-dom'

export default class NewPost extends Component {

    constructor() {
        super()
        this.state = {
            title: "",
            body: "",
            postType: "",
            error: "",
            user: {},
            redirectToProfile: false
        }
    }


    componentDidMount() {
        this.postData = new FormData();
        this.setState({user: isAuthenticated().user})
    };

    // client side validation, check for input
    isValid = () => {
        const {title, body, postType} = this.state
        // empty name
        if(title.length === 0 || body.length === 0) {
            this.setState({error: "All fields are required"})
            return false
        }
        if(title.length > 20) {
            this.setState({error: "Subject must be less than 20 characters"})
            return false
        }
        if(postType !== "teach" && postType !== "learn") {
            this.setState({error: "type must be either teach or learn"})
            return false
        }
        return true
    }   

    // populate the user input into the state (onChange)
    handleChange = (name) => (event) => {
        // //this.setState({ error: "" });
        // this.userData.set(name, event.target.value)
        this.setState({ [name]: event.target.value})
    }
    
    // take the data from this.state and send it to backend
    clickSubmit = event => {
        event.preventDefault();
        const {title, body, postType} = this.state
        const post = {
            title,
            body,
            postType
        }
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
        
            create(userId, token, post).then(data => {
                if (data.error) {
                this.setState({ error: data.error });
                } else {
                    this.setState({title: "", body: "", postType: "", redirectToProfile: true})
                };
                })
          }
      }
    

    newPostForm = (title, body, postType) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Subject</label>
                <input 
                    onChange= {this.handleChange("title")} 
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
        
            <div className='form-group'>
                <label className='text-muted'>Body</label>
                <textarea
                    onChange= {this.handleChange("body")} 
                    type="text" 
                    className="form-control"
                    value={body}
                />
            </div>
          
            <button 
            onClick= {this.clickSubmit} 
            className="btn btn-raised btn-primary">
                Create Post
            </button>
        </form>
    )


    render() {
        const { title, body, postType, error, redirectToProfile} = this.state;

        if(redirectToProfile) {
            return <Redirect to={`/user/${isAuthenticated().user._id}`} />
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create new post</h2>

                <div 
                    className="alert alert-danger" 
                    style={{display: error ? "" : "none"}}
                > 
                    {error}
                </div>
                {this.newPostForm(title, body, postType)}
            </div>
        )
    }
}

