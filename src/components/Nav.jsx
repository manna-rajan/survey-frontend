import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Nav = () => {
    const navigate = useNavigate();
    const adminId = sessionStorage.getItem("adminid");
    const surveyerId = sessionStorage.getItem("surveyerid");
    const isLoggedIn = adminId || surveyerId;

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
    };

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-primary rounded border border-warning-emphasis shadow-sm" data-bs-theme="dark">
                <div className="container-fluid">
                    <Link className="navbar-brand fw-bold text-white-emphasis outline-warning-emphasis" to="/">Survey App</Link>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
                        <div className="navbar-nav ms-auto gap-2 px-3">
                            {isLoggedIn ? (
                                <>
                                    {adminId && (
                                        <>
                                            <Link className="btn btn-outline-warning text-white-emphasis rounded-pill" to="/admin/dashboard">Admin Dashboard</Link>
                                            <Link className="btn btn-outline-warning text-white-emphasis rounded-pill" to="/admin/add-surveyer">Add Surveyer</Link>
                                            <Link className="btn btn-outline-warning text-white-emphasis rounded-pill" to="/admin/review">Validate Survey</Link>
                                            <Link className="btn btn-outline-warning text-white-emphasis rounded-pill" to="/admin/signup">Add Admin</Link>
                                        </>
                                    )}
                                    {surveyerId && (
                                        <>
                                            <Link className="btn btn-outline-warning text-white-emphasis rounded-pill" to="/surveyer/dashboard">Surveyer Dashboard</Link>
                                            <Link className="btn btn-outline-warning text-white-emphasis rounded-pill" to="/surveyer/new-survey">Create New Survey</Link>
                                        </>
                                    )}
                                    <button className="btn btn-outline-danger text-white-emphasis rounded-pill" onClick={handleLogout}>Log out</button>
                                </>
                            ) : (
                                <>
                                    <Link className="btn btn-outline-success text-warning-emphasis rounded-pill" to="/">Home</Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default Nav;