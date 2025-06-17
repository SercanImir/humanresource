// src/pages/AdminPage/AdminPage.tsx

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './AdminPage.css';

import logo10 from '../../assets/images/logo10.png';
import { PendingCompaniesPage } from './PendingCompaniesPage';
import { CompanyListPage } from './CompanyListPage';

Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Filler
);

interface Termination { company: string; endDate: string; daysLeft: number; }
interface Holiday     { name: string; date: string; }

// API’den geldikçe güncellenecek istatistik tipi
interface Statistics {
    totalCompanies: number;
    totalManagers:  number;
    totalEmployees: number;
}

// interface Termination artık subscriptionEnd ISO string’ini ve daysLeft’i tutacak
interface Termination {
    company: string;
    endDate: string;
    daysLeft: number;
}

export const AdminPage: React.FC = () => {
    // Sayfa durumu
    const [activePage, setActivePage] = useState<'dashboard'|'pending'|'companies'|'holidays'>('dashboard');

    // ❶ İstatistikleri tutacak state
    const [stats, setStats] = useState<Statistics>({
        totalCompanies: 0,
        totalManagers:  0,
        totalEmployees: 0
    });

    const [upcoming, setUpcoming] = useState<Termination[]>([]);

    // ❷ Dashboard aktif olduğunda backend’den al
    useEffect(() => {
        if (activePage === 'dashboard') {
            (async () => {
                const token = localStorage.getItem('token') || '';

                // 1) İstatistikler
                const statRes = await fetch('http://localhost:9090/api/admin/statistics', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (statRes.ok) {
                    setStats(await statRes.json());
                }

                // 2) Onaylanmış şirketleri al
                const compRes = await fetch('http://localhost:9090/api/admin/companies', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (!compRes.ok) {
                    console.error('Companies yüklenemedi:', compRes.status);
                    return;
                }
                const comps: Array<{
                    companyName: string;
                    subscriptionEnd: string;
                }> = (await compRes.json()).data;

                // 3) Tarihe göre sırala, kalan gününü hesapla, 0’dan büyükleri al, ilk 3’ü seç
                const today = Date.now();
                const next3 = comps
                    .map(c => {
                        const endTs = Date.parse(c.subscriptionEnd);
                        const days = Math.ceil((endTs - today) / (1000 * 60 * 60 * 24));
                        return { company: c.companyName, endDate: c.subscriptionEnd, daysLeft: days };
                    })
                    .filter(t => t.daysLeft >= 0)
                    .sort((a, b) => a.daysLeft - b.daysLeft)
                    .slice(0, 3);

                setUpcoming(next3);
            })();
        }
    }, [activePage]);

    // NavLink bileşeni
    const NavLink = ({ page, icon, children }
                     : { page: typeof activePage; icon: string; children: React.ReactNode }) => (
        <a
            className={`nav-link${activePage===page ? ' active' : ''}`}
            onClick={() => setActivePage(page)}
            style={{ cursor: 'pointer' }}
        >
            <i className={`${icon} me-2`}></i>{children}
        </a>
    );

    // Grafik verileri (static örnek)
    const dataPerMonth = [12,15,14,18,20,22,25,30,14,20,11,12];
    const pointCount   = dataPerMonth.length;
    const MONTHS       = ['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
    const todayMonth   = new Date().getMonth();
    let startMonth     = todayMonth - pointCount + 1;
    if (startMonth < 0) startMonth += 12;
    const labels = Array.from({ length: pointCount }, (_, i) =>
        MONTHS[(startMonth + i) % 12]
    );
    const chartData = {
        labels,
        datasets: [{
            label: 'Sona Erenler',
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
        plugins:{ legend:{ display:false }, tooltip:{ enabled:true } },
        scales:{
            x:{ grid:{ display:false },
                ticks:{
                    callback: (_: any, idx: number) =>
                        pointCount>12 ? (idx%3===0?labels[idx]:'') : labels[idx],
                    maxRotation:0, autoSkip:false
                }
            },
            y:{ grid:{ color:'#e9ecef' }, beginAtZero:true }
        }
    };

    // Örnek popup fonksiyonu
    const handleRowClick = (t: Termination) => {
        Swal.fire({
            title: t.company,
            text:  `Abonelik ${t.endDate} tarihinde sona eriyor. Kalan gün: ${t.daysLeft}`,
            icon:  'info',
            confirmButtonColor: '#0A1F44'
        });
    };



    const holidays: Holiday[] = [
        { name: "Yeni Yıl Günü",     date: '2024-01-01' },
        { name: 'İşçi Bayramı',      date: '2024-05-01' },
        { name: 'Cumhuriyet Bayramı', date: '2024-10-29' },
    ];

    return (
        <div className="d-flex admin-dashboard">
            {/* --- Sidebar --- */}
            <aside className="sidebar d-flex flex-column p-3 text-white">
                <div className="mb-4 text-center">
                    <img src={logo10} alt="PeopleMesh" className="logo mb-2" />
                </div>
                <nav className="nav nav-pills flex-column">
                    <NavLink page="dashboard" icon="bi bi-speedometer2">Dashboard</NavLink>
                    <NavLink page="pending"   icon="bi bi-clock-fill">Pending Companies</NavLink>
                    <NavLink page="companies" icon="bi bi-building">Companies</NavLink>
                    <NavLink page="holidays"  icon="bi bi-calendar-check">Holidays</NavLink>
                </nav>
            </aside>

            {/* --- Main Content --- */}
            <main className="flex-fill p-4 content-bg">
                {activePage === 'dashboard' && (
                    <>
                        <h1 className="mb-4">Dashboard</h1>

                        {/* ❸ İstatistik Kartları */}
                        <div className="row g-3 mb-4">
                            <div className="col-md-4">
                                <div className="card stat-card shadow-sm">
                                    <div className="card-body text-center">
                                        <i className="bi bi-building stat-icon"></i>
                                        <p className="stat-title">Toplam Şirket</p>
                                        <h2 className="stat-number">{stats.totalCompanies}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card stat-card shadow-sm">
                                    <div className="card-body text-center">
                                        <i className="bi bi-person-badge stat-icon"></i>
                                        <p className="stat-title">Toplam Yöneticiler</p>
                                        <h2 className="stat-number">{stats.totalManagers}</h2>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-4">
                                <div className="card stat-card shadow-sm">
                                    <div className="card-body text-center">
                                        <i className="bi bi-people-fill stat-icon"></i>
                                        <p className="stat-title">Toplam Çalışan</p>
                                        <h2 className="stat-number">{stats.totalEmployees}</h2>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ❹ Grafik & Tatiller */}
                        <div className="row g-3 mb-4">
                            <div className="col-lg-8">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">Bitiş Tarihleri</h5>
                                        <Line data={chartData} options={chartOptions} />
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-4">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">Resmi Tatiller</h5>
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

                        {/* ❺ Yaklaşan Abonelikler */}
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h5 className="card-title">Yaklaşan Abonelikler</h5>
                                <table className="table mb-0">
                                    <thead className="table-light">
                                    <tr>
                                        <th>Şirket</th>
                                        <th>Bitiş Tarihi</th>
                                        <th>Kalan Gün</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {upcoming.map(t => (
                                        <tr key={t.company} onClick={() => handleRowClick(t)}>
                                            <td>{t.company}</td>
                                            <td>{new Date(t.endDate).toLocaleDateString()}</td>
                                            <td>{t.daysLeft}</td>
                                        </tr>
                                    ))}
                                    {upcoming.length === 0 && (
                                        <tr>
                                            <td colSpan={3} className="text-center py-4 text-muted">
                                                Yaklaşan abonelik bulunamadı.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {activePage === 'pending'   && <PendingCompaniesPage />}
                {activePage === 'companies' && <CompanyListPage />}
                {activePage === 'holidays'  && (
                    <>
                        <h1 className="mb-4">Resmi Tatiller</h1>
                        <ul className="list-group list-group-flush">
                            {holidays.map(h => (
                                <li key={h.name} className="list-group-item holiday-item">
                                    <i className="bi bi-calendar-date-fill me-2"></i>
                                    <span>{h.name}</span>
                                    <small className="text-muted float-end">{h.date}</small>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    );
};
