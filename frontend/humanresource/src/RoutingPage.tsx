import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import AuthForm from './pages/AuthForm/AuthForm';
import {AdminPage} from "./pages/AdminPage/AdminPage.tsx";
import {CompanyListPage} from "./pages/AdminPage/CompanyListPage.tsx";
import {PendingCompaniesPage} from "./pages/AdminPage/PendingCompaniesPage.tsx";

const RoutingPage = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register-login" element={<AuthForm />} />
            <Route path="/admin"    element={<AdminPage/>}/>
            <Route path="/admin-companylist"    element={<CompanyListPage/>}/>
            <Route path="/admin-pendingcompanies"    element={<PendingCompaniesPage/>}/>


        </Routes>
    </BrowserRouter>
);

export default RoutingPage;
