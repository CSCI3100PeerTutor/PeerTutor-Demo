import React, { Component } from "react";
import { review, unreview } from "./apiUser";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaultProfile from "../images/default_profile.jpg";

class Review extends Component {
    state = {
        text: "",
        error: ""
    };

    handleChange = event => {
        this.setState({ error: "" });
        this.setState({ text: event.target.value });
    };

    isValid = () => {
        const { text } = this.state;
        if (!text.length > 0 || text.length > 200) {
            this.setState({
                error:
                    "review should not be empty and less than 200 characters long"
            });
            return false;
        }
        return true;
    };

    addreview = e => {
        e.preventDefault();

        if (!isAuthenticated()) {
            this.setState({ error: "Please signin to leave a review" });
            return false;
        }

        if (this.isValid()) {
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;

            review(userId, token, { text: this.state.text }).then(
                data => {
                    if (data.error) {
                        console.log(data.error);
                    } else {
                        this.setState({ text: "" });
                        // dispatch fresh list of coments to parent (SinglePost)
                        this.props.updateReviews(data.reviews);
                    }
                }
            );
        }
    };

    deleteReview = review => {
        const userId = isAuthenticated().user._id;
        const token = isAuthenticated().token;

        unreview(userId, token, review).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                this.props.updateReviews(data.reviews);
            }
        });
    };

    deleteConfirmed = review => {
        let answer = window.confirm(
            "Are you sure you want to delete your review?"
        );
        if (answer) {
            this.deleteReview(review);
        }
    };

    render() {
        const { reviews } = this.props;
        const { error } = this.state;

        return (
            <div>
                <h2 className="mt-5 mb-5">Leave a review</h2>

                <form onSubmit={this.addreview}>
                    <div className="form-group">
                        <input
                            type="text"
                            onChange={this.handleChange}
                            value={this.state.review}
                            className="form-control"
                            placeholder="Leave a review..."
                        />
                        
                        <button className="btn btn-raised btn-success mt-2">
                            Post
                        </button>
                    </div>
                </form>

                <div
                    className="alert alert-danger"
                    style={{ display: error ? "" : "none" }}
                >
                    {error}
                </div>
                <div className="col-md-12">
                    <h3 className="text-primary">{reviews.length} reviews</h3>
                    <hr />

                    {reviews.map((review, i) => (
                        <div key={i}>
                            <div>
                                <Link to={`/user/${review.postedBy._id}`}>
                                    <img
                                        style={{
                                            borderRadius: "50%",
                                            border: "1px solid black"
                                        }}
                                        className="float-left mr-2"
                                        height="30px"
                                        width="30px"
                                        onError={i =>
                                            (i.target.src = `${DefaultProfile}`)
                                        }
                                        src={`${
                                            process.env.REACT_APP_API_URL
                                        }/user/photo/${review.postedBy._id}`}
                                        alt={review.postedBy.name}
                                    />
                                </Link>
                                <div>
                                    <p className="lead">{review.text}</p>
                                    <p className="font-italic mark">
                                        Posted by{" "}
                                        <Link
                                            to={`/user/${review.postedBy._id}`}
                                        >
                                            {review.postedBy.name}{" "}
                                        </Link>
                                        on{" "}
                                        {new Date(
                                            review.created
                                        ).toDateString()}
                                        <span>
                                            {isAuthenticated().user &&
                                                isAuthenticated().user._id ===
                                                    review.postedBy._id && (
                                                    <>
                                                        <span
                                                            onClick={() =>
                                                                this.deleteConfirmed(
                                                                    review
                                                                )
                                                            }
                                                            className="text-danger float-right mr-1"
                                                        >
                                                            Remove
                                                        </span>
                                                    </>
                                                )}
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Review;
