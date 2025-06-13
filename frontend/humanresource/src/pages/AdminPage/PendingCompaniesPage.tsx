// src/pages/PendingCompanies/PendingCompaniesPage.tsx
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './PendingCompaniesPage.css';
import logo10 from '../../assets/images/logo10.png';
import { FiCheckCircle,  FiCheck, FiX } from 'react-icons/fi';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

type PlanOption = 'Monthly' | 'Yearly' | 'Quarterly' | 'HalfYearly' | 'Trial';

interface PendingCompany {
    companyId: number;
    companyName: string;
    applicantFirstName: string;
    applicantLastName: string;
    applicantEmail: string;
    subscriptionType: PlanOption;
    registrationDate: string; // ISO string
}

export const PendingCompaniesPage: React.FC = () => {
    const [list, setList] = useState<PendingCompany[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // 1) Bekleyen listeyi çeker
    const fetchPending = async () => {
        setLoading(true);
        try {
            const resp = await fetch('http://localhost:9090/api/admin/companies/pending', {
                headers: { Authorization: localStorage.getItem('authToken') || '' }
            });
            const body = await resp.json();
            if (resp.ok) {
                setList(body.data);
            } else {
                console.error(body);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    // 2) Plan dropdown’ı değiştiğinde local state’i güncelle
    const handlePlanChange = (companyId: number, plan: PlanOption) => {
        setList(lst =>
            lst.map(c => (c.companyId === companyId ? { ...c, subscriptionType: plan } : c))
        );
        // eğer backend’de bunu kaydetmek isterseniz:
        // await fetch(`/api/admin/companies/${companyId}/plan`, { method:'PUT', body: JSON.stringify({plan}), headers: ... })
    };

    // 3) Onaylama
    const handleApprove = async (companyId: number) => {
        const confirm = await MySwal.fire({
            title: 'Bu başvuruyu onaylıyor musunuz?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, onayla',
            cancelButtonText: 'Hayır'
        });
        if (!confirm.isConfirmed) return;

        const resp = await fetch(`http://localhost:9090/api/admin/companies/approve/${companyId}`, {
            method: 'POST',
            headers: { Authorization: localStorage.getItem('authToken') || '' }
        });
        const body = await resp.json();
        if (resp.ok) {
            MySwal.fire('Onaylandı', body.message, 'success');
            fetchPending();
        } else {
            MySwal.fire('Hata', body.message || 'Beklenmeyen hata', 'error');
        }
    };

    // 4) Reddetme
    const handleReject = async (companyId: number) => {
        const confirm = await MySwal.fire({
            title: 'Bu başvuruyu reddetmek istediğinize emin misiniz?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Evet, reddet',
            cancelButtonText: 'İptal'
        });
        if (!confirm.isConfirmed) return;

        // backend’de reject endpoint yoksa bunu ekleyin:
        const resp = await fetch(`http://localhost:9090/api/admin/companies/reject/${companyId}`, {
            method: 'POST',
            headers: { Authorization: localStorage.getItem('authToken') || '' }
        });
        const body = await resp.json();
        if (resp.ok) {
            MySwal.fire('Reddedildi', body.message, 'info');
            fetchPending();
        } else {
            MySwal.fire('Hata', body.message || 'Beklenmeyen hata', 'error');
        }
    };

    const filtered = list.filter(c =>
        c.companyName.toLowerCase().includes(search.toLowerCase())
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
                    <a className="nav-link" href="#">Dashboard</a>
                    <a className="nav-link active" href="#">Companies</a>
                    <a className="nav-link" href="#">Holidays</a>
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

                {loading ? (
                    <p>Yükleniyor…</p>
                ) : (
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <table className="table mb-0 pending-table">
                                <thead className="table-light">
                                <tr>
                                    <th>Company Name</th>
                                    <th>Applicant</th>
                                    <th>Email</th>
                                    <th>Email Verified</th>
                                    <th>Requested Plan</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {filtered.map(c => (
                                    <tr key={c.companyId}>
                                        <td>{c.companyName}</td>
                                        <td>{c.applicantFirstName} {c.applicantLastName}</td>
                                        <td>{c.applicantEmail}</td>
                                        <td>
                                            {/** applicantEmailVerified da DTO’ya eklerseniz */}
                                            <FiCheckCircle className="icon-verified text-warning"/>
                                        </td>
                                        <td>
                                            <select
                                                className="form-select plan-select"
                                                value={c.subscriptionType}
                                                onChange={e =>
                                                    handlePlanChange(
                                                        c.companyId,
                                                        e.target.value as PlanOption
                                                    )
                                                }
                                            >
                                                <option>Monthly</option>
                                                <option>Quarterly</option>
                                                <option>HalfYearly</option>
                                                <option>Yearly</option>
                                                <option>Trial</option>
                                            </select>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-success btn-action me-2"
                                                title="Approve"
                                                onClick={() => handleApprove(c.companyId)}
                                            >
                                                <FiCheck />
                                            </button>
                                            <button
                                                className="btn btn-outline-danger btn-action"
                                                title="Reject"
                                                onClick={() => handleReject(c.companyId)}
                                            >
                                                <FiX />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="text-center py-4 text-muted">
                                            No pending companies found.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};