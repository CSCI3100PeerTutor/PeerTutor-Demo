import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import {signin, authenticate} from "../auth"

export default class Signin extends Component {
    // store user input into state
    constructor() {
        super()
        this.state = {
            email: "", 
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false,
        }
    }

    // populate the user input into the state (onChange)
    // higher order function (function that returns a function)
    handleChange = (name) => (event) => {
        // whenever there's changes clear error
        this.setState({ error: "" })
        // when it is called from name. the name == name, if called from email, name == email etc.
        this.setState({[name]: event.target.value})
    }

    
    
    // take the data from this.state and send it to backend
    clickSubmit = (event) => {
        // prevent default behavior (reloads the page)
        event.preventDefault();
    
        const {email, password} = this.state;
        const user = {
            email,
            password
        };

        // handle errors
        signin(user)
        .then(data => {
            // populate error to the state
            if(data.error) this.setState({error: data.error}) 
            else {
                // authenticate user
                authenticate(data, () => {
                    // if authenticated, redirect
                    this.setState({redirectToReferer: true})
                })
                //redirect
            }
        })
    };

    

    signinForm = (email, password) => (
        <form>
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
                <label className='text-muted'>Password</label>
                <input 
                    onChange= {this.handleChange("password")} 
                    type="password" 
                    className="form-control"
                    value={password}
                />
            </div>
            <button 
            onClick= {this.clickSubmit} 
            className="btn btn-raised btn-primary"
            >
                Submit
            </button>
        </form>
    )

    render() {
        // deconsturction 
        const {email, password, error, redirectToReferer} = this.state;

        // redirect to the homepage after successful login
        if(redirectToReferer) {
            return <Redirect to= "/" />
        }

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Sign in</h2>

                {/* display errors */}
                <div className="alert alert-danger" style={{display: error ? "" : "none"}}> 
                    {error}
                </div>

                {/* form for signup, refer to function above */} 
                {this.signinForm(email, password)}

            </div>
        );
    }
}

