import React from 'react';

const StatCard = ({ icon, title, value, color, loading }) => {
    const cardClass = `card text-white bg-${color} h-100`;

    if (loading) {
        return (
            <div className={cardClass}>
                <div className="card-body d-flex align-items-center justify-content-center">
                    <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cardClass}>
            <div className="card-body d-flex align-items-center">
                <div className="fs-1 me-4">{icon}</div>
                <div>
                    <div className="fs-3 fw-bold">{value}</div>
                    <div className="text-uppercase small">{title}</div>
                </div>
            </div>
        </div>
    );
};

export default StatCard;