import React from "react";
import "./Footer.css";
import logo10 from "../../assets/images/logo10.png";

// react-icons’tan ihtiyacımız olanları import ediyoruz
import {
    FaInstagram,
    FaYoutube,
    FaLinkedin,
    FaTwitter,
    FaFacebook,
} from "react-icons/fa";

export const Footer: React.FC = () => (
    <footer className="footer">
        <div className="footer__inner">
            {/* Marka & tagline */}
            <div className="footer__section footer__brand">
                <img src={logo10} alt="PeopleMesh" className="footer__logo" />
                <p className="footer__tagline">
                    Empower Your Workforce. Anytime, Anywhere.
                </p>
            </div>

            {/* Hızlı Linkler */}
            <div className="footer__section">
                <h4 className="footer__heading">Quick Links</h4>
                <ul className="footer__links">
                    <li><a href="#home">Home</a></li>
                    <li><a href="#features">Features</a></li>
                    <li><a href="#pricing">Pricing</a></li>
                    <li><a href="#testimonials">Testimonials</a></li>
                    <li><a href="#contact">Contact</a></li>
                </ul>
            </div>

            {/* Destek */}
            <div className="footer__section">
                <h4 className="footer__heading">Support</h4>
                <ul className="footer__links">
                    <li><a href="#faq">FAQ</a></li>
                    <li><a href="#help">Help Center</a></li>
                    <li><a href="#terms">Terms of Service</a></li>
                    <li><a href="#privacy">Privacy Policy</a></li>
                </ul>
            </div>

            {/* İletişim & Adres */}
            <div className="footer__section">
                <h4 className="footer__heading">Contact & Address</h4>
                <p className="footer__contact">Email: support@peoplemesh.com</p>
                <p className="footer__contact">Phone: +90 555 123 4567</p>
                <address className="footer__address">
                    1234 HR Street<br />
                    Istanbul, Türkiye
                </address>
            </div>

            {/* Sosyal Medya */}
            <div className="footer__section footer__social">
                <h4 className="footer__heading">Follow Us</h4>
                <div className="footer__social-icons">
                    <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
                    <a href="https://youtube.com"    aria-label="YouTube"><FaYoutube /></a>
                    <a href="https://linkedin.com"   aria-label="LinkedIn"><FaLinkedin /></a>
                    <a href="https://twitter.com"    aria-label="Twitter"><FaTwitter /></a>
                    <a href="https://facebook.com"   aria-label="Facebook"><FaFacebook /></a>
                </div>
            </div>
        </div>

        {/* Alt bilgi */}
        <div className="footer__bottom">
            © 2025 PeopleMesh. All rights reserved.
        </div>
    </footer>
);