import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveBar } from '@nivo/bar';
import { useNavigate } from 'react-router-dom';

const NivoBarChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const adminId = sessionStorage.getItem('adminid');

    useEffect(() => {
        if (!adminId) {
            navigate('/');
            return;
        }

        const fetchChartData = async () => {
            try {
                setLoading(true);
                const response = await axios.post('http://localhost:3001/admin/surveys-by-month', { adminId });
                if (response.data.status === 'success') {
                    setData(response.data.data);
                } else {
                    setError('Failed to fetch chart data.');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'An error occurred while fetching chart data.');
            } finally {
                setLoading(false);
            }
        };

        fetchChartData();
    }, [adminId, navigate]);

    if (loading) {
        return (
            <div className="card" style={{ height: '400px' }}>
                <div className="card-body d-flex align-items-center justify-content-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading chart...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (error) return <div className="alert alert-danger">{error}</div>;

    if (data.length === 0) {
        return (
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">Monthly Accepted Surveys</h5>
                    <p>No survey data available to display a chart.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card">
            <div className="card-body" style={{ height: '400px' }}>
                <h5 className="card-title mb-0">Monthly Accepted Surveys</h5>
                <ResponsiveBar
                    data={data}
                    keys={['surveys']}
                    indexBy="month"
                    margin={{ top: 50, right: 50, bottom: 50, left: 60 }}
                    padding={0.3}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={{ scheme: 'category10' }}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Month',
                        legendPosition: 'middle',
                        legendOffset: 32
                    }}
                    axisLeft={{
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                        legend: 'Count',
                        legendPosition: 'middle',
                        legendOffset: -45,
                        format: e => Math.floor(e) === e && e // only show integer ticks
                    }}
                    enableLabel={false}
                    animate={true}
                    motionStiffness={90}
                    motionDamping={15}
                />
            </div>
        </div>
    );
};

export default NivoBarChart;