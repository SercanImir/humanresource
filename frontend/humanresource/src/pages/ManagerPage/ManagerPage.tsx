// src/pages/ManagerPage/ManagerPage.tsx

import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './ManagerPage.css';

import logo10 from '../../assets/images/logo10.png';

interface ManagerStats {
    totalEmployees: number;
    activeShifts: number;
    totalAssets: number;
}

interface LeaveRequest {
    id: number;
    employeeName: string;
    type: string;
    status: string;
    date: string;
}

interface ExpenseRequest {
    id: number;
    employeeName: string;
    amount: number;
    status: string;
    date: string;
}

interface Birthday {
    employeeName: string;
    date: string;
}

interface Holiday {
    name: string;
    date: string;
}

export const ManagerPage: React.FC = () => {
    const [activePage, setActivePage] = useState<'dashboard' | 'leaves' | 'expenses' | 'employees'>('dashboard');
    const [stats, setStats] = useState<ManagerStats>({ totalEmployees: 0, activeShifts: 0, totalAssets: 0 });
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
    const [expenseRequests, setExpenseRequests] = useState<ExpenseRequest[]>([]);
    const [birthdays, setBirthdays] = useState<Birthday[]>([]);
    const [holidays, setHolidays] = useState<Holiday[]>([]);
    const [showAddEmployee, setShowAddEmployee] = useState<boolean>(false);

    useEffect(() => {
        if (activePage === 'dashboard') {
            setStats({ totalEmployees: 42, activeShifts: 5, totalAssets: 38 });
            setLeaveRequests([
                { id: 1, employeeName: 'Ali Yılmaz', type: 'Yıllık İzin', status: 'Beklemede', date: '2025-06-20' },
                { id: 2, employeeName: 'Ayşe Koç', type: 'Doğum İzni', status: 'Beklemede', date: '2025-06-19' },
                { id: 3, employeeName: 'Emre Kılıç', type: 'Evlilik İzni', status: 'Beklemede', date: '2025-06-18' },
                { id: 4, employeeName: 'Canan Toprak', type: 'Yıllık İzin', status: 'Beklemede', date: '2025-06-17' },
                { id: 5, employeeName: 'Kemal Usta', type: 'Hastalık İzni', status: 'Beklemede', date: '2025-06-16' },
            ]);
            setExpenseRequests([
                { id: 1, employeeName: 'Zeynep Kılıç', amount: 450, status: 'Beklemede', date: '2025-06-19' },
                { id: 2, employeeName: 'Okan Güneş', amount: 200, status: 'Beklemede', date: '2025-06-18' },
                { id: 3, employeeName: 'Hatice Ak', amount: 750, status: 'Beklemede', date: '2025-06-17' },
                { id: 4, employeeName: 'Murat Bal', amount: 300, status: 'Beklemede', date: '2025-06-16' },
                { id: 5, employeeName: 'Seda Aydemir', amount: 650, status: 'Beklemede', date: '2025-06-15' },
            ]);
            setBirthdays([{ employeeName: 'Mehmet Demir', date: '2025-06-20' }]);
            setHolidays([{ name: 'Kurban Bayramı', date: '2025-06-28' }]);
        }
    }, [activePage]);

    const NavLink = ({ page, icon, children }: { page: typeof activePage; icon: string; children: React.ReactNode }) => (
        <a
            className={`nav-link${activePage === page ? ' active' : ''}`}
            onClick={() => setActivePage(page)}
            style={{ cursor: 'pointer' }}
        >
            <i className={`${icon} me-2`}></i>{children}
        </a>
    );

    const toggleAddEmployee = () => setShowAddEmployee(!showAddEmployee);

    return (
        <div className="d-flex admin-dashboard">
            <aside className="sidebar d-flex flex-column p-3 text-white">
                <div className="mb-4 text-center">
                    <img src={logo10} alt="PeopleMesh" className="logo mb-2" />
                </div>
                <nav className="nav nav-pills flex-column">
                    <NavLink page="dashboard" icon="bi bi-speedometer2">Dashboard</NavLink>
                    <NavLink page="employees" icon="bi bi-people">Çalışanlar</NavLink>
                    <NavLink page="leaves" icon="bi bi-calendar2-week">İzinler</NavLink>
                    <NavLink page="expenses" icon="bi bi-cash">Harcamalar</NavLink>
                </nav>
            </aside>

            <main className="flex-fill p-4 content-bg">
                {activePage === 'dashboard' && (
                    <>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h1 className="mb-0">Yönetici Paneli</h1>
                            <button onClick={toggleAddEmployee} className="btn btn-success">
                                <i className="bi bi-person-plus me-2"></i>Yeni Çalışan Ekle
                            </button>
                        </div>

                        {showAddEmployee && (
                            <div className="card shadow-sm mb-4">
                                <div className="card-body">
                                    <h5 className="card-title">Çalışan Bilgileri</h5>
                                    <form className="row g-3">
                                        <div className="col-md-4">
                                            <input type="text" className="form-control" placeholder="Ad Soyad" required />
                                        </div>
                                        <div className="col-md-4">
                                            <input type="email" className="form-control" placeholder="Email" required />
                                        </div>
                                        <div className="col-md-4">
                                            <input type="text" className="form-control" placeholder="Telefon" />
                                        </div>
                                        <div className="col-12 text-end">
                                            <button type="submit" className="btn btn-primary">Kaydet</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">En Yeni 5 İzin Talebi</h5>
                                        <ul className="list-group">
                                            {leaveRequests.slice(0, 5).map(r => (
                                                <li key={r.id} className="list-group-item d-flex justify-content-between">
                                                    <span>{r.employeeName} - {r.type}</span>
                                                    <span className="badge bg-warning text-dark">{r.status}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="col-md-6">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">En Yeni 5 Harcama</h5>
                                        <ul className="list-group">
                                            {expenseRequests.slice(0, 5).map(e => (
                                                <li key={e.id} className="list-group-item d-flex justify-content-between">
                                                    <span>{e.employeeName} - ₺{e.amount}</span>
                                                    <span className="badge bg-warning text-dark">{e.status}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
};