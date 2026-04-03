import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const HomeSurveyForm = () => {
    const navigate = useNavigate();
    const [surveyData, setSurveyData] = useState({
        propertyAddress: '',
        moveDate: new Date().toISOString().split('T')[0],
        propertyAccess: {
            propertyType: 'House',
            floorNumber: 1,
            elevatorAvailable: 'N/A',
            parkingDistance: '0-20m'
        },
        household: {
            adults: 1,
            children: 0,
            seniors: 0,
            pets: 0,
        },
        vehicles: {
            cars: 0,
            twoWheelers: 0,
            bicycles: 0,
            heavyVehicles: 0,
        },
        majorItems: {
            beds: 0,
            sofas: 0,
            diningTables: 0,
            wardrobes: 0,
            refrigerators: 0,
            washingMachines: 0,
            tvs: 0,
            acUnits: 0,
        },
    });

    const surveyerId = sessionStorage.getItem('surveyerid');

    useEffect(() => {
        if (!surveyerId) {
            navigate('/');
        }
    }, [surveyerId, navigate]);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const [group, field] = name.split('.');

        const val = type === 'number' ? Math.max(0, parseInt(value, 10) || 0) : value;

        if (field) { // Nested property like "household.adults"
            setSurveyData(prev => ({
                ...prev,
                [group]: {
                    ...prev[group],
                    [field]: val
                }
            }));
        } else { // Top-level property like "propertyAddress"
            setSurveyData(prev => ({
                ...prev,
                [name]: val
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3001/survey/submit", {
                surveyData,
                surveyerId
            });

            if (response.data.status === "success") {
                alert(response.data.message);
            } else {
                alert(response.data.message || "Failed to submit survey.");
            }
        } catch (err) {
            console.error("Survey submission error:", err);
            alert(err.response?.data?.message || "An error occurred during submission.");
        }
    };

    // Helper to render a number input for an item
    const renderItemCounter = (group, name, label) => (
        <div className="col-md-4 mb-3">
            <label htmlFor={`${group}-${name}`} className="form-label">{label}</label>
            <input
                type="number"
                className="form-control"
                id={`${group}-${name}`}
                name={`${group}.${name}`}
                value={surveyData[group][name]}
                onChange={handleChange}
                min="0"
            />
        </div>
    );

    return (
        <div className="container my-5">
            <Nav/>
            <div className="row justify-content-center">
                <div className="col-12 col-lg-10">
                    <div className="card">
                        <form className="card-body" onSubmit={handleSubmit}>
                            <h4 className="card-title mb-4">Move Assessment Survey</h4>
                            <p className="card-subtitle mb-4 text-muted">Please provide details about your household to help us plan your move effectively.</p>

                            {/* Basic Info */}
                            <fieldset className="mb-4">
                                <legend className="h6">1. Basic Information</legend>
                                <div className="row">
                                    <div className="col-md-8 mb-3">
                                        <label htmlFor="propertyAddress" className="form-label">Property Address</label>
                                        <input type="text" className="form-control" id="propertyAddress" name="propertyAddress" value={surveyData.propertyAddress} onChange={handleChange} required />
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label htmlFor="moveDate" className="form-label">Scheduled Move Date</label>
                                        <input type="date" className="form-control" id="moveDate" name="moveDate" value={surveyData.moveDate} onChange={handleChange} required />
                                    </div>
                                </div>
                            </fieldset>

                            {/* Property & Access Details */}
                            <fieldset className="mb-4">
                                <legend className="h6">2. Property & Access Details</legend>
                                <p>Details about the property to plan for logistics.</p>
                                <div className="row align-items-center">
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="propertyType" className="form-label">Property Type</label>
                                        <select className="form-select" id="propertyType" name="propertyAccess.propertyType" value={surveyData.propertyAccess.propertyType} onChange={handleChange}>
                                            <option>House</option>
                                            <option>Apartment/Flat</option>
                                            <option>Townhouse</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div className="col-md-2 mb-3">
                                        <label htmlFor="floorNumber" className="form-label">Floor #</label>
                                        <input type="number" className="form-control" id="floorNumber" name="propertyAccess.floorNumber" value={surveyData.propertyAccess.floorNumber} onChange={handleChange} min="0" />
                                    </div>
                                    <div className="col-md-3 mb-3">
                                        <label htmlFor="parkingDistance" className="form-label">Parking Distance</label>
                                        <select className="form-select" id="parkingDistance" name="propertyAccess.parkingDistance" value={surveyData.propertyAccess.parkingDistance} onChange={handleChange}>
                                            <option>0-20m</option>
                                            <option>20-50m</option>
                                            <option>50m+</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4 mb-3">
                                        <label className="form-label d-block">Elevator Available</label>
                                        <div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="propertyAccess.elevatorAvailable" id="elevatorYes" value="Yes" checked={surveyData.propertyAccess.elevatorAvailable === 'Yes'} onChange={handleChange} /><label className="form-check-label" htmlFor="elevatorYes">Yes</label></div>
                                        <div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="propertyAccess.elevatorAvailable" id="elevatorNo" value="No" checked={surveyData.propertyAccess.elevatorAvailable === 'No'} onChange={handleChange} /><label className="form-check-label" htmlFor="elevatorNo">No</label></div>
                                        <div className="form-check form-check-inline"><input className="form-check-input" type="radio" name="propertyAccess.elevatorAvailable" id="elevatorNA" value="N/A" checked={surveyData.propertyAccess.elevatorAvailable === 'N/A'} onChange={handleChange} /><label className="form-check-label" htmlFor="elevatorNA">N/A</label></div>
                                    </div>
                                </div>
                            </fieldset>

                            {/* Household Composition */}
                            <fieldset className="mb-4">
                                <legend className="h6">3. Household Composition</legend>
                                <p>Enter the number of people and pets in the household.</p>
                                <div className="row">
                                    {renderItemCounter('household', 'adults', 'Working Adults')}
                                    {renderItemCounter('household', 'children', 'Children (Under 18)')}
                                    {renderItemCounter('household', 'seniors', 'Seniors (65+)')}
                                    {renderItemCounter('household', 'pets', 'Pets')}
                                </div>
                            </fieldset>

                            {/* Vehicle Inventory */}
                            <fieldset className="mb-4">
                                <legend className="h6">4. Vehicle Inventory</legend>
                                <p>Enter the number of vehicles to be considered or moved.</p>
                                <div className="row">
                                    {renderItemCounter('vehicles', 'cars', 'Cars')}
                                    {renderItemCounter('vehicles', 'twoWheelers', '2-Wheelers (Bikes/Scooters)')}
                                    {renderItemCounter('vehicles', 'bicycles', 'Bicycles')}
                                    {renderItemCounter('vehicles', 'heavyVehicles', 'Heavy Vehicles')}
                                </div>
                            </fieldset>

                            {/* Major Item Inventory */}
                            <fieldset className="mb-4">
                                <legend className="h6">5. Major Item Inventory</legend>
                                <p>Enter the quantity of common large items.</p>
                                <div className="row">
                                    {renderItemCounter('majorItems', 'beds', 'Beds (Frame & Mattress)')}
                                    {renderItemCounter('majorItems', 'sofas', 'Sofas / Couches')}
                                    {renderItemCounter('majorItems', 'diningTables', 'Dining Tables')}
                                    {renderItemCounter('majorItems', 'wardrobes', 'Wardrobes / Almirahs')}
                                    {renderItemCounter('majorItems', 'refrigerators', 'Refrigerators')}
                                    {renderItemCounter('majorItems', 'washingMachines', 'Washing Machines')}
                                    {renderItemCounter('majorItems', 'tvs', 'Televisions (TVs)')}
                                    {renderItemCounter('majorItems', 'acUnits', 'AC Units')}
                                </div>
                            </fieldset>

                            <hr className="my-4" />

                            <button type="submit" className="btn btn-primary w-100">Submit Survey</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HomeSurveyForm;