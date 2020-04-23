import React, { Component } from 'react'
import {isAuthenticated} from "../auth"
import { read, update, updateUser} from './apiUser'
import { Redirect } from 'react-router-dom'

export default class EditProfile extends Component {

    constructor() {
        super()
        this.state = {
            id: "",
            name: "",
            email: "",
            password: "",
            error: "",
            redirectToProfile: false,
            about: ""
        }
    }

    init = (userId) => {
        const token = isAuthenticated().token
        read(userId, token)
        .then(data => { 
            if(data.error) {
                // redirect the user to sign in page
                this.setState({redirectToProfile: true})
            } else {
                // populate the state with returned data
                this.setState({ id: data._id, 
                                name: data.name, 
                                email: data.email, 
                                error: "",
                                about: data.about
                            })
            }
        })
    };
    // populate the state with user profile when the page loads
    componentDidMount() {
        const userId = this.props.match.params.userId;
        this.init(userId);
    };

    // client side validation, check for input
    isValid = () => {
        const {name, email, password} = this.state
        // empty name
        if(name.length === 0) {
            this.setState({error: "Name is required"})
            return false
        }
        // check cuhk email
        if(!/^\d{10}@link.cuhk.edu.hk/.test(email)) {
            this.setState({error: "Email must be valid CUHK email"})
            return false
        }
        // check password (note password can be left empty i.e. no change)
        if(password.length >= 1 && password.length <=5 ) {
            this.setState({error: "Password must be at least 6 characters and contain at least a digit"})
            return false
        }
        return true
    }   

    // populate the user input into the state (onChange)
    handleChange = (name) => (event) => {
        // when it is called from name. the name == name, if called from email, name == email etc.
        this.setState({ [name]: event.target.value });
    }
    
    // take the data from this.state and send it to backend
    clickSubmit = event => {
        event.preventDefault();
        const {name, email, password, about} = this.state
        const user = {
            name,
            email,
            about,
            password: password || undefined,
        }
        if (this.isValid()) {
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;
        
            update(userId, token, user).then(data => {
                if (data.error) {
                this.setState({ error: data.error });
                } else {
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true
                        })
                });
                }
          });
      }
    };

    signupForm = (name, email, password, about) => (
        <form>
            <div className='form-group'>
                <label className='text-muted'>Name</label>
                <input 
                    onChange= {this.handleChange("name")} 
                    type="text" 
                    className="form-control"
                    value={name}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Email (CUHK email only)</label>
                <input 
                    onChange= {this.handleChange("email")} 
                    type="email" 
                    className="form-control"
                    value={email}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>About</label>
                <textarea
                    onChange= {this.handleChange("about")} 
                    type="text" 
                    className="form-control"
                    value={about}
                />
            </div>
            <div className='form-group'>
                <label className='text-muted'>Password (must contain a digit)</label>
                <input 
                    onChange= {this.handleChange("password")} 
                    type="password" 
                    className="form-control"
                    value={password}
                />
            </div>
            <button 
            onClick= {this.clickSubmit} 
            className="btn btn-raised btn-primary">
                Update
            </button>
        </form>
    )


    render() {
        const { id, name, email, password, redirectToProfile, error, about} = this.state;

        if(redirectToProfile) {
            return <Redirect to={`/user/${id}`} />
        }

        

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Edit Profile</h2>

                <div className="alert alert-danger" style={{display: error ? "" : "none"}}> 
                    {error}
                </div>

                {this.signupForm(name, email, password, about)}
            </div>
        )
    }
}

