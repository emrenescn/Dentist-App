import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const Login=()=>{
    const {login}=useContext(AuthContext);// login fonksiyonunu aldık
    const navigate=useNavigate();//yönlendirme için

    const [email,setEmail]=useState("");//inputlar için state
    const [password,setPassword]=useState("");
    const [error,setError]=useState(null); //hata mesajı 

    //form gönderildiğinde çalışır
    const handleSubmit=async(e)=>{
            e.preventDefault(); //sayfanın yenilenmesini engelle

            try{
                const response=await API.post("/auth/login",{email,password})
                const token=response.data.token;
                login(token); //contexte login fonksiyonundaki parametreye burada elde edilen token verildi kullanıcı bilgileri buna göre ayarlansın
                const user=JSON.parse(atob(token.split(".")[1]));//user içinden role al
                if(user.role==="admin"){
                    navigate("/admin/dashboard")
                }
                else if(user.role==="doctor"){
                    navigate("/doctor/dashboard")
                }
                else{
                    navigate("/patient/dashboard")
                }
            }
            catch(err){
                setError("Email ve Parola Hatalı")
            }
    }
        return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h2>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2 font-medium">Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label className="block mb-2 font-medium">Şifre</label>
        <input
          type="password"
          className="w-full border px-3 py-2 rounded mb-6"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
export default Login;




