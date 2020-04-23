import React, { Component } from 'react'
import {signup} from "../auth"
import {Link} from "react-router-dom"

export default class Signup extends Component {
    // store user input into state
    constructor() {
        super()
        this.state = {
            name: "",
            email: "", 
            password: "",
            error: "",
            open: false 
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
        const {name, email, password} = this.state;
        const user = {
            name, // can just write name
            email,
            password
        };
        // console.log(user);

        // handle errors
        signup(user)
        .then(data => {
            if(data.error) this.setState({error: data.error}) // populate error to the state
            else // clear state
                this.setState({
                    error: "",
                    name: "",
                    email: "",
                    password: "",
                    open: true // signup successful
            })
        })
    };

    

    signupForm = (name, email, password) => (
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
            className="btn btn-raised btn-primary"
            >
                Submit
            </button>
        </form>
    )

    render() {
        // deconsturction 
        const { name, email, password, error, open } = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Sign up</h2>

                {/* display errors */}
                <div className="alert alert-danger" style={{display: error ? "" : "none"}}> 
                    {error}
                </div>

                {/* upon successful signup, display message */}
                <div className="alert alert-info" style={{display: open ? "" : "none"}}> 
                    New account is created, please <Link to="/signin">Sign in</Link>
                </div>

                {/* form for signup, refer to function above */} 
                {this.signupForm(name, email, password)}

            </div>
        );
    }
}

