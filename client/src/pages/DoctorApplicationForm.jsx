import React,{useState} from "react";
import API from "../api/api"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


const DoctorApplicationForm=()=>{
            const[specialization,setSpecialization]=useState("")
            const[bio,setBio]=useState("")
            const navigate=useNavigate();


            const handleSubmit=async(e)=>{
                e.preventDefault();//sayfanın yenilenmesini engeller
                try {
                    const res=await API.post('/doctor-application/apply',{specialization,bio})
                    toast.success("Başvuru işlemi başarılı")
                    navigate('/doctor/dashboard')                    
                } catch (error) {
                    toast.error(error.res?.data?.message || "Başvuru başarısız")
                }
            }

              return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded mt-10">
      <h1 className="text-xl font-bold mb-4">Doktor Başvuru Formu</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Uzmanlık Alanı</label>
          <input
            type="text"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Biyografi</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          Başvuruyu Gönder
        </button>
      </form>
    </div>
  );
}
export default DoctorApplicationForm;

//doctor application sayfası tamam isapproved true olanlar başvuramasın kısmını yap orada kaldık 