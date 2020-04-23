export const signup = (user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json', 
            "Content-Type": 'application/json',
        },
        // body (user) must be processed 
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const signin = (user) => {
    return fetch(`${process.env.REACT_APP_API_URL}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json', 
            "Content-Type": 'application/json',
        },
        // body (user) must be processed 
        body: JSON.stringify(user)
    })
    .then(response => {
        return response.json()
    })
    .catch(err => console.log(err))
};

export const authenticate = (jwt, next) => {
    // make sure window is available
    if(typeof window !== "undefined") {
        // store the jwt token to the browser local storage
        localStorage.setItem("jwt", JSON.stringify(jwt));
        next(); // goes on and set the redirect to true
    }
};

export const signout = (next) => {
    // remove token from local storage (client side)
    if(typeof window !== "undefined") localStorage.removeItem("jwt")
    next()

    return fetch(`${process.env.REACT_APP_API_URL}/signout`, {
        method: "GET",
    })
    .then(response => {
        console.log("signout", response)
        return response.json()
    })
    .catch(err => console.log(err))
}

// check if user is authenticated
export const isAuthenticated = () => {
    if(typeof window == "undefined") {
        return false
    }

    if(localStorage.getItem("jwt")) {
        //console.log(JSON.parse(localStorage.getItem("jwt")))
        return JSON.parse(localStorage.getItem("jwt"))
    } else {
        return false
    }
}