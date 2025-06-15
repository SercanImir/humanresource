import React, { useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import logo10 from "../../assets/images/logo10.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const MySwal = withReactContent(Swal);


type Tab = "register" | "login";
type SubscriptionOption = "Monthly" | "Quarterly" | "HalfYearly" | "Yearly" | "Trial";





const AuthForm: React.FC = () => {

    const navigate = useNavigate();

    const [tab, setTab] = useState<Tab>("register");
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [subscription, setSubscription] = useState<SubscriptionOption>("Monthly");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);


    // Register form verisi
    const [regData, setRegData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        rePassword: "",
        phoneNumber: "",
        companyName: "",
    });

    // Login form verisi
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    });

    const handleSubscriptionChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setSubscription(e.target.value as SubscriptionOption);
    };

    // 1) Register handler
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // şifre eşleşmesi
            if (regData.password !== regData.rePassword) {
                throw new Error("Şifreler eşleşmiyor");
            }

            const payload = {
                firstName: regData.firstName,
                lastName: regData.lastName,
                email: regData.email,
                password: regData.password,
                rePassword: regData.rePassword,
                companyName: regData.companyName,
                subscriptionType: subscription.toUpperCase(),
                phoneNumber: regData.phoneNumber,
            };

            const resp = await fetch(`http://localhost:9090/api/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            const body = await resp.json();

            if (!resp.ok) {
                throw new Error(body.message || "Kayıt başarısız oldu");
            }

            await MySwal.fire({
                icon: "success",
                title: "Kayıt Başarılı!",
                html: (
                    <>
                        <p>{body.message || "Lütfen e-postanızı kontrol edip hesabınızı doğrulayın."}</p>
                    </>
                ),
                confirmButtonText: "Tamam",
                customClass: {
                    popup: "swal2-popup-auth",        // AuthForm.css içinde tanımlayacağınız stil
                    title: "swal2-title-auth",
                    htmlContainer: "swal2-html-auth",
                    confirmButton: "swal2-confirm-auth",
                },
            });
            setTab("login");
        } catch (err: any) {
            // SweetAlert hata bildirimi
            MySwal.fire({
                icon: "error",
                title: "Hata",
                text: err.message,
                confirmButtonText: "Tamam",
                customClass: {
                    popup: "swal2-popup-auth",
                    confirmButton: "swal2-confirm-auth",
                },
            });
        } finally {
            setLoading(false);
        }
    };
    // 2) Login handler (güncellendi)
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const resp = await fetch(`http://localhost:9090/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(loginData),
            });
            const body = await resp.json();

            if (!resp.ok) {
                throw new Error(body.message || "Giriş başarısız oldu");
            }

            // ---- Burada "role" değil "roles" olarak destructure ediyoruz ----
            const { token, roles } = body.data as {
                token: string;

                roles: string[];
            };

            // ---- Tek bir anahtarla sadece HAM token'ı saklıyoruz ----
            localStorage.setItem("token", token);

            // Başarılı giriş bildirimi
            await MySwal.fire({
                icon: "success",
                title: "Giriş Başarılı",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 1200,
            });

            // ---- Rol bazlı yönlendirme ----
            if (roles.includes("SITE_ADMIN")) {
                navigate("/admin/dashboard");
            } else if (roles.includes("MANAGER")) {
                navigate("/manager/dashboard");
            } else {
                navigate("/employee/dashboard");
            }
        } catch (err: any) {
            await MySwal.fire({
                icon: "error",
                title: "Hata",
                text: err.message,
                confirmButtonText: "Tamam",
                customClass: { confirmButton: "swal2-confirm-auth" },
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card" role="region" aria-label="Authentication Form">
                <img src={logo10} alt="PeopleMesh Logo" className="auth-logo" />

                {/* Sekmeler */}
                <div className="auth-tabs" role="tablist">
                    <button
                        className={`auth-tab ${tab === "register" ? "active" : ""}`}
                        onClick={() => { setTab("register"); setError(null); }}
                        role="tab"
                        aria-selected={tab === "register"}
                    >
                        Register
                    </button>
                    <button
                        className={`auth-tab ${tab === "login" ? "active" : ""}`}
                        onClick={() => { setTab("login"); setError(null); }}
                        role="tab"
                        aria-selected={tab === "login"}
                    >
                        Login
                    </button>
                </div>

                {/* Hata Mesajı */}
                {error && <p className="auth-error" role="alert">{error}</p>}

                {/* Register Form */}
                {tab === "register" && (
                    <form className="auth-form" onSubmit={handleRegister}>
                        <div className="grid-2">
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="First Name"
                                aria-label="First Name"
                                required
                                value={regData.firstName}
                                onChange={(e) =>
                                    setRegData({ ...regData, firstName: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Last Name"
                                aria-label="Last Name"
                                required
                                value={regData.lastName}
                                onChange={(e) =>
                                    setRegData({ ...regData, lastName: e.target.value })
                                }
                            />
                        </div>
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Email Address"
                            aria-label="Email Address"
                            required
                            value={regData.email}
                            onChange={(e) =>
                                setRegData({ ...regData, email: e.target.value })
                            }
                        />

                        <div className="grid-2">
                            <div className="password-wrapper">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="auth-input"
                                    placeholder="Password"
                                    aria-label="Password"
                                    required
                                    value={regData.password}
                                    onChange={(e) =>
                                        setRegData({ ...regData, password: e.target.value })
                                    }
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
                                    value={regData.rePassword}
                                    onChange={(e) =>
                                        setRegData({ ...regData, rePassword: e.target.value })
                                    }
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
                                value={regData.phoneNumber}
                                onChange={(e) =>
                                    setRegData({ ...regData, phoneNumber: e.target.value })
                                }
                            />
                            <input
                                type="text"
                                className="auth-input"
                                placeholder="Company Name"
                                aria-label="Company Name"
                                required
                                value={regData.companyName}
                                onChange={(e) =>
                                    setRegData({ ...regData, companyName: e.target.value })
                                }
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
                            <option value="Quarterly">Quarterly</option>
                            <option value="HalfYearly">HalfYearly</option>
                            <option value="Yearly">Yearly</option>
                            <option value="Trial">Trial</option>
                        </select>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? "Please wait…" : "Register"}
                        </button>
                    </form>
                )}

                {/* Login Form */}
                {tab === "login" && (
                    <form className="auth-form" onSubmit={handleLogin}>
                        <input
                            type="email"
                            className="auth-input"
                            placeholder="Email Address"
                            aria-label="Email Address"
                            required
                            value={loginData.email}
                            onChange={(e) =>
                                setLoginData({ ...loginData, email: e.target.value })
                            }
                        />
                        <div className="password-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="auth-input"
                                placeholder="Password"
                                aria-label="Password"
                                required
                                value={loginData.password}
                                onChange={(e) =>
                                    setLoginData({ ...loginData, password: e.target.value })
                                }
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
                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? "Please wait…" : "Login"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthForm;
