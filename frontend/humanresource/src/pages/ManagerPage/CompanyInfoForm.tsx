import React, { useEffect, useState } from "react";
import { FiEdit2, FiMapPin, FiPhone, FiMail, FiCalendar, FiHome, FiShield } from "react-icons/fi";


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
    const [initialCompany, setInitialCompany] = useState<CompanyDto | null>(null);

    const token = localStorage.getItem("token");

    useEffect(() => {
        setLoading(true);
        fetch("http://localhost:9090/api/manager/company/me", {
            headers: { Authorization: "Bearer " + token }
        })
            .then((res) => res.json())
            .then((result) => {
                setCompany(result.data);
                setInitialCompany(result.data);
            })
            .catch(() => setError("Şirket bilgisi yüklenemedi."))
            .finally(() => setLoading(false));
    }, []);

    // --- Sadece değişen alanı güncelle, eski state'i koru! ---
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!company) return;
        const { name, value } = e.target;
        setCompany(prev => prev ? { ...prev, [name]: value } : prev);
    };

    // Kaydet
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
                setInitialCompany(company); // yeni halini de yedekle
            } else {
                setError("Güncelleme başarısız.");
            }
        } catch {
            setError("Bir hata oluştu.");
        } finally {
            setLoading(false);
        }
    };

    // Vazgeç
    const handleCancel = () => {
        setCompany(initialCompany);
        setEditMode(false);
        setError("");
        setSuccess("");
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (!company) return <div>Şirket bilgisi bulunamadı.</div>;

    return (
        <div
            className="card shadow"
            style={{
                maxWidth: 560,
                margin: "auto",
                borderRadius: 24,
                background: "#f9fafb",
                boxShadow: "0 4px 16px rgba(100,100,120,0.07)"
            }}
        >
            <div className="card-body p-5">
                <div className="d-flex align-items-center justify-content-between mb-4">
                    <h3 className="fw-bold mb-0" style={{ letterSpacing: 1 }}>Şirket Bilgileri</h3>
                    <div>
                        {!editMode ? (
                            <button className="btn btn-warning px-3" onClick={() => setEditMode(true)}>
                                <FiEdit2 size={18} /> Düzenle
                            </button>
                        ) : (
                            <>
                                <button type="button" className="btn btn-secondary px-3 me-2" onClick={handleCancel}>
                                    Vazgeç
                                </button>
                                <button type="submit" className="btn btn-success px-3" form="company-info-form">
                                    Kaydet
                                </button>
                            </>
                        )}
                    </div>
                </div>

                <form id="company-info-form" onSubmit={handleSave} autoComplete="off">
                    {/* Bilgi Alanları */}
                    <Field icon={<FiHome />} label="Şirket Adı" name="companyName"
                           value={company.companyName} onChange={handleChange}
                           required readOnly={!editMode} />

                    <Field icon={<FiMapPin />} label="Adres" name="companyAddress"
                           value={company.companyAddress} onChange={handleChange}
                           required readOnly={!editMode} />

                    <Field icon={<FiMapPin />} label="Şehir" name="city"
                           value={company.city} onChange={handleChange}
                           required readOnly={!editMode} />

                    <Field icon={<FiPhone />} label="Telefon" name="companyPhoneNumber"
                           value={company.companyPhoneNumber} onChange={handleChange}
                           readOnly={!editMode} />

                    <Field icon={<FiMail />} label="E-posta" name="companyEmail"
                           value={company.companyEmail} type="email"
                           onChange={handleChange} readOnly />

                    <Field icon={<FiShield />} label="Vergi No" name="taxNo"
                           value={company.taxNo} onChange={handleChange}
                           readOnly={!editMode} />

                    <Field icon={<FiCalendar />} label="Kuruluş Tarihi" name="foundationDate"
                           value={company.foundationDate ? company.foundationDate.slice(0, 10) : ""}
                           type="date"
                           onChange={handleChange}
                           required readOnly={!editMode}
                           max={new Date().toISOString().slice(0, 10)}
                    />

                    <Field icon={<FiShield />} label="Üyelik Tipi" name="subscriptionType"
                           value={company.subscriptionType} readOnly />

                    <Field icon={<FiCalendar />} label="Başlangıç" name="subscriptionStart"
                           value={company.subscriptionStart ? company.subscriptionStart.slice(0, 10) : ""}
                           readOnly />

                    <Field icon={<FiCalendar />} label="Bitiş" name="subscriptionEnd"
                           value={company.subscriptionEnd ? company.subscriptionEnd.slice(0, 10) : ""}
                           readOnly />
                </form>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
                {success && <div className="alert alert-success mt-3">{success}</div>}
            </div>
        </div>
    );
};

// Gelişmiş Field Componenti
function Field({
                   icon,
                   label,
                   value,
                   name,
                   onChange,
                   type = "text",
                   required = false,
                   readOnly = false,
                   max,
               }: {
    icon: React.ReactNode;
    label: string;
    value: string | undefined;
    name: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    type?: string;
    required?: boolean;
    readOnly?: boolean;
    max?: string;
}) {
    return (
        <div className="d-flex align-items-center mb-3">
            <span style={{ minWidth: 30, color: "#2266aa" }}>{icon}</span>
            <label htmlFor={name} className="me-3 mb-0" style={{ minWidth: 130, fontWeight: 500 }}>
                {label}
            </label>
            <input
                type={type}
                id={name}
                className="form-control"
                style={{
                    maxWidth: 280,
                    background: readOnly ? "#f4f4f7" : "#fff",
                    border: readOnly ? "1px solid #e2e4e6" : "1px solid #d0d2d6",
                    color: "#222",
                    fontWeight: 500
                }}
                name={name}
                value={value || ""}
                onChange={onChange}
                required={required}
                readOnly={readOnly}
                max={max}
                autoComplete="off"
            />
        </div>
    );
}
