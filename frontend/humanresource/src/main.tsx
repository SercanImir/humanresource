import { createRoot } from 'react-dom/client';
import "./pages/HomePage/variables.css";
import RoutingPage from "./RoutingPage";
import "bootstrap/dist/css/bootstrap.min.css";

createRoot(document.getElementById('root')!).render(
    <RoutingPage />
);
