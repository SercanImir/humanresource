
import "./HeroSection.css";
import heroImg from "../../assets/images/hero-dashboard.png"; // indirdiğin dosya

function HeroSection (){
    return (
        <section className="hero-section" id="home">
            {/* SOLDAN YAZI BLOĞU */}
            <div className="hero-text">
                <h1>Empower Your Workforce</h1>
                <p>
                    A global, all-in-one HR management platform that connects people
                    seamlessly.
                </p>
                <button className="cta-btn">Get Started</button>
            </div>

            {/* SAĞDAN GÖRSEL BLOĞU */}
            <div className="hero-image-wrapper">
                <div className="shadow-box shadow-box-1" />
                <div className="shadow-box shadow-box-2" />
                <img
                    src={heroImg}
                    alt="Dashboard preview"
                    className="hero-image"
                />
            </div>
        </section>
    );
}
export default HeroSection;
