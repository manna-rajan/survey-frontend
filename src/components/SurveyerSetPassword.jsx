import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';

const SurveyerSetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [token, setToken] = useState(null);

    const VALIDATION_RULES = {
        password: {
            pattern: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&._-])[A-Za-z\d@$!%*?&._-]{8,}$/,
            message: "Password must be at least 8 characters long and include a letter, a number, and a special character."
        },
        confirmPassword: {
            message: "Passwords do not match."
        }
    };

    const [input, setInput] = useState({
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        } else {
            navigate("/");
        }
    }, [searchParams, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput({
            ...input,
            [name]: value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!input.password) {
            newErrors.password = "This field is required.";
        } else if (!VALIDATION_RULES.password.pattern.test(input.password)) {
            newErrors.password = VALIDATION_RULES.password.message;
        }

        if (input.password !== input.confirmPassword) {
            newErrors.confirmPassword = VALIDATION_RULES.confirmPassword.message;
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

        try {
            const response = await axios.post("http://localhost:3001/surveyer/set-password", {
                token: token,
                password: input.password
            });
            if (response.data.status === "success") {
                alert("Password set successfully! You can now sign in.");
                navigate("/surveyer/signin");
            } else {
                alert(response.data.message || "Failed to set password.");
            }
        } catch (err) {
            console.error("Set password error:", err);
            alert(err.response?.data?.message || "An error occurred.");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card bg-secondary-subtle text-danger-emphasis">
                        <form className="card-body d-flex flex-column gap-3" onSubmit={handleSubmit} noValidate>
                            <h5 className="card-title">Set Your Password</h5>
                            <p>Create a password to complete your account setup.</p>
                            <div>
                                <label htmlFor="passwordInput" className="form-label">New Password</label>
                                <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} id="passwordInput" name="password" value={input.password} onChange={handleChange} required placeholder="Min 8 chars, with letter, number & symbol" />
                                {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                            </div>
                            <div>
                                <label htmlFor="confirmPasswordInput" className="form-label">Confirm New Password</label>
                                <input type="password" className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`} id="confirmPasswordInput" name="confirmPassword" value={input.confirmPassword} onChange={handleChange} required placeholder="Re-enter your password" />
                                {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                            </div>
                            <button type="submit" className="btn btn-primary">Set Password and Sign In</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SurveyerSetPassword;