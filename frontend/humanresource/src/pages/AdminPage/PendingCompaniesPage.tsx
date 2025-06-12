import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PendingCompaniesPage.css';
import logo10 from '../../assets/images/logo10.png';
import { FiCheckCircle, FiXCircle, FiCheck, FiX } from 'react-icons/fi';

interface PendingCompany {
    id: string;
    name: string;
    emailVerified: boolean;
    requestedPlan: 'Monthly' | 'Yearly';
}

const initialList: PendingCompany[] = [
    { id: '1', name: 'Acme Inc.',     emailVerified: true,  requestedPlan: 'Monthly' },
    { id: '2', name: 'Beta Corp',     emailVerified: true,  requestedPlan: 'Yearly' },
    { id: '3', name: 'Gamma LLC',     emailVerified: false, requestedPlan: 'Monthly' },
    { id: '4', name: 'Delta Ltd',     emailVerified: false, requestedPlan: 'Monthly' },
    { id: '5', name: 'Epsilon PLC',   emailVerified: true,  requestedPlan: 'Monthly' },
];

export const PendingCompaniesPage: React.FC = () => {
    const [list, setList] = useState<PendingCompany[]>(initialList);
    const [search, setSearch] = useState('');

    const filtered = list.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    );

    const handlePlanChange = (id: string, plan: 'Monthly' | 'Yearly') => {
        setList(lst =>
            lst.map(c => (c.id === id ? { ...c, requestedPlan: plan } : c))
        );
    };

    const handleApprove = (id: string) => {
        // TODO: API call to approve + assign plan
        console.log('Approve', id);
        setList(lst => lst.filter(c => c.id !== id));
    };

    const handleReject = (id: string) => {
        // TODO: API call to reject
        console.log('Reject', id);
        setList(lst => lst.filter(c => c.id !== id));
    };

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
                <h1 className="mb-4">Pending Companies</h1>

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

                {/* Pending Companies Table */}
                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <table className="table mb-0 pending-table">
                            <thead className="table-light">
                            <tr>
                                <th>Company Name</th>
                                <th>Email Verified</th>
                                <th>Requested Plan</th>
                                <th className="text-center">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filtered.map(c => (
                                <tr key={c.id}>
                                    <td>{c.name}</td>
                                    <td>
                                        {c.emailVerified
                                            ? <FiCheckCircle className="icon-verified text-warning"/>
                                            : <FiXCircle className="icon-verified text-muted"/>}
                                    </td>
                                    <td>
                                        <select
                                            className="form-select plan-select"
                                            value={c.requestedPlan}
                                            onChange={e =>
                                                handlePlanChange(
                                                    c.id,
                                                    e.target.value as 'Monthly' | 'Yearly'
                                                )
                                            }
                                        >
                                            <option>Monthly</option>
                                            <option>Yearly</option>
                                        </select>
                                    </td>
                                    <td className="text-center">
                                        <button
                                            className="btn btn-success btn-action me-2"
                                            title="Approve"
                                            onClick={() => handleApprove(c.id)}
                                        >
                                            <FiCheck />
                                        </button>
                                        <button
                                            className="btn btn-outline-danger btn-action"
                                            title="Reject"
                                            onClick={() => handleReject(c.id)}
                                        >
                                            <FiX />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4 text-muted">
                                        No pending companies found.
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