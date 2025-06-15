
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import logo10 from "../../assets/images/logo10.png";

export const Navbar = () => {
    const navigate = useNavigate();

    const handleGetStarted = () => {
        navigate("/register-login");                // butona tıklanınca bu rotaya gider
    };
    return (
        <header className="navbar">
            <div className="navbar__left">
                <img src={logo10} alt="PeopleMesh" className="navbar__logo" />
            </div>
            <nav className="navbar__center">
                <a href="#home" className="navbar__link">Home</a>
                <a href="#features" className="navbar__link">Features</a>
                <a href="#pricing" className="navbar__link">Pricing</a>
                <a href="#about" className="navbar__link">About</a>
                <a href="#contact" className="navbar__link">Contact</a>
            </nav>
            <div className="navbar__right">
                <button onClick={handleGetStarted} className="navbar__cta">Get Started</button>
            </div>
        </header>
    );
};