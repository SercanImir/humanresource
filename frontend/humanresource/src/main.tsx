
import { createRoot } from 'react-dom/client'
import "../src/pages/HomePage/variables.css"
import RoutingPage from "./RoutingPage.tsx";
import "bootstrap/dist/css/bootstrap.min.css"


createRoot(document.getElementById('root')!).render(
    <RoutingPage/>

)
