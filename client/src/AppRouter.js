import React from "react";
import {BrowserRouter as Router,Routes,Route,Navigate} from "react-router-dom"
//sayfa bileşenlerini buradan import edeceğiz
import Login from "./pages/Login";
import Register from "./pages/Register";
import PatientDashboard from "./pages/PatientDashboard";
import DoctorDashboard  from "./pages/DoctorDashboard";
import AdminDashboard  from "./pages/AdminDashboard";
import NotFound  from "./pages/NotFound";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import DoctorProfile from "./pages/DoctorProfile";
import DoctorApplicationForm from "./pages/DoctorApplicationForm";


const AppRouter=()=>{
    const {user}=useContext(AuthContext);

    return(
        <Router>
            <Routes>
                {/* Giriş yapılmamışsa Login/Register'a erişim serbest */}
                <Route path="/login" element={!user ? <Login/>:<Navigate to="/"/>}/>
               <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

                {/* Rol bazlı yönlendirme */}
                <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={["patient"]}><PatientDashboard/></ProtectedRoute>}/>
                <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorDashboard/></ProtectedRoute>}/>
                <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={["admin"]}><AdminDashboard/></ProtectedRoute>} />
                <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={["doctor"]}><DoctorProfile/></ProtectedRoute>} />
                <Route path="/doctor-application/apply" element={<ProtectedRoute allowedRoles={["patient"]}><DoctorApplicationForm/></ProtectedRoute>}/>

                {/* Anasayfa yönlendirme */}
                <Route path="/" element={
                    user ? (
                    user.role === "patient" ? <Navigate to="/patient/dashboard" /> :
                    user.role === "doctor" ? <Navigate to="/doctor/dashboard" /> :
                   <Navigate to="/admin/dashboard" />
                    ) : (
                   <Navigate to="/login" />
                    )} />

                {/* 404 Sayfası */}
                    <Route path="*" element={<NotFound />} /> 
            </Routes>
        </Router>
    )
}
export default AppRouter;




