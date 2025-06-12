import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './CompanyListPage.css';
import logo10 from '../../assets/images/logo10.png';

// Feather icons
import { FiEdit2, FiArrowUpCircle, FiTrash2 } from 'react-icons/fi';

interface Company {
    id: string;
    name: string;
    startDate: string;
    endDate: string;
    plan: 'Monthly' | 'Yearly';
}

const companies: Company[] = [
    { id: '1', name: 'Acme Inc.',     startDate: '2024-01-01', endDate: '2025-01-01', plan: 'Monthly' },
    { id: '2', name: 'Beta Corp',     startDate: '2024-02-10', endDate: '2025-02-10', plan: 'Yearly' },
    { id: '3', name: 'Gamma LLC',     startDate: '2024-03-05', endDate: '2025-03-05', plan: 'Monthly' },
    { id: '4', name: 'Delta Ltd',     startDate: '2024-04-20', endDate: '2025-04-20', plan: 'Yearly' },
    { id: '5', name: 'Epsilon PLC',   startDate: '2024-05-15', endDate: '2025-05-15', plan: 'Monthly' },
    { id: '6', name: 'Zeta Systems',  startDate: '2024-06-01', endDate: '2025-06-01', plan: 'Yearly' },
];

export const CompanyListPage: React.FC = () => {
    const [search, setSearch] = useState('');

    const filtered = companies.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="d-flex admin-dashboard">
            {/* Sidebar */}
            <aside className="sidebar d-flex flex-column p-3 text-white">
                <div className="mb-4 text-center">
                    <img src={logo10} alt="PeopleMesh" className="logo mb-2" />
                    <h5>PEOPLEMESH</h5>
                </div>
                <nav className="nav nav-pills flex-column">
                    <a className="nav-link" href="#"><i className="bi bi-grid-fill me-2"></i>Dashboard</a>
                    <a className="nav-link active" href="#"><i className="bi bi-building me-2"></i>Companies</a>
                    <a className="nav-link" href="#"><i className="bi bi-calendar-check me-2"></i>Holidays</a>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-fill p-4 content-bg">
                <h1 className="mb-4">Companies</h1>

                {/* Search */}
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search companies..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>

                {/* Company Table */}
                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <table className="table mb-0 company-table">
                            <thead className="table-light">
                            <tr>
                                <th>Company Name</th>
                                <th>Start Date</th>
                                <th>End Date</th>
                                <th>Plan</th>
                                <th className="text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(c => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>{c.startDate}</td>
                                    <td>{c.endDate}</td>
                                    <td>{c.plan}</td>
                                    <td className="text-center">
                                        <FiEdit2
                                            className="action-icon"
                                            title="Edit"
                                            onClick={() => {/* open edit modal */}}
                                        />
                                        <FiArrowUpCircle
                                            className="action-icon"
                                            title="Upgrade Plan"
                                            onClick={() => {/* upgrade plan logic */}}
                                        />
                                        <FiTrash2
                                            className="action-icon text-danger"
                                            title="Delete"
                                            onClick={() => {/* delete logic */}}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="text-center py-4 text-muted">
                                        No companies found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};
