import React from "react";
import "./FeaturesSection.css";

// Projeye eklediğiniz asset görüntüleri
import orgChartImg   from "../../assets/images/org-chart.png";
import timeImg       from "../../assets/images/time-tracking.png";
import payrollImg    from "../../assets/images/payroll-expenses.png";
// analyticsImg  from "../../assets/images/analytics-dashboard.png"; // Analytics ikonunuzun dosya adı neyse onu kullanın

interface Feature {
    id: string;
    title: string;
    desc: string;
    img: string;
}

const features: Feature[] = [
    {
        id: "f1",
        title: "Employee Management",
        desc: "Manage your employees efficiently and effortlessly.",
        img: orgChartImg,
    },
    {
        id: "f2",
        title: "Time Tracking",
        desc: "Monitor work hours with ease.",
        img: timeImg,
    },
    {
        id: "f3",
        title: "Payroll & Expenses",
        desc: "Provide valuable, real-time insights.",
        img: payrollImg,
    },
    // {
    //     id: "f4",
    //     title: "Analytics Dashboard",
    //     desc: "Get an overview of all your HR metrics in one place.",
    //     //img:
    // },
];

export const FeaturesSection: React.FC = () => (
    <section className="features-section" id="features">
        <h2 className="features-title">Our Features</h2>

        <div className="features-grid">
            {features.map((f) => (
                <div key={f.id} className="feature-card">
                    <img
                        src={f.img}
                        alt={f.title}
                        className="feature-icon"
                    />
                    <h3 className="feature-title">{f.title}</h3>
                    <p className="feature-desc">{f.desc}</p>
                </div>
            ))}
        </div>
    </section>
);
