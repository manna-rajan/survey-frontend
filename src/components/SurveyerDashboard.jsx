import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Nav from './Nav';
import StatCard from './StatCard';
import { FaClipboardList, FaHourglassHalf, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

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

const RejectedSurveysList = ({ surveyerId }) => {
    const [surveys, setSurveys] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!surveyerId) {
            setLoading(false);
            return;
        }

        const fetchRejectedSurveys = async () => {
            try {
                setLoading(true);
                const response = await axios.post('http://localhost:3001/surveyer/surveys/rejected', { surveyerId });
                if (response.data.status === 'success') {
                    setSurveys(response.data.surveys);
                } else {
                    setError('Failed to fetch rejected surveys.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching surveys.');
            } finally {
                setLoading(false);
            }
        };

        fetchRejectedSurveys();
    }, [surveyerId]);

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

    if (loading) return <p>Loading rejected surveys...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    if (surveys.length === 0) {
        return (
            <div className="card border-secondary">
                <div className="card-header bg-secondary text-white"><h5 className="mb-0">Rejected Surveys</h5></div>
                <div className="card-body">No rejected surveys found.</div>
            </div>
        );
    }

    const currentSurvey = surveys[currentIndex];

    return (
        <div className="card border-danger">
            <div className="card-header bg-danger text-white">
                <h5 className="mb-0">Rejected Surveys ({currentIndex + 1} of {surveys.length})</h5>
            </div>
            <div className="card-body">
                <p><strong>Address:</strong> {currentSurvey.propertyAddress}</p>
                <p><strong>Move Date:</strong> {new Date(currentSurvey.moveDate).toLocaleDateString()}</p>
                <hr />
                <div className="row">
                    <div className="col-md-6">
                        {renderItemGroup('Household', currentSurvey.household)}
                        {renderItemGroup('Vehicles', currentSurvey.vehicles)}
                    </div>
                    <div className="col-md-6">
                        {renderItemGroup('Major Items', currentSurvey.majorItems)}
                        <div>
                            <strong>Property Access</strong>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Type: {currentSurvey.propertyAccess.propertyType}</li>
                                <li className="list-group-item">Floor: {currentSurvey.propertyAccess.floorNumber}</li>
                                <li className="list-group-item">Elevator: {currentSurvey.propertyAccess.elevatorAvailable}</li>
                                <li className="list-group-item">Parking: {currentSurvey.propertyAccess.parkingDistance}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {surveys.length > 1 && (
                <div className="card-footer text-end">
                    <button className="btn btn-secondary me-2" onClick={handlePrevious}>← Previous</button>
                    <button className="btn btn-secondary" onClick={handleNext}>Next →</button>
                </div>
            )}
        </div>
    );
};

const AcceptedSurveysList = ({ surveyerId }) => {
    const [surveys, setSurveys] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!surveyerId) {
            setLoading(false);
            return;
        }

        const fetchAcceptedSurveys = async () => {
            try {
                setLoading(true);
                const response = await axios.post('http://localhost:3001/surveyer/surveys/accepted', { surveyerId });
                if (response.data.status === 'success') {
                    setSurveys(response.data.surveys);
                } else {
                    setError('Failed to fetch accepted surveys.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching surveys.');
            } finally {
                setLoading(false);
            }
        };

        fetchAcceptedSurveys();
    }, [surveyerId]);

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

    if (loading) return <p>Loading accepted surveys...</p>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    if (surveys.length === 0) {
        return (
            <div className="card">
                <div className="card-header"><h5 className="mb-0">Accepted Surveys</h5></div>
                <div className="card-body">No accepted surveys found.</div>
            </div>
        );
    }

    const currentSurvey = surveys[currentIndex];

    return (
        <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Accepted Surveys ({currentIndex + 1} of {surveys.length})</h5>
            </div>
            <div className="card-body">
                <p><strong>Address:</strong> {currentSurvey.propertyAddress}</p>
                <p><strong>Move Date:</strong> {new Date(currentSurvey.moveDate).toLocaleDateString()}</p>
                <hr />
                <div className="row">
                    <div className="col-md-6">
                        {renderItemGroup('Household', currentSurvey.household)}
                        {renderItemGroup('Vehicles', currentSurvey.vehicles)}
                    </div>
                    <div className="col-md-6">
                        {renderItemGroup('Major Items', currentSurvey.majorItems)}
                        <div>
                            <strong>Property Access</strong>
                            <ul className="list-group list-group-flush">
                                <li className="list-group-item">Type: {currentSurvey.propertyAccess.propertyType}</li>
                                <li className="list-group-item">Floor: {currentSurvey.propertyAccess.floorNumber}</li>
                                <li className="list-group-item">Elevator: {currentSurvey.propertyAccess.elevatorAvailable}</li>
                                <li className="list-group-item">Parking: {currentSurvey.propertyAccess.parkingDistance}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            {surveys.length > 1 && (
                <div className="card-footer text-end">
                    <button className="btn btn-secondary me-2" onClick={handlePrevious}>← Previous</button>
                    <button className="btn btn-secondary" onClick={handleNext}>Next →</button>
                </div>
            )}
        </div>
    );
};

const SurveyerDashboard = () => {
    const navigate = useNavigate();
    const surveyerName = sessionStorage.getItem('surveyername');
    const surveyerId = sessionStorage.getItem('surveyerid');
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        if (!surveyerId) {
            navigate('/');
            return;
        }

        const fetchStats = async () => {
            try {
                setLoadingStats(true);
                const response = await axios.post('http://localhost:3001/surveyer/stats', { surveyerId });
                if (response.data.status === 'success') {
                    setStats(response.data.stats);
                }
            } catch (error) {
                console.error("Failed to fetch stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        fetchStats();
    }, [surveyerId, navigate]);

    const handleNewSurvey = () => {
        navigate('/surveyer/new-survey');
    };

    return (
        <div className="container mt-4">
            <Nav />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Surveyer Dashboard</h2>
                <div>
                    <span className="me-3">Welcome, {surveyerName}!</span>
                    <button className="btn btn-primary me-3" onClick={handleNewSurvey}>Create New Survey</button>
                </div>
            </div>

            <div className="row mb-5 g-4">
                <div className="col-md-6 col-lg-3">
                    <StatCard icon={<FaClipboardList />} title="Total Surveys" value={stats?.totalSurveys ?? '...'} color="secondary" loading={loadingStats} />
                </div>
                <div className="col-md-6 col-lg-3">
                    <StatCard icon={<FaHourglassHalf />} title="Pending Surveys" value={stats?.pendingSurveys ?? '...'} color="warning" loading={loadingStats} />
                </div>
                <div className="col-md-6 col-lg-3">
                    <StatCard icon={<FaCheckCircle />} title="Accepted Surveys" value={stats?.acceptedSurveys ?? '...'} color="primary" loading={loadingStats} />
                </div>
                <div className="col-md-6 col-lg-3">
                    <StatCard icon={<FaTimesCircle />} title="Rejected Surveys" value={stats?.rejectedSurveys ?? '...'} color="danger" loading={loadingStats} />
                </div>
            </div>

            <div className="row">
                <div className="col-12 mb-4">
                    <RejectedSurveysList surveyerId={surveyerId} />
                </div>
                <div className="col-12 mb-4">
                    <AcceptedSurveysList surveyerId={surveyerId} />
                </div>
            </div>
        </div>
    );
};

export default SurveyerDashboard;