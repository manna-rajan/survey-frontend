import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Nav from './Nav';

const AddSurveyer = () => {
    const navigate = useNavigate();
    const [input, setInput] = useState({ name: '', email: '' });
    const [errors, setErrors] = useState({});
    const adminId = sessionStorage.getItem('adminid');

    useEffect(() => {
        // This check ensures that only a logged-in admin can view this page.
        if (!adminId) {
            navigate('/');
        }
    }, [adminId, navigate]);

    const VALIDATION_RULES = {
        name: {
            pattern: /^[a-zA-Z0-9\s_-]+$/,
            message: "Name can only contain letters, numbers, spaces, hyphens (-), and underscores (_)."
        },
        email: {
            pattern: /^[a-zA-Z0-9._+-]+@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/,
            message: "Please enter a valid email format (e.g., user@example.com)."
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({ ...input, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validate = () => {
        const newErrors = {};
        for (const field in VALIDATION_RULES) {
            if (!input[field]) {
                newErrors[field] = "This field is required.";
            } else if (VALIDATION_RULES[field].pattern && !VALIDATION_RULES[field].pattern.test(input[field])) {
                newErrors[field] = VALIDATION_RULES[field].message;
            }
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formErrors = validate();
        if (Object.keys(formErrors).length > 0) {
            setErrors(formErrors);
            return;
        }
        setErrors({});

        const trimmedInput = {
            ...input,
            name: input.name.trim(),
            email: input.email.trim(),
        };

        try {
            const response = await axios.post('http://localhost:3001/admin/add-surveyer', {
                ...trimmedInput,
                adminId,
            });
            if (response.data.status === 'success') {
                alert(response.data.message);
                navigate('/admin/dashboard');
            } else {
                alert(response.data.message || 'An unexpected error occurred.');
            }
        } catch (err) {
            console.error("Add surveyer error:", err);
            alert(err.response?.data?.message || 'Failed to add surveyer.');
        }
    };

    return (
        <div className="container mt-5">
            <Nav/>
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2 className="mb-0">Add New Surveyer</h2>
                        <Link to="/admin/dashboard" className="btn btn-outline-secondary">Back to Dashboard</Link>
                    </div>
                    <div className="card bg-light">
                        <form className="card-body d-flex flex-column gap-3" onSubmit={handleSubmit} noValidate>
                            <div>
                                <label htmlFor="nameInput" className="form-label">Surveyer Name</label>
                                <input type="text" className={`form-control ${errors.name ? 'is-invalid' : ''}`} id="nameInput" name="name" value={input.name} onChange={handleChange} required placeholder="e.g., Jane Doe" />
                                {errors.name && <div className="invalid-feedback d-block">{errors.name}</div>}
                            </div>
                            <div>
                                <label htmlFor="emailInput" className="form-label">Surveyer Email</label>
                                <input type="email" className={`form-control ${errors.email ? 'is-invalid' : ''}`} id="emailInput" name="email" value={input.email} onChange={handleChange} required placeholder="e.g., jane.doe@example.com" />
                                {errors.email && <div className="invalid-feedback d-block">{errors.email}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary">Add Surveyer & Send Invite</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddSurveyer