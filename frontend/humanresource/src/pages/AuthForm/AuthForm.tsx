// 📄 AuthForm.tsx - React + TypeScript Implementation (Final, optimized heights)
import React, { useState, type ChangeEvent, type FormEvent } from "react";
import "./AuthForm.css";
import logo10 from "../../assets/images/logo10.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

type Tab = "register" | "login";
type SubscriptionOption = "Monthly" | "Yearly" | "Trial";

const AuthForm: React.FC = () => {
    const [tab, setTab] = useState<Tab>("register");
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [subscription, setSubscription] = useState<SubscriptionOption>("Monthly");

    const handleSubscriptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSubscription(e.target.value as SubscriptionOption);
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        // TODO: form data handling
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card" role="region" aria-label="Authentication Form">
                <img src={logo10} alt="PeopleMesh Logo" className="auth-logo" />

                {/* Tabs */}
                <div className="auth-tabs" role="tablist">
                    <button
                        className={`auth-tab ${tab === "register" ? "active" : ""}`}
                        onClick={() => setTab("register")}
                        role="tab"
                        aria-selected={tab === "register"}
                    >
                        Register
                    </button>
                    <button
                        className={`auth-tab ${tab === "login" ? "active" : ""}`}
                        onClick={() => setTab("login")}
                        role="tab"
                        aria-selected={tab === "login"}
                    >
                        Login
                    </button>
                </div>

                {/* Form Content */}
                {tab === "register" ? (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div className="grid-2">
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="First Name"
                                aria-label="First Name"
                                required
                            />
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Last Name"
                                aria-label="Last Name"
                                required
                            />
                        </div>
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Email Address"
                            aria-label="Email Address"
                            required
                        />

                        <div className="grid-2">
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="auth-input"
                                    placeholder="Password"
                                    aria-label="Password"
                                    required
                                />
                                <span
                                    className="password-icon"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                            </div>
                            <div className="password-wrapper">
                                <input
                                    type={showRePassword ? "text" : "password"}
                                    className="auth-input"
                                    placeholder="Re-enter Password"
                                    aria-label="Re-enter Password"
                                    required
                                />
                                <span
                                    className="password-icon"
                                    onClick={() => setShowRePassword(!showRePassword)}
                                >
                  {showRePassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                            </div>
                        </div>

                        <div className="grid-2">
                            <input
                                type="tel"
                                className="auth-input"
                                placeholder="Phone Number"
                                aria-label="Phone Number"
                                required
                            />
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Company Name"
                                aria-label="Company Name"
                                required
                            />
                        </div>

                        <select
                            className="auth-input auth-select"
                            value={subscription}
                            onChange={handleSubscriptionChange}
                            aria-label="Subscription Plan"
                            required
                        >
                            <option value="Monthly">Monthly</option>
                            <option value="Yearly">Yearly</option>
                            <option value="Trial">Trial</option>
                        </select>

                        <button type="submit" className="auth-button">
                            Register
                        </button>
                    </form>
                ) : (
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Email Address"
                            aria-label="Email Address"
                            required
                        />
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Password"
                                aria-label="Password"
                                required
                            />
                            <span
                                className="password-icon"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
                        </div>
                        <div className="forgot-wrapper">
                            <a href="#" className="forgot-link">
                                Forgot password?
                            </a>
                        </div>
                        <button type="submit" className="auth-button">
                            Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthForm;