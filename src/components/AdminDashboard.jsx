import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaClipboardList, FaUsers, FaCarSide, FaHourglassHalf } from 'react-icons/fa';
import StatCard from './StatCard';
import NivoBarChart from './NivoBarChart';
import Nav from './Nav';

const AdminDashboard = () => {
    const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

    const navigate = useNavigate();
    const adminName = sessionStorage.getItem('adminname');
    const adminId = sessionStorage.getItem('adminid');
    const [stats, setStats] = useState(null);
    const [loadingStats, setLoadingStats] = useState(true);
    const [acceptedSurveys, setAcceptedSurveys] = useState([]);
    const [loadingAccepted, setLoadingAccepted] = useState(false);
    const [acceptedError, setAcceptedError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    const fetchStats = useCallback(async () => {
        try {
            setLoadingStats(true);
            const response = await axios.post(`${API_BASE_URL}/admin/stats`, { adminId });
            if (response.data.status === 'success') {
                setStats(response.data.stats);
            }
        } catch (error) {
            console.error("Failed to fetch stats:", error);
        } finally {
            setLoadingStats(false);
        }
    }, [adminId, API_BASE_URL]);

    const fetchAcceptedSurveys = useCallback(async () => {
        try {
            setLoadingAccepted(true);
            setAcceptedError('');
            const response = await axios.post(`${API_BASE_URL}/admin/surveys/accepted`, { adminId });
            if (response.data.status === 'success') {
                setAcceptedSurveys(response.data.surveys);
            } else {
                setAcceptedError('Failed to fetch accepted surveys.');
            }
        } catch (error) {
            setAcceptedError(error.response?.data?.message || 'An error occurred.');
        } finally {
            setLoadingAccepted(false);
        }
    }, [adminId, API_BASE_URL]);

    useEffect(() => {
        if (!adminId) {
            navigate('/');
            return;
        }

        fetchStats();
        fetchAcceptedSurveys();
    }, [adminId, navigate, fetchAcceptedSurveys, fetchStats]);

    const handleNext = () => {
        if (acceptedSurveys.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % acceptedSurveys.length);
        }
    };

    const handlePrevious = () => {
        if (acceptedSurveys.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + acceptedSurveys.length) % acceptedSurveys.length);
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

    const renderAcceptedSurveys = () => {
        if (loadingAccepted) return <p>Loading surveys...</p>;
        if (acceptedError) return <div className="alert alert-danger">{acceptedError}</div>;

        if (acceptedSurveys.length === 0) {
            return <p>No accepted surveys found.</p>;
        }

        const currentSurvey = acceptedSurveys[currentIndex];
        return (
            <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Accepted Survey ({currentIndex + 1} of {acceptedSurveys.length})</h5>
                </div>
                <div className="card-body">
                    <p><strong>Address:</strong> {currentSurvey.propertyAddress}</p>
                    <p><strong>Move Date:</strong> {new Date(currentSurvey.moveDate).toLocaleDateString()}</p>
                    <p><strong>Surveyor:</strong> {currentSurvey.submittedBy?.name || 'N/A'} ({currentSurvey.submittedBy?.email || 'N/A'})</p>
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
                {acceptedSurveys.length > 1 && (
                    <div className="card-footer text-end">
                        <button className="btn btn-secondary me-2" onClick={handlePrevious}>← Previous</button>
                        <button className="btn btn-secondary" onClick={handleNext}>Next →</button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <Nav />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Admin Dashboard</h2>
                <div>
                    <span className="me-3 text-muted">Welcome, <strong className="text-dark fw-semibold">{adminName}!</strong></span>
                </div>
            </div>

            {/* Stats Row */}
            <div className="row mb-5 g-4">
                <div className="col-md-6 col-lg-3">
                    <StatCard icon={<FaClipboardList />} title="Accepted Surveys" value={stats?.totalAcceptedSurveys ?? '...'} color="primary" loading={loadingStats} />
                </div>
                <div className="col-md-6 col-lg-3">
                    <StatCard icon={<FaHourglassHalf />} title="Pending Surveys" value={stats?.pendingSurveys ?? '...'} color="warning" loading={loadingStats} />
                </div>
                <div className="col-md-6 col-lg-3">
                    <StatCard icon={<FaUsers />} title="Total People Moved" value={stats?.totalPeople ?? '...'} color="success" loading={loadingStats} />
                </div>
                <div className="col-md-6 col-lg-3">
                    <StatCard icon={<FaCarSide />} title="Total Vehicles Moved" value={stats?.totalVehicles ?? '...'} color="info" loading={loadingStats} />
                </div>
            </div>

            {/* Chart Row */}
            <div className="row mb-5">
                <div className="col-12">
                    <NivoBarChart />
                </div>
            </div>

            {/* Accepted Surveys List */}
            <div className="row mb-5">
                <div className="col-12">
                    <h3 className="mb-4">All Accepted Surveys</h3>
                    {renderAcceptedSurveys()}
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;