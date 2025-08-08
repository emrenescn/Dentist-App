import React,{useEffect,useState} from "react";
import API from "../api/api"
import { toast } from "react-toastify";


const DoctorDashboard = () => {
        //doktorun randevularını getir
        const [appointments,setAppointments]=useState([]);
        useEffect(()=>{
              const fetchAppointments=async()=>{
              try{
                  const res=await API.get(`/doctor/my-appointments`)
                  setAppointments(res.data)
              }
              catch(error){
                toast.error("Randevular yüklenemedi")
              }
              }
              fetchAppointments();
        },[])


        //onaylama butonu
        const handleApprove=async(id)=>{
          try{
            await API.put(`/doctor/approve/${id}`);
            toast.success("Randevu onaylandı")
            setAppointments((prev)=>prev.map((a)=>
            (
              a._id===id ? {...a,status:"approved"}:a
            )))

          }catch(error){
            toast.error("Onaylama işlemi başarısız")
            console.error(error)
          }
        }
        //reddetme butonu 
        const handleReject=async(id)=>{
          try{
              await API.put(`/doctor/reject/${id}`)
              toast.info("Randevu reddedildi")
              setAppointments((prev)=>(prev.map((a)=>(a._id===id ? {...a,status:"rejected"}:a))))
          }
          catch(error){
            toast.error("Reddetme işlemi başarısız")
            console.error(error);
          }
        }




        return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Randevularım</h1>
      {appointments.length === 0 ? (
        <p>Henüz randevu yok</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 border">Tarih</th>
              <th className="p-3 border">Hasta</th>
              <th className="p-3 border">Durum</th>
              <th className="p-3 border">İşlem</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td className="p-3 border">
                  {new Date(a.date).toLocaleDateString()} {a.time}
                </td>
                <td className="p-3 border">{a.patient?.name || "Bilinmiyor"}</td>
                <td className="p-3 border">{a.status}</td>
                <td className="p-3 border">
                  {a.status === "pending" && (
                    <>
                      <button
                        onClick={() => handleApprove(a._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded mr-2"
                      >
                        Onayla
                      </button>
                      <button
                        onClick={() => handleReject(a._id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Reddet
                      </button>
                    </>
                  )}
                  {a.status === "approved" && (
                    <span className="text-green-600 font-semibold">Onaylandı</span>
                  )}
                  {a.status === "rejected" && (
                    <span className="text-red-600 font-semibold">Reddedildi</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DoctorDashboard;

//DOKTOR RANDEVU LİSTELEME ONAYLAMA SİLME BİTTİ 