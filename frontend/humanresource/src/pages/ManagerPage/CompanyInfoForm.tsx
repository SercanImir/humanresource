// src/pages/CompanyPage/CompanyInfoForm.tsx

import React, { useEffect, useState } from 'react';

interface CompanyDto {
    id: number;
    name: string;
    address: string;
    city: string;
    phone: string;
    email: string;
    taxNo: string;
    foundationDate: string;
    subscriptionType: string;
    subscriptionStart: string;
    subscriptionEnd: string;
}

export const CompanyInfoForm: React.FC = () => {
    const [company, setCompany] = useState<CompanyDto | null>(null);
    const [editMode, setEditMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        setLoading(true);
        fetch('/api/manager/company/me', {
            headers: { 'Authorization': 'Bearer ' + token }
        })
            .then(res => res.json())
            .then(result => {
                console.log("API DÖNÜŞÜ:", result);  // <-- Bunu ekle ve bak
                setCompany(result.data);
            })
            .catch(() => setError('Şirket bilgisi yüklenemedi.'))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!company) return;
        setCompany({ ...company, [e.target.name]: e.target.value });
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        try {
            const resp = await fetch(`/api/manager/company/${company?.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                },
                body: JSON.stringify(company)
            });
            if (resp.ok) {
                setSuccess('Şirket bilgileri güncellendi.');
                setEditMode(false);
            } else {
                setError('Güncelleme başarısız.');
            }
        } catch {
            setError('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Yükleniyor...</div>;
    if (!company) return <div>Şirket bilgisi bulunamadı.</div>;

    return (
        <div className="card shadow-sm" style={{ maxWidth: 650, margin: 'auto' }}>
            <div className="card-body">
                <h4 className="mb-4">Şirket Bilgileri</h4>
                <form onSubmit={handleSave}>
                    {/* Form alanlarını yazdığın gibi bırakabilirsin */}
                    {/* ... (aynı şekilde form alanları burada) ... */}
                    {/* Kısa tutuyorum, yukarıdaki formu kullanabilirsin */}
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Şirket Adı *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="name"
                                value={company.name}
                                onChange={handleChange}
                                disabled={!editMode}
                                required
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Şehir *</label>
                            <input
                                type="text"
                                className="form-control"
                                name="city"
                                value={company.city}
                                onChange={handleChange}
                                disabled={!editMode}
                                required
                            />
                        </div>
                    </div>
                    {/* ... diğer alanlar aynı ... */}
                    {error && <div className="alert alert-danger mt-3">{error}</div>}
                    {success && <div className="alert alert-success mt-3">{success}</div>}

                    <div className="d-flex justify-content-end mt-4">
                        {!editMode ? (
                            <button type="button" className="btn btn-warning" onClick={() => setEditMode(true)}>
                                Düzenle
                            </button>
                        ) : (
                            <>
                                <button type="submit" className="btn btn-success me-2">Kaydet</button>
                                <button type="button" className="btn btn-secondary" onClick={() => setEditMode(false)}>Vazgeç</button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};
