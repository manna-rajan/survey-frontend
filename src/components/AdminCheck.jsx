import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const AdminCheck = ({ onReviewSuccess }) => {
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

    const [surveys, setSurveys] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const adminId = sessionStorage.getItem('adminid');

    useEffect(() => {
        if (!adminId) {
            navigate('/');
            return;
        }

        const fetchPendingSurveys = async () => {
            try {
                setLoading(true);
                const response = await axios.post(`${API_BASE_URL}/admin/surveys/pending`, { adminId });
                if (response.data.status === 'success') {
                    setSurveys(response.data.surveys);
                } else {
                    setError('Failed to fetch surveys.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching surveys.');
            } finally {
                setLoading(false);
            }
        };

        fetchPendingSurveys();
    }, [adminId, navigate, API_BASE_URL]);

    const handleReview = async (surveyId, status) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/admin/surveys/review`, { surveyId, status, adminId });
            if (response.data.status === 'success') {
                setSurveys(prevSurveys => {
                    const newSurveys = prevSurveys.filter(s => s._id !== surveyId);
                    // If the current index is now out of bounds (we removed the last item), reset to 0.
                    if (currentIndex >= newSurveys.length) {
                        setCurrentIndex(0);
                    }
                    return newSurveys;
                });
                if (onReviewSuccess) onReviewSuccess(); // Trigger the refresh in the parent
            } else {
                alert('Failed to update survey status.');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'An error occurred during review.');
        }
    };

    const handleNext = () => {
        if (surveys.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % surveys.length);
        }
    };

    const handlePrevious = () => {
        if (surveys.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + surveys.length) % surveys.length);
        }
    };

    const renderItemGroup = (title, items) => (
        <div className="mb-3">
            <strong>{title}</strong>
            <ul className="list-group list-group-flush">
                {Object.entries(items).map(([key, value]) => (
                    value > 0 && <li key={key} className="list-group-item d-flex justify-content-between align-items-center text-capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                        <span className="badge bg-primary rounded-pill">{value}</span>
                    </li>
                ))}
            </ul>
        </div>
    );

    return (
        <div className="container">
            <Nav />
            <div className="row justify-content-center mt-4">
                <div className="col-12 col-lg-10 mb-5">
                    {loading && (
                        <div className="card">
                            <div className="card-body text-center">Loading pending surveys...</div>
                        </div>
                    )}
                    {error && <div className="alert alert-danger">{error}</div>}
                    {!loading && !error && (
                        <>
                            {surveys.length === 0 ? (
                                <div className="card">
                                    <div className="card-body text-center">No pending surveys to review.</div>
                                </div>
                            ) : (
                                <div className="card border-primary">
                                    <div className="card-header d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0">Review Survey ({currentIndex + 1} of {surveys.length})</h5>
                                        <span>By: {surveys[currentIndex].submittedBy?.name || 'N/A'}</span>
                                    </div>
                                    <div className="card-body">
                                        <p><strong>Address:</strong> {surveys[currentIndex].propertyAddress}</p>
                                        <p><strong>Move Date:</strong> {new Date(surveys[currentIndex].moveDate).toLocaleDateString()}</p>
                                        <hr />
                                        <div className="row">
                                            <div className="col-md-6">
                                                {renderItemGroup('Household', surveys[currentIndex].household)}
                                                {renderItemGroup('Vehicles', surveys[currentIndex].vehicles)}
                                            </div>
                                            <div className="col-md-6">
                                                {renderItemGroup('Major Items', surveys[currentIndex].majorItems)}
                                                <div>
                                                    <strong>Property Access</strong>
                                                    <ul className="list-group list-group-flush">
                                                        <li className="list-group-item">Type: {surveys[currentIndex].propertyAccess.propertyType}</li>
                                                        <li className="list-group-item">Floor: {surveys[currentIndex].propertyAccess.floorNumber}</li>
                                                        <li className="list-group-item">Elevator: {surveys[currentIndex].propertyAccess.elevatorAvailable}</li>
                                                        <li className="list-group-item">Parking: {surveys[currentIndex].propertyAccess.parkingDistance}</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-footer d-flex justify-content-between">
                                        <div>
                                            <button className="btn btn-success me-2" onClick={() => handleReview(surveys[currentIndex]._id, 1)}>Accept</button>
                                            <button className="btn btn-danger" onClick={() => handleReview(surveys[currentIndex]._id, 2)}>Reject</button>
                                        </div>
                                        {surveys.length > 1 && (
                                            <div>
                                                <button className="btn btn-secondary me-2" onClick={handlePrevious}>← Previous</button>
                                                <button className="btn btn-secondary" onClick={handleNext}>Next →</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminCheck;