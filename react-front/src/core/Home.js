import React from 'react';
import Posts from '../post/Posts'

const Home = () => (
    <div>
        <div className="jumbotron">
            <h2>PeerTutor</h2>
            <hr/>
            <p className="lead">Welcome to the frontpage</p>
            <p className="lead">Start looking for tutors or tutees now</p>
        </div>
        <div className= "container">
            <Posts />
        </div>
    </div>
);

export default Home;