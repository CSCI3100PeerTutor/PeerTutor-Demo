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
        const {title, body} = this.state
        // empty name
        if(title.length === 0 || body.length === 0) {
            this.setState({error: "All fields are required"})
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
        const {title, body} = this.state
        const post = {
            title,
            body
        }
        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
        
            create(userId, token, post).then(data => {
                if (data.error) {
                this.setState({ error: data.error });
                } else {
                    this.setState({title: "", body: "", redirectToProfile: true})
                };
                })
          }
      }
    

    newPostForm = (title, body) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Title</label>
                <input 
                    onChange= {this.handleChange("title")} 
                    type="text" 
                    className="form-control"
                    value={title}
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
        const { title, body, user, error, redirectToProfile} = this.state;

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
                {this.newPostForm(title, body)}
            </div>
        )
    }
}

