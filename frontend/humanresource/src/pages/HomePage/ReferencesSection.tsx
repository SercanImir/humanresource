import React from "react";
import "./ReferenceSection.css"

// Transparan arkaplanlı PNG logolar
import decathlon1 from "../../assets/images/decathlon1.png";
import nike1     from "../../assets/images/nike1.png";
import penti1    from "../../assets/images/penti1.png";
import ipekyol1 from "../../assets/images/ipekyol1.png";
import jimmykey1 from "../../assets/images/jimmykey1.png";
import karaca1 from "../../assets/images/karaca1.png";
import puma1 from "../../assets/images/puma1.png";

export const ReferencesSection: React.FC = () => {
    const logos = [
        decathlon1,
        nike1,
        penti1,
        ipekyol1,
        puma1,
        jimmykey1,
        karaca1,

    ];

    return (
        <section className="refs-section" id="trusted">
            <h2 className="refs-title">Trusted by 1,800+ companies</h2>

            <div className="refs-marquee">
                <div className="refs-track">
                    {logos.concat(logos).map((src, idx) => (
                        <div key={idx} className="refs-logo-wrapper">
                            <img src={src} alt="Client logo" className="refs-logo" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};
