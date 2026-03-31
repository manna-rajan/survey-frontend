import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container vh-100 d-flex justify-content-center align-items-center">
            <div className="text-center">
                <h1 className="display-4 mb-3">Welcome to the Survey App</h1>
                <p className="lead mb-5">
                    Your one-stop solution for conducting and managing move assessment surveys.
                </p>
                <div className="d-grid gap-3 d-sm-flex justify-content-sm-center">
                    <Link to="/admin/signin" className="btn btn-outline-primary btn-lg px-4 gap-3">
                        Admin Portal
                    </Link>
                    <Link to="/surveyer/signin" className="btn btn-outline-secondary btn-lg px-4">
                        Surveyer Portal
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Home;