import React,{useEffect,useState} from "react";
import API from "../api/api";
import { useForm } from "react-hook-form";


const PatientDashboard = () => {
      //Doktorları saklayacağımız state 
      const [doctors,setDoctors]=useState([]);

      //react-hook-form tanımı
      const {register,handleSubmit,reset}=useForm();

      //sayfa yüklendiğinde doktorları çek
      useEffect(()=>{
          const fetchDoctors=async ()=>{
                try{
                    const response=await API.get("/doctor/get-approved-doctors");//endpointi değiştir
                    setDoctors(response.data.doctors); //doktorları stateye aktar
                }
                catch(error){
                  console.error("Doktorlar alınamadı",error.message)
                }
          }
          fetchDoctors();
      },[]);
     
      const onSubmit=async(data)=>{
              try{
                  const response=API.post("/appointment/book",data)
                  alert("Randevu başarıyla alındı");
                  reset(); //formu sıfırla
              }
              catch(error){
                  alert("Randevu alınamadı :"+ error.response?.data?.message || error.message)
              }
      }

      return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Hasta Paneli</h1>

        {/* Randevu Oluşturma Formu */}
        <div className="bg-white shadow-md rounded p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Yeni Randevu Al</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Doktor seçimi */}
            <div>
              <label className="block mb-1">Doktor</label>
              <select {...register("doctor")} className="w-full border p-2 rounded" required>
                <option value="">Doktor Seçiniz</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.user.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Tarih alanı */}
            <div>
              <label className="block mb-1">Tarih</label>
              <input
                type="date"
                {...register("date")}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Saat alanı */}
            <div>
              <label className="block mb-1">Saat</label>
              <input
                type="time"
                {...register("time")}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            {/* Gönder butonu */}
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Randevu Al
            </button>
          </form>
        </div>
      </div>
    </div>
  );


};

export default PatientDashboard;
