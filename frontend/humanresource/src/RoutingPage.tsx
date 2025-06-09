
import { BrowserRouter, Route,Routes } from 'react-router'
import {HomePage} from "./pages/HomePage/HomePage.tsx";
import AuthForm from "./pages/AuthForm/AuthForm.tsx";


function RouterPage() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<HomePage />} />
                <Route path='/register-login' element={<AuthForm />} />



            </Routes>
        </BrowserRouter>
    )
}

export default RouterPage