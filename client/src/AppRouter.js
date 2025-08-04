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

const AppRouter=()=>{
    const {user}=useContext(AuthContext);

    return(
        <Router>
            <Routes>
                {/* Giriş yapılmamışsa Login/Register'a erişim serbest */}
                <Route path="/login" element={!user ? <Login/>:<Navigate to="/"/>}/>
               <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />

                {/* Rol bazlı yönlendirme */}
                <Route path="/patient/dashboard" element={user?.role==="patient" ? <PatientDashboard/>:<Navigate to="/login"/>}/>
                <Route path="/doctor/dashboard" element={user?.role === "doctor" ? <DoctorDashboard /> : <Navigate to="/login" />}/>
                <Route path="/admin/dashboard" element={user?.role === "admin" ? <AdminDashboard /> : <Navigate to="/login" />} />

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




