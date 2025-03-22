"use client"

import { useState } from "react"

export default function LoginForm() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("Login submitted:", formData)
        // Here you would typically handle authentication
    }

    return (
        <div className="login-form-container">
            <div className="login-card">
                <div className="card-header">
                    <h2 className="card-title">Log In</h2>
                    <p className="card-description">Enter your credentials to access your account.</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="card-content">
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john.doe@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="login-button">
                            Log In
                        </button>
                        <p className="signup-text">
                            Don't have an account?{" "}
                            <a href="/signup" className="signup-link">
                                Sign up
                            </a>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    )
}

