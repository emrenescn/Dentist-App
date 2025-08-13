import React,{useContext,useState,useEffect} from "react";
import {useForm} from "react-hook-form";
import{AuthContext} from "../context/AuthContext"
import { toast } from "react-toastify";
import API from "../api/api"
const DoctorProfile=()=>{

     const {user}=useContext(AuthContext);
        const [loading,setLoading]=useState(true);
        const {register,handleSubmit,reset}=useForm();
    
        useEffect(()=>{
          //profili backendden çek ve formu doldur
          const fetchProfile=async()=>{
              try{
                  const res=await API.get('/doctor/profile');
                  reset(res.data.doctor);//form alanını doldur.
              }
              catch(error){
                alert("Profil yüklenirken bir hata oluştu");
              }
              finally{
                setLoading(false);
              }
          }
          fetchProfile();
        },[reset])

        const onSubmit=async(data)=>{
            try {
              // Virgüllerden dizi oluştur available times dizi şeklinde olduğundan
               if (data.availableTimes && typeof data.availableTimes === "string") {
                   data.availableTimes = data.availableTimes.split(",").map(t => t.trim());
                    }
              await API.put('/doctor/profile',data)
              console.log(data)
              toast.success("Profil başarıyla güncellendi")
            } catch (error) {
              toast.error("Profil güncellenirken hata oldu")
            }
        }
          if (loading) return <p>Yükleniyor...</p>; //yüklenme süresi 


            return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Doktor Profili</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Specialization */}
        <div>
          <label className="block mb-1 font-semibold">Uzmanlık Alanı</label>
          <input
            type="text"
            {...register("specialization")}
            className="w-full border p-2 rounded"
            placeholder="Uzmanlık Alanı"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 font-semibold">Telefon</label>
          <input
            type="text"
            {...register("phone")}
            className="w-full border p-2 rounded"
            placeholder="Telefon Numarası"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block mb-1 font-semibold">Hakkımda</label>
          <textarea
            {...register("bio")}
            className="w-full border p-2 rounded"
            placeholder="Kendiniz hakkında kısa bilgi"
            rows={4}
          />
        </div>

        {/* Available Times */}
        <div>
          <label className="block mb-1 font-semibold">Uygun Saatler (virgülle ayırınız)</label>
          <input
            type="text"
            {...register("availableTimes")}
            className="w-full border p-2 rounded"
            placeholder="Örnek: 09:00, 10:00, 11:00"
            // Backend dizi beklediği için stringden diziye dönüşümü yapmamız gerekebilir
          />
          <small className="text-gray-600 text-sm">Saatleri virgül ile ayırın.</small>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Güncelle
        </button>
      </form>
    </div>
  );
}
export default DoctorProfile;

