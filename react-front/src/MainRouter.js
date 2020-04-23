import React from 'react';
import {Route, Switch} from 'react-router-dom';
import Home from "./core/Home";
import Signup from "./user/Signup";
import Signin from "./user/Signin";
import Menu from "./core/Menu";
import Profile from "./user/Profile";
import Users from "./user/Users"
import EditProfile from "./user/EditProfile"
import NewPost from "./post/NewPost"
import SinglePost from "./post/SinglePost"
import EditPost from "./post/EditPost"
import PrivateRoute from "./auth/PrivateRoute"



const MainRouter = () => (
    <div>
        <Menu />
        <Switch> 
            {/** User is redirected to sign in page if not authenticated while visiting the following PrivateRoutes */}
            <Route exact path="/" component={Home}></Route>
            
            <PrivateRoute exact path="/post/edit/:postId" component={EditPost}></PrivateRoute>
            <Route exact path="/users" component={Users}></Route>
            <Route exact path="/signup" component={Signup}></Route>
            <Route exact path="/signin" component={Signin}></Route>
            <PrivateRoute exact path="/user/edit/:userId" component={EditProfile}></PrivateRoute>
            <PrivateRoute exact path="/user/:userId" component={Profile}></PrivateRoute>
            <PrivateRoute exact path="/post/create" component={NewPost}></PrivateRoute>
            <Route exact path="/post/:postId" component={SinglePost}></Route>
        </Switch>
    </div>
)

export default MainRouter;