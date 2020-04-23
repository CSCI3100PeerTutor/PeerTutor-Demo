import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {signout, isAuthenticated} from "../auth"

const isActive = (history, path) => {
    if(history.location.pathname === path) return{color: "#000000"}
    else return {color: "#A4A4A4"}
}


const Menu = ({history}) => (
    <div>
        <ul className="nav nav-tabs navbar-dark bg-light">
            <li className="nav-item">
            <Link className="nav-link" 
                style={isActive(history, "/")} 
                to="/">
                    Home
            </Link>  
            </li>

            <li className="nav-item">
            <Link className="nav-link" 
                style={isActive(history, "/users")} 
                to="/users">
                    Users
            </Link>  
            </li>
            
            {!isAuthenticated() && (
                <>
                <li className="nav-item">
                <Link className="nav-link" 
                    style={isActive(history, "/signin")}
                    to="/signin">
                        Sign in
                </Link>
                </li>
                <li className="nav-item">
                <Link className="nav-link" 
                    style={isActive(history, "/signup")} 
                        to="/signup">
                            Sign up
                </Link>
                </li>
                </>
            )}

            {isAuthenticated() && (
                <>  
                <li className="nav-item">
                    <Link
                        to={"/post/create"}
                        style={isActive(history, "/post/create")}
                        className="nav-link"
                    >
                        Create Post
                    </Link>
                </li>

                <li className="nav-item">
                    <Link
                        to={`/user/${isAuthenticated().user._id}`}
                        style={isActive(history, `/user/${isAuthenticated().user._id}`)}
                        className="nav-link"
                    >
                        {`${isAuthenticated().user.name}'s profile`}
                    </Link>
                </li>
                <li className="nav-item">
                <a href="/#" className="nav-link" 
                    style={isActive(history, "/signout")} 
                    onClick={() => signout(() => history.push('/'))}
                    >
                        Sign out
                </a>
                </li>
                </>

            )}
            
        </ul>
    </div>
)


export default withRouter(Menu);

