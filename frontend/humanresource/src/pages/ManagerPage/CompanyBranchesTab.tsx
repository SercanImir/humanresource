import React, { useEffect, useState } from "react";
import {
    FiPlus, FiHome, FiMapPin, FiPhone, FiMail,
    FiEdit2, FiX, FiCheck, FiPower
} from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";

interface BranchDto {
    id: number;
    branchName: string;
    companyBranchAddress: string;
    city: string;
    companyBranchPhoneNumber: string;
    companyBranchEmail: string;
    active: boolean;
}

const emptyForm = {
    branchName: "",
    companyBranchAddress: "",
    city: "",
    companyBranchPhoneNumber: "",
    companyBranchEmail: "",
};

export const CompanyBranchesTab: React.FC = () => {
    const [branches, setBranches] = useState<BranchDto[]>([]);
    const [form, setForm] = useState<Omit<BranchDto, "id" | "active">>(emptyForm);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");

    // Şubeleri getir
    const fetchBranches = async () => {
        setLoading(true);
        setError("");
        try {
            const resp = await fetch("http://localhost:9090/api/manager/get-all-branches", {
                headers: { Authorization: "Bearer " + token }
            });
            const body = await resp.json();
            setBranches(Array.isArray(body.data) ? body.data : []);
        } catch {
            setError("Şubeler yüklenemedi.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBranches();
    }, []);

    // Form input değişikliği
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Şube ekle veya güncelle
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        const isEditing = editingId !== null;
        const url = isEditing
            ? `http://localhost:9090/api/manager/branches/${editingId}`
            : "http://localhost:9090/api/manager/add-branch/";
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
            setSuccess(isEditing ? "Şube güncellendi." : "Şube başarıyla eklendi.");
            fetchBranches();
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
        setSuccess("");
        setError("");
    };

    // Düzenleme modundan çık
    const handleCancel = () => {
        setForm(emptyForm);
        setEditingId(null);
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
            fetchBranches();
        } catch {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="card shadow-sm mb-4" style={{ maxWidth: 900, margin: "auto" }}>
                <div className="card-body">
                    <h5 className="mb-3">
                        <FiPlus /> {editingId ? "Şubeyi Düzenle" : "Şube Ekle"}
                    </h5>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-2">
                            <div className="col-md-6 col-lg-4">
                                <div className="input-group">
                                    <span className="input-group-text"><FiHome /></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Şube Adı"
                                        name="branchName"
                                        value={form.branchName}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <div className="input-group">
                                    <span className="input-group-text"><FiMapPin /></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Adres"
                                        name="companyBranchAddress"
                                        value={form.companyBranchAddress}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4">
                                <div className="input-group">
                                    <span className="input-group-text"><FiMapPin /></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Şehir"
                                        name="city"
                                        value={form.city}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 mt-2 mt-lg-0">
                                <div className="input-group">
                                    <span className="input-group-text"><FiPhone /></span>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Telefon (11 hane)"
                                        name="companyBranchPhoneNumber"
                                        value={form.companyBranchPhoneNumber}
                                        maxLength={11}
                                        pattern="\d{11}"
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6 col-lg-4 mt-2 mt-lg-0">
                                <div className="input-group">
                                    <span className="input-group-text"><FiMail /></span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        placeholder="E-posta"
                                        name="companyBranchEmail"
                                        value={form.companyBranchEmail}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            {editingId ? (
                                <>
                                    <button type="submit" className="btn btn-primary me-2" disabled={loading}>
                                        <FiCheck /> Kaydet
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                                        <FiX /> Vazgeç
                                    </button>
                                </>
                            ) : (
                                <button type="submit" className="btn btn-success" disabled={loading}>
                                    <FiPlus /> Ekle
                                </button>
                            )}
                        </div>
                        {error && <div className="alert alert-danger mt-2">{error}</div>}
                        {success && <div className="alert alert-success mt-2">{success}</div>}
                    </form>
                </div>
            </div>
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
                            {branches.length === 0 && (
                                <tr>
                                    <td colSpan={7} className="text-center text-muted py-3">Henüz şube yok.</td>
                                </tr>
                            )}
                            {branches.map((b) => (
                                <tr key={b.id}>
                                    <td>{b.branchName}</td>
                                    <td>{b.companyBranchAddress}</td>
                                    <td>{b.city}</td>
                                    <td>{b.companyBranchPhoneNumber}</td>
                                    <td>{b.companyBranchEmail}</td>
                                    <td>
                                        <button
                                            className={`btn btn-sm ${b.active ? "btn-success" : "btn-secondary"}`}
                                            title={b.active ? "Pasifleştir" : "Aktifleştir"}
                                            onClick={() => handleToggleActive(b)}
                                        >
                                            <FiPower />
                                        </button>
                                    </td>
                                    <td>
                                        <button
                                            className="btn btn-sm btn-warning me-2"
                                            title="Düzenle"
                                            onClick={() => handleEdit(b)}
                                        >
                                            <FiEdit2 />
                                        </button>
                                        {/* Buraya sil butonu istersen ekleyebilirsin */}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};
