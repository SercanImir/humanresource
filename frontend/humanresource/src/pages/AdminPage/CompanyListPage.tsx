import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './CompanyListPage.css'

import { AiOutlineEye } from 'react-icons/ai'
import { BiPowerOff }  from 'react-icons/bi'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

interface Company {
    id: number
    companyName: string
    companyPhoneNumber: string
    companyAddress: string
    applicantFirstName: string
    applicantLastName: string
    companyEmail: string
    registrationDate: string
    subscriptionType: string
    subscriptionStart: string
    subscriptionEnd: string
    active: boolean
}

export const CompanyListPage: React.FC = () => {
    const [list, setList] = useState<Company[]>([])
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const pageSize = 15

    // → 1) Veri çekme
    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token") || ''
            const resp = await fetch('http://localhost:9090/api/admin/companies', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const body = await resp.json()
            setList(body.data as Company[])
        })()
    }, [])

    // → 2) Tarih formatlayıcı
    const formatDate = (iso: string) =>
        isNaN(Date.parse(iso)) ? '—' : new Date(iso).toLocaleDateString()

    // → 3) Pasif/Aktif toggle sweetalert ile
    const toggleActive = async (c: Company) => {
        const { isConfirmed } = await MySwal.fire({
            title: c.active ? 'Pasifleştirmek istediğine emin misin?' : 'Aktifleştirmek istediğine emin misin?',
            icon:  c.active ? 'warning' : 'question',
            showCancelButton: true,
            confirmButtonText: 'Evet',
            cancelButtonText: 'Hayır',
            reverseButtons: true,
        })

        if (!isConfirmed) return

        try {
            const token = localStorage.getItem("token") || ''
            const resp = await fetch(
                `http://localhost:9090/api/admin/companies/${c.id}/toggle`,
                { method: 'POST', headers: { Authorization: `Bearer ${token}` } }
            )
            const body = await resp.json()
            if (!resp.ok) throw new Error(body.message || resp.statusText)

            setList(lst =>
                lst.map(x => x.id === c.id ? { ...x, active: !x.active } : x)
            )
            await MySwal.fire(
                c.active ? 'Şirket pasif edildi' : 'Şirket aktif edildi',
                '',
                c.active ? 'info' : 'success'
            )
        } catch (err: any) {
            MySwal.fire('Hata', err.message, 'error')
        }
    }

    // → 4) Detayları SweetAlert modal ile göster
    const showDetails = (c: Company) => {
        MySwal.fire({
            title: `${c.companyName} Detayları`,
            html: `
        <table class="swal2-table">
          <tr><th>Başvuran</th><td>${c.applicantFirstName} ${c.applicantLastName}</td></tr>
          <tr><th>Email</th><td>${c.companyEmail}</td></tr>
          <tr><th>Telefon</th><td>${c.companyPhoneNumber}</td></tr>
          <tr><th>Adres</th><td>${c.companyAddress}</td></tr>
          <tr><th>Başvuru Tarihi</th><td>${formatDate(c.registrationDate)}</td></tr>
          <tr><th>Plan</th><td>${c.subscriptionType}</td></tr>
          <tr><th>Başlangıç</th><td>${formatDate(c.subscriptionStart)}</td></tr>
          <tr><th>Bitiş</th><td>${formatDate(c.subscriptionEnd)}</td></tr>
          <tr><th>Aktif</th><td>${c.active ? 'Evet' : 'Hayır'}</td></tr>
        </table>
      `,
            width: 600,
            confirmButtonText: 'Kapat',
            customClass: {
                popup: 'swal2-company-details'
            }
        })
    }

    // → 5) Filtre ve Sayfalama
    const filtered = list.filter(c =>
        c.companyName.toLowerCase().includes(search.toLowerCase())
    )
    const totalPages = Math.ceil(filtered.length / pageSize)
    const paginated  = filtered.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    )

    return (
        <div className="d-flex admin-dashboard">
            <main className="flex-fill p-4 content-bg">
                <h1 className="mb-4">Companies</h1>

                {/* Arama */}
                <div className="mb-3">
                    <input
                        className="form-control"
                        placeholder="Search…"
                        value={search}
                        onChange={e => { setSearch(e.target.value); setCurrentPage(1) }}
                    />
                </div>

                {/* Tablo */}
                <div className="card shadow-sm">
                    <div className="card-body p-0">
                        <table className="table mb-0 company-table">
                            <thead className="table-light">
                            <tr>
                                <th>Company</th>
                                <th>Phone</th>
                                <th>Plan</th>
                                <th>Start</th>
                                <th>End</th>
                                <th className="text-center">Active</th>
                                <th className="text-center">Details</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginated.map(c => (
                                <tr key={c.id} className={!c.active ? 'table-secondary' : ''}>
                                    <td>{c.companyName}</td>
                                    <td>{c.companyPhoneNumber}</td>
                                    <td>{c.subscriptionType}</td>
                                    <td>{formatDate(c.subscriptionStart)}</td>
                                    <td>{formatDate(c.subscriptionEnd)}</td>
                                    <td className="text-center">
                                        <BiPowerOff
                                            size={20}
                                            color={c.active ? '#28a745' : '#6c757d'}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => toggleActive(c)}
                                        />
                                    </td>
                                    <td className="text-center">
                                        <AiOutlineEye
                                            size={20}
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => showDetails(c)}
                                        />
                                    </td>
                                </tr>
                            ))}
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center py-4 text-muted">
                                        No companies found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Sayfalama */}
                {totalPages > 1 && (
                    <nav className="mt-3">
                        <ul className="pagination justify-content-center">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                <li
                                    key={page}
                                    className={`page-item${page === currentPage ? ' active' : ''}`}
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
