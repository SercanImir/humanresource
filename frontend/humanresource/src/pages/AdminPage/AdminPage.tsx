import React from 'react';
import Swal from 'sweetalert2';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './AdminPage.css';
import logo10 from '../../assets/images/logo10.png';

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip
);

interface Termination { company: string; endDate: string; daysLeft: number; }
interface Holiday     { name: string; date: string; }

// Sizin halihazırdaki verileriniz:
const terminations: Termination[] = [
    { company: 'Acme Inc.', endDate: '2024-05-15', daysLeft: 30 },
    { company: 'Beta Corp', endDate: '2024-06-20', daysLeft: 66 },
    { company: 'Gamma LLC', endDate: '2024-07-10', daysLeft: 86 },
];
const holidays: Holiday[] = [
    { name: "New Year's Day", date: '2024-01-01' },
    { name: 'Labor Day',      date: '2024-05-01' },
    { name: 'Republic Day',   date: '2024-10-29' },
];

export const AdminPage: React.FC = () => {
    // ——— Grafik için dinamik veri & etiket oluşturma ———
    // Örnek olarak 8 aylık veri: (bunu API'den çektiğiniz şirket sayısı verisiyle değiştirin)
    const dataPerMonth = [12, 15, 14, 18, 20, 22, 25, 30,14,20,11,12];
    const pointCount   = dataPerMonth.length;

    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    const todayMonth = new Date().getMonth();
    let startMonth   = todayMonth - pointCount + 1;
    if (startMonth < 0) startMonth += 12;

    const labels = Array.from({ length: pointCount }, (_, i) =>
        MONTHS[(startMonth + i) % 12]
    );

    const chartData = {
        labels,
        datasets: [{
            label: 'Ends',
            data: dataPerMonth,
            borderColor: '#FFC107',
            backgroundColor: 'rgba(255,193,7,0.1)',
            tension: 0.3,
            fill: true,
            pointRadius: 4,
            pointBackgroundColor: '#FFC107'
        }]
    };

    const chartOptions = {
        plugins: { legend: { display: false }, tooltip: { enabled: true } },
        scales: {
            x: {
                grid:      { display: false },
                ticks:     {
                    callback: (_: any, idx: number) => {
                        // ≤12 nokta: her ay; >12 nokta: 3’er aylık etiket
                        return pointCount > 12
                            ? (idx % 3 === 0 ? labels[idx] : '')
                            : labels[idx];
                    },
                    maxRotation: 0,
                    autoSkip:    false
                }
            },
            y: { grid: { color: '#e9ecef' }, beginAtZero: true }
        }
    };

    const handleRowClick = (t: Termination) => {
        Swal.fire({
            title: t.company,
            text:  `Plan ends on ${t.endDate}. ${t.daysLeft} days remaining.`,
            icon:  'info',
            confirmButtonColor: '#0A1F44'
        });
    };

    return (
        <div className="d-flex admin-dashboard">
            {/* Sidebar */}
            <aside className="sidebar d-flex flex-column p-3 text-white">
                <div className="mb-4 text-center">
                    <img src={logo10} alt="PeopleMesh" className="logo mb-2"/>
                    <h5>PEOPLEMESH</h5>
                </div>
                <nav className="nav nav-pills flex-column">
                    <a className="nav-link active" href="#"><i className="bi bi-grid-fill me-2"></i>Dashboard</a>
                    <a className="nav-link" href="#"><i className="bi bi-building me-2"></i>Companies</a>
                    <a className="nav-link" href="#"><i className="bi bi-calendar-check me-2"></i>Holidays</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-fill p-4 content-bg">
                <h1 className="mb-4">Dashboard</h1>

                {/* ——— Metric Cards (Birebir korunuyor) ——— */}
                <div className="row g-3 mb-4">
                    <div className="col-md-4">
                        <div className="card stat-card shadow-sm">
                            <div className="card-body text-center">
                                <i className="bi bi-building stat-icon"></i>
                                <p className="stat-title">Total Companies</p>
                                <h2 className="stat-number">12</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card stat-card shadow-sm">
                            <div className="card-body text-center">
                                <i className="bi bi-people stat-icon"></i>
                                <p className="stat-title">Total Managers</p>
                                <h2 className="stat-number">45</h2>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card stat-card shadow-sm">
                            <div className="card-body text-center">
                                <i className="bi bi-people-fill stat-icon"></i>
                                <p className="stat-title">Total Employees</p>
                                <h2 className="stat-number">3,457</h2>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ——— Grafik & Holidays ——— */}
                <div className="row g-3 mb-4">
                    <div className="col-lg-8">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Upcoming Subscription Ends</h5>
                                <Line data={chartData} options={chartOptions} />
                            </div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Holidays</h5>
                                <ul className="list-group list-group-flush">
                                    {holidays.map(h => (
                                        <li key={h.name} className="list-group-item holiday-item">
                                            <i className="bi bi-calendar-date-fill me-2"></i>
                                            <span>{h.name}</span>
                                            <small className="text-muted float-end">{h.date}</small>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ——— Table (Aynen korunuyor) ——— */}
                <div className="card shadow-sm">
                    <div className="card-body">
                        <h5 className="card-title">Upcoming Subscription Ends</h5>
                        <table className="table mb-0">
                            <thead className="table-light">
                            <tr>
                                <th>Company</th>
                                <th>End Date</th>
                                <th>Days Left</th>
                            </tr>
                            </thead>
                            <tbody>
                            {terminations.map(t => (
                                <tr
                                    key={t.company}
                                    className="table-row"
                                    onClick={() => handleRowClick(t)}
                                >
                                    <td>{t.company}</td>
                                    <td>{t.endDate}</td>
                                    <td>{t.daysLeft}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};
