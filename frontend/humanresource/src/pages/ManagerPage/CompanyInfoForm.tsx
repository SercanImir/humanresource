import React, { useEffect, useState } from "react";
import { FiEdit2, FiMapPin, FiPhone, FiMail, FiCalendar, FiHome, FiShield } from "react-icons/fi";
import "bootstrap/dist/css/bootstrap.min.css";

interface CompanyDto {
    id: number;
    companyName: string;
    companyAddress: string;
    city: string;
    companyPhoneNumber: string;
    companyEmail: string;
    taxNo: string;
    foundationDate: string; // "2020-04-01"
    subscriptionType: string;
    subscriptionStart: string;
    subscriptionEnd: string;
}

export const CompanyInfoForm: React.FC = () => {
    const [company, setCompany] = useState<CompanyDto | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:9090/api/manager/company/me", {
            headers: { Authorization: "Bearer " + token }
        })
            .then((res) => res.json())
            .then((result) => setCompany(result.data))
            .catch(() => setError("Şirket bilgisi yüklenemedi."))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!company) return;
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");
        try {
            const resp = await fetch(`http://localhost:9090/api/manager/company/me`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
                body: JSON.stringify(company),
            });
            if (resp.ok) {
                setSuccess("Şirket bilgileri güncellendi.");
                setEditMode(false);
            } else {
                setError("Güncelleme başarısız.");
            }
        } catch {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (!company) return <div>Şirket bilgisi bulunamadı.</div>;

    // Modern bilgi satırı
    const InfoRow = ({
                         icon,
                         label,
                         value,
                         name,
                         required = false,
                         type = "text",
                         disabled = false,
                     }: {
        icon: React.ReactNode;
        label: string;
        value: any;
        name: string;
        required?: boolean;
        type?: string;
        disabled?: boolean;
    }) => (
        <div className="d-flex align-items-center mb-3">
            <span style={{ minWidth: 30, color: "#2266aa" }}>{icon}</span>
            <label className="me-3 mb-0" style={{ minWidth: 130 }}>{label}</label>
            {editMode && !disabled ? (
                <input
                    type={type}
                    className="form-control"
                    style={{ maxWidth: 280 }}
                    name={name}
                    value={value || ""}
                    onChange={handleChange}
                    required={required}
                    disabled={disabled}
                    max={name === "foundationDate" ? new Date().toISOString().slice(0, 10) : undefined}
                />
            ) : (
                <div style={{
                    flex: 1, background: "#f8f9fa", borderRadius: 8, padding: "6px 12px"
                }}>
                    {type === "date" && value ? value.slice(0, 10) : value || <span style={{ color: "#bbb" }}>-</span>}
                </div>
            )}
        </div>
    );

    return (
        <div className="card shadow-sm" style={{ maxWidth: 650, margin: "auto" }}>
            <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h4 className="mb-0">Şirket Bilgileri</h4>
                    <button
                        type="button"
                        className={`btn ${editMode ? "btn-secondary" : "btn-warning"} btn-sm`}
                        onClick={() => setEditMode((val) => !val)}
                    >
                        <FiEdit2 /> {editMode ? "Vazgeç" : "Düzenle"}
                    </button>
                </div>
                <form onSubmit={handleSave}>
                    <InfoRow icon={<FiHome />} label="Şirket Adı" name="companyName" value={company.companyName} required />
                    <InfoRow icon={<FiMapPin />} label="Adres" name="companyAddress" value={company.companyAddress} required />
                    <InfoRow icon={<FiMapPin />} label="Şehir" name="city" value={company.city} required />
                    <InfoRow icon={<FiPhone />} label="Telefon" name="companyPhoneNumber" value={company.companyPhoneNumber} />
                    <InfoRow icon={<FiMail />} label="E-posta" name="companyEmail" value={company.companyEmail} type="email" disabled />
                    <InfoRow icon={<FiShield />} label="Vergi No" name="taxNo" value={company.taxNo ||""} type="text"  />
                    <InfoRow
                        icon={<FiCalendar />}
                        label="Kuruluş Tarihi"
                        name="foundationDate"
                        value={company.foundationDate ? company.foundationDate.slice(0, 10) : ""}
                        type="date"
                        required
                    />
                    <InfoRow icon={<FiShield />} label="Üyelik Tipi" name="subscriptionType" value={company.subscriptionType} disabled />
                    <InfoRow icon={<FiCalendar />} label="Başlangıç" name="subscriptionStart" value={company.subscriptionStart?.slice(0, 10)} disabled />
                    <InfoRow icon={<FiCalendar />} label="Bitiş" name="subscriptionEnd" value={company.subscriptionEnd?.slice(0, 10)} disabled />

                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}

                    {editMode && (
                        <div className="d-flex justify-content-end mt-4">
                            <button type="submit" className="btn btn-success">
                                Kaydet
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};
