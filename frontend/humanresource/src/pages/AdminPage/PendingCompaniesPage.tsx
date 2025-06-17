import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './PendingCompaniesPage.css'
import { FiCheck, FiX } from 'react-icons/fi'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

type PlanOption = 'Monthly' | 'Yearly' | 'Quarterly' | 'HalfYearly' | 'Trial'

interface PendingCompany {
    companyId: number
    companyName: string
    applicantFirstName: string
    applicantLastName: string
    applicantEmail: string
    phoneNumber: string
    subscriptionType: PlanOption
    registrationDate: string  // ← Sadece bu alan gösterilecek
}

export const PendingCompaniesPage: React.FC = () => {
    const [list, setList]               = useState<PendingCompany[]>([])
    const [search, setSearch]           = useState('')
    const [loading, setLoading]         = useState(false)
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 12

    // 1) Bekleyenleri çek
    const fetchPending = async () => {
        setLoading(true)
        try {
            const token = localStorage.getItem('token') || ''
            const resp = await fetch(
                'http://localhost:9090/api/admin/companies/pending',
                {
                    method: 'GET',
                    headers: { Authorization: `Bearer ${token}` }
                }
            )
            if (!resp.ok) {
                console.error('Fetch err:', resp.status, await resp.text())
                return
            }
            const body = await resp.json()
            setList(body.data as PendingCompany[])
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPending()
    }, [])

    // 2) ISO → yerel tarih
    const formatDate = (iso: string): string => {
        const d = new Date(iso)
        return isNaN(d.getTime()) ? '—' : d.toLocaleDateString()
    }

    // 3) Onay / Reddet
    const handleApprove = (id: number) =>
        MySwal.fire({
            title: 'Bu başvuruyu onaylıyor musunuz?',
            icon:  'warning',
            showCancelButton: true,
            confirmButtonText: 'Evet, onayla'
        }).then(async ({ isConfirmed }) => {
            if (!isConfirmed) return
            const token = localStorage.getItem("token") || ''
            const resp = await fetch(
                `http://localhost:9090/api/admin/companies/${id}/approve`,
                { method: 'POST', headers:
                        { Authorization: `Bearer ${token}`   } }
            )
            const body = await resp.json()
            if (resp.ok) {
                MySwal.fire('Onaylandı', body.message, 'success')
                fetchPending()
            } else {
                MySwal.fire('Hata', body.message || resp.statusText, 'error')
            }
        })

    const handleReject = (id: number) =>
        MySwal.fire({
            title: 'Bu başvuruyu reddetmek istediğinize emin misiniz?',
            icon:  'question',
            showCancelButton: true,
            confirmButtonText: 'Evet, reddet'
        }).then(async ({ isConfirmed }) => {
            if (!isConfirmed) return
            const token = localStorage.getItem("token") || ''
            const resp = await fetch(
                `http://localhost:9090/api/admin/companies/${id}/reject`,
                { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
            )
            const body = await resp.json()
            if (resp.ok) {
                MySwal.fire('Reddedildi', body.message, 'info')
                fetchPending()
            } else {
                MySwal.fire('Hata', body.message || resp.statusText, 'error')
            }
        })

    // 4) Arama & sayfalama
    const filtered = list.filter(c =>
        c.companyName.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages   = Math.ceil(filtered.length / pageSize)
    const paginatedList = filtered.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    return (
        <div className="d-flex admin-dashboard">
            <main className="flex-fill p-4 content-bg">
                <h1 className="mb-4">Pending Companies</h1>

                {/* Arama */}
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search companies..."
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                    />
                </div>

                {/* Yükleniyorsa */}
                {loading ? (
                    <p>Yükleniyor…</p>
                ) : (
                    <div className="card shadow-sm">
                        <div className="card-body p-0">
                            <table className="table mb-0 pending-table">
                                <thead className="table-light">
                                <tr>
                                    <th>Company Name</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Phone Number</th>
                                    <th>Applied On</th>        {/* ← Sütun başlığı */}
                                    <th>Subscription Type</th>
                                    <th className="text-center">Actions</th>
                                </tr>
                                </thead>
                                <tbody>
                                {paginatedList.map(c => (
                                    <tr key={c.companyId}>
                                        <td>{c.companyName}</td>
                                        <td>{c.applicantFirstName} {c.applicantLastName}</td>
                                        <td>{c.applicantEmail}</td>
                                        <td>{c.phoneNumber || '—'}</td>
                                        <td>{formatDate(c.registrationDate)}</td> {/* ← Yalnızca burası */}
                                        <td>{c.subscriptionType}</td>
                                        <td className="text-center">
                                            <button
                                                className="btn btn-success btn-action me-2"
                                                onClick={() => handleApprove(c.companyId)}
                                            ><FiCheck/></button>
                                            <button
                                                className="btn btn-outline-danger btn-action"
                                                onClick={() => handleReject(c.companyId)}
                                            ><FiX/></button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedList.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="text-center py-4 text-muted">
                                            No pending companies found.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* 5) Pagination */}
                {totalPages > 1 && (
                    <nav className="mt-3">
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <li
                                    key={page}
                                    className={`page-item ${page === currentPage ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => setCurrentPage(page)}
                                    >
                                        {page}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </main>
        </div>
    )
}
