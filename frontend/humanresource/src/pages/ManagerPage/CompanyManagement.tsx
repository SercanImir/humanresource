// src/pages/CompanyPage/CompanyManagementPage.tsx

import React, { useState } from 'react';
import { CompanyInfoForm } from './CompanyInfoForm';

export const CompanyManagementPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'info' | 'branches' | 'departments' | 'titles'>('info');
    return (
        <div className="company-page-wrapper p-4">
            <h1 className="mb-4">Şirket Yönetimi</h1>
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'info' ? 'active' : ''}`} onClick={() => setActiveTab('info')}>
                        Şirket Bilgileri
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'branches' ? 'active' : ''}`} onClick={() => setActiveTab('branches')}>
                        Şubeler
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'departments' ? 'active' : ''}`} onClick={() => setActiveTab('departments')}>
                        Departmanlar
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === 'titles' ? 'active' : ''}`} onClick={() => setActiveTab('titles')}>
                        Ünvanlar
                    </button>
                </li>
            </ul>
            <div className="tab-content shadow-sm p-4 rounded bg-white">
                {activeTab === 'info' && <CompanyInfoForm />}
                {activeTab === 'branches' && <div>Şube yönetimi sekmesi</div>}
                {activeTab === 'departments' && <div>Departman yönetimi sekmesi</div>}
                {activeTab === 'titles' && <div>Ünvan yönetimi sekmesi</div>}
            </div>
        </div>
    );
};
