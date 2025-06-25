import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import AuthForm from './pages/AuthForm/AuthForm';
import {AdminPage} from "./pages/AdminPage/AdminPage.tsx";
import {CompanyListPage} from "./pages/AdminPage/CompanyListPage.tsx";
import {PendingCompaniesPage} from "./pages/AdminPage/PendingCompaniesPage.tsx";
import {ManagerPage} from "./pages/ManagerPage/ManagerPage.tsx";

import {CompanyInfoForm} from "./pages/ManagerPage/CompanyInfoForm.tsx";

const RoutingPage = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register-login" element={<AuthForm />} />
            <Route path="/admin/dashboard"    element={<AdminPage/>}/>
            <Route path="/admin/companylist"    element={<CompanyListPage/>}/>
            <Route path="/admin-pendingcompanies"    element={<PendingCompaniesPage/>}/>
            <Route path="/deneme"    element={<CompanyInfoForm/>}/>
            <Route path="/manager/dashboard"    element={<ManagerPage/>}/>




        </Routes>
    </BrowserRouter>
);

export default RoutingPage;
