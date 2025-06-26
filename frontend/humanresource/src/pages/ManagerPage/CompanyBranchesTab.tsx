import React, { useEffect, useState } from "react";
import {
    FiPlus, FiHome, FiMapPin, FiPhone, FiMail,
    FiEdit2, FiX, FiCheck, FiPower, FiTrash2
} from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from "sweetalert2"

interface BranchDto {
    id: number;
    branchName: string;
    companyBranchAddress: string;
    city: string;
    companyBranchPhoneNumber: string;
    companyBranchEmail: string;
    isActive: boolean;
}

const emptyForm = {
    branchName: "",
    companyBranchAddress: "",
    city: "",
    companyBranchPhoneNumber: "",
    companyBranchEmail: "",
};

const PAGE_SIZE = 10;

export const CompanyBranchesTab: React.FC = () => {
    const [branches, setBranches] = useState<BranchDto[]>([]);
    const [form, setForm] = useState<Omit<BranchDto, "id" | "isActive">>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [page, setPage] = useState(1);

    const token = localStorage.getItem("token");

    // Get and sort branches
    const fetchBranches = async () => {
        setLoading(true);
        setError("");
        try {
            const resp = await fetch("http://localhost:9090/api/manager/get-all-branches", {
                headers: { Authorization: "Bearer " + token }
            });
            const body = await resp.json();
            // Sıralama: önce aktif, sonra alfabetik
            let sorted: BranchDto[] = Array.isArray(body.data) ? [...body.data] : [];
            sorted.sort((a, b) => {
                if (a.isActive !== b.isActive) return a.isActive ? -1 : 1;
                return a.branchName.localeCompare(b.branchName, "tr");
            });
            setBranches(sorted);
        } catch {
            setError("Şubeler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBranches(); }, []);

    // Form input değişikliği
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
    };

    // Aynı isimli şube var mı (düzenleme hariç)
    const isDuplicate = () => {
        return branches.some(
            (b) =>
                b.branchName.trim().toLowerCase() === form.branchName.trim().toLowerCase() &&
                (editingId === null || b.id !== editingId)
        );
    };

    // Şube ekle/güncelle
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!form.branchName.trim()) {
            setError("Şube adı zorunludur!");
            return;
        }
        if (isDuplicate()) {
            setError("Aynı isimde bir şube zaten mevcut!");
            return;
        }
        setLoading(true);
        const isEditing = editingId !== null;
        const url = isEditing
            ? `http://localhost:9090/api/manager/branches/${editingId}`
            : "http://localhost:9090/api/manager/add-branch";
        const method = isEditing ? "PUT" : "POST";
        try {
            const resp = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(form),
            });
            if (!resp.ok) {
                setError(isEditing ? "Şube güncellenemedi." : "Şube eklenemedi.");
                return;
            }
            setForm(emptyForm);
            setEditingId(null);
            setShowForm(false);
            setSuccess(isEditing ? "Şube güncellendi." : "Şube başarıyla eklendi.");
            await fetchBranches();
            setPage(1); // Ekleme sonrası ilk sayfaya dön
        } catch {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Şube düzenleme modunu başlat
    const handleEdit = (branch: BranchDto) => {
        setForm({
            branchName: branch.branchName,
            companyBranchAddress: branch.companyBranchAddress,
            city: branch.city,
            companyBranchPhoneNumber: branch.companyBranchPhoneNumber,
            companyBranchEmail: branch.companyBranchEmail,
        });
        setEditingId(branch.id);
        setShowForm(true);
        setSuccess("");
        setError("");
    };

    // Formu kapat
    const handleCancel = () => {
        setForm(emptyForm);
        setEditingId(null);
        setShowForm(false);
        setError("");
        setSuccess("");
    };

    // Aktif/Pasif toggle
    const handleToggleActive = async (branch: BranchDto) => {
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const resp = await fetch(
                `http://localhost:9090/api/manager/branches/${branch.id}/toggle`,
                {
                    method: "POST",
                    headers: { Authorization: "Bearer " + token }
                }
            );
            if (!resp.ok) {
                setError("Durum değiştirilemedi.");
                return;
            }
            await fetchBranches();
        } catch {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Şube silme
    const handleDelete = async (branchId: number) => {
        const result = await Swal.fire({
            title: "Emin misiniz?",
            text: "Bu şube kalıcı olarak silinecek!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#aaa",
            confirmButtonText: "Evet, sil!",
            cancelButtonText: "Vazgeç"
        });
        if (!result.isConfirmed) return;

        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const resp = await fetch(
                `http://localhost:9090/api/manager/branches/${branchId}`,
                {
                    method: "DELETE",
                    headers: { Authorization: "Bearer " + token }
                }
            );
            if (!resp.ok) {
                setError("Şube silinemedi.");
                Swal.fire("Hata", "Şube silinemedi!", "error");
                return;
            }
            await fetchBranches();
            setSuccess("Şube silindi.");
            setPage(1);
            Swal.fire("Başarılı", "Şube silindi.", "success");
        } catch {
            setError("Bir hata oluştu.");
            Swal.fire("Hata", "Bir hata oluştu!", "error");
        } finally {
            setLoading(false);
        }
    };

    // Sayfalama: sadece mevcut sayfadaki 10'lu renderlansın
    const totalPages = Math.ceil(branches.length / PAGE_SIZE);
    const paginatedBranches = branches.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    const handlePageChange = (p: number) => setPage(p);

    return (
        <div>
            {/* Sağ üstte şube ekle butonu */}
            <div className="d-flex justify-content-end mb-3">
                <button
                    className="btn btn-warning"
                    style={{
                        backgroundColor: "#FFC107",
                        color: "#222",
                        border: "none",
                        fontWeight: 500,
                        fontSize: "1.2rem",
                        padding: "12px 30px",
                        borderRadius: "12px",
                        boxShadow: "0 2px 10px rgba(255, 193, 7, 0.08)"
                    }}
                    onClick={() => {
                        setShowForm(true);
                        setEditingId(null);
                        setForm(emptyForm);
                        setError("");
                        setSuccess("");
                    }}
                >
                    <FiPlus style={{ marginRight: 8, fontSize: "1.2rem", verticalAlign: -2 }} />
                    Şube Ekle
                </button>
            </div>

            {/* Ekle/Güncelle Formu */}
            {showForm && (
                <div className="card shadow-sm mb-4" style={{ maxWidth: 900, margin: "auto" }}>
                    <div className="card-body">
                        <h5 className="mb-3">
                            {editingId ? <><FiEdit2 /> Şubeyi Düzenle</> : <><FiPlus /> Şube Ekle</>}
                        </h5>
                        <form onSubmit={handleSubmit}>
                            <div className="row g-2">
                                {/* ...inputlar aynı şekilde... */}
                                {/* Kısa olması için tekrar yazmadım, yukarıdaki kodla aynı */}
                                {/* (branchName, address, city, phone, email) */}
                                <div className="col-md-6 col-lg-4">
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ background: "#eef2fb" }}>
                                            <FiHome color="#2266aa" />
                                        </span>
                                        <input type="text" className="form-control" placeholder="Şube Adı"
                                               name="branchName" value={form.branchName} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ background: "#eef2fb" }}>
                                            <FiMapPin color="#2266aa" />
                                        </span>
                                        <input type="text" className="form-control" placeholder="Adres"
                                               name="companyBranchAddress" value={form.companyBranchAddress} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4">
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ background: "#eef2fb" }}>
                                            <FiMapPin color="#2266aa" />
                                        </span>
                                        <input type="text" className="form-control" placeholder="Şehir"
                                               name="city" value={form.city} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 mt-2 mt-lg-0">
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ background: "#eef2fb" }}>
                                            <FiPhone color="#2266aa" />
                                        </span>
                                        <input type="text" className="form-control" placeholder="Telefon (11 hane)"
                                               name="companyBranchPhoneNumber" value={form.companyBranchPhoneNumber}
                                               maxLength={11} pattern="\d{11}" onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="col-md-6 col-lg-4 mt-2 mt-lg-0">
                                    <div className="input-group">
                                        <span className="input-group-text" style={{ background: "#eef2fb" }}>
                                            <FiMail color="#2266aa" />
                                        </span>
                                        <input type="email" className="form-control" placeholder="E-posta"
                                               name="companyBranchEmail" value={form.companyBranchEmail} onChange={handleChange} />
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end mt-3">
                                <button type="submit" className="btn btn-success me-2" disabled={loading}>
                                    {editingId ? <><FiCheck /> Kaydet</> : <><FiPlus /> Ekle</>}
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                    <FiX /> Vazgeç
                                </button>
                            </div>
                            {error && <div className="alert alert-danger mt-2">{error}</div>}
                            {success && <div className="alert alert-success mt-2">{success}</div>}
                        </form>
                    </div>
                </div>
            )}

            {/* Şubeler Tablosu */}
            <div className="card shadow-sm" style={{ maxWidth: 1100, margin: "30px auto" }}>
                <div className="card-body">
                    <h5 className="mb-3">Mevcut Şubeler</h5>
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                            <tr>
                                <th>Ad</th>
                                <th>Adres</th>
                                <th>Şehir</th>
                                <th>Telefon</th>
                                <th>E-posta</th>
                                <th>Durum</th>
                                <th>İşlemler</th>
                            </tr>
                            </thead>
                            <tbody>
                            {paginatedBranches.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted py-3">Henüz şube yok.</td>
                                </tr>
                            )}
                            {paginatedBranches.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.branchName}</td>
                                    <td>{b.companyBranchAddress}</td>
                                    <td>{b.city}</td>
                                    <td>{b.companyBranchPhoneNumber}</td>
                                    <td>{b.companyBranchEmail}</td>
                                    <td>
                                        <button
                                            className={`btn btn-sm ${b.isActive ? "btn-success" : "btn-secondary"}`}
                                            title={b.isActive ? "Pasifleştir" : "Aktifleştir"}
                                            onClick={() => handleToggleActive(b)}
                                        >
                                            <FiPower />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm"
                                            style={{
                                                backgroundColor: "#FFC107",
                                                color: "#222",
                                                border: "none",
                                                fontWeight: 500,
                                                marginRight: 4
                                            }}
                                            title="Düzenle"
                                            onClick={() => handleEdit(b)}
                                        >
                                            <FiEdit2 style={{ verticalAlign: -2 }} /> Düzenle
                                        </button>
                                        <button
                                            className="btn btn-sm btn-outline-danger"
                                            title="Sil"
                                            onClick={() => handleDelete(b.id)}
                                        >
                                            <FiTrash2 style={{ verticalAlign: -2 }} /> Sil
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <nav className="mt-4">
                            <ul className="pagination justify-content-center">
                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNo => (
                                    <li key={pageNo} className={`page-item${pageNo === page ? ' active' : ''}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(pageNo)}
                                        >
                                            {pageNo}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    )}
                </div>
            </div>
        </div>
    );
};
