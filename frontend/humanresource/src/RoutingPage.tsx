import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage/HomePage';
import AuthForm from './pages/AuthForm/AuthForm';

const RoutingPage = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register-login" element={<AuthForm />} />
        </Routes>
    </BrowserRouter>
);

export default RoutingPage;
