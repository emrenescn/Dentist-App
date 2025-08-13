import React,{useState,useEffect} from "react";
import API from "../api/api"
import { toast } from "react-toastify";



const AdminDashboard = () => {
        const[pendingApplications,setPendingApplications]=useState([]);
        const[loading,setLoading]=useState(true)

        
        useEffect(()=>{
            //onay bekleyen doktorları çek 
        const fetchPendingDoctors=async()=>{
            try {
                const res=await API.get('/doctor-application/pending-doctors');
                setPendingApplications(res.data.pendingDoctors || []) //boş array kontrolü yoksa hata veriyor
            } catch (error) {
              toast.error("Onay bekleyen doktorlar alınamadı")
              console.error(error)
            }
            finally{
              setLoading(false)
            }
        }
            fetchPendingDoctors();
        },[])

        //onaylama veya reddetme 
        const handleApproval=async(applicationId,status)=>{
          try{
            await API.put(`/doctor-application/update-doctor-approval`,{
              applicationId,
              status});
            toast.success(status==="approved" ? "Doktor onaylandı":"Doktor Reddedildi")
            setPendingApplications((prev)=>prev.filter((d)=>d._id!==applicationId))
          }catch(error){
            toast.error("İşlem başarısız oldu")
            console.error(error)
          }
        }
        if (loading) return <p>Yükleniyor...</p>;

         return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Admin Paneli - Onay Bekleyen Doktor Başvuruları
      </h1>

      {pendingApplications.length === 0 ? (
        <p>Onay bekleyen doktor başvurusu bulunmamaktadır.</p>
      ) : (
        <ul>
          {pendingApplications.map((app) => (
            <li
              key={app._id}
              className="mb-4 p-4 border rounded shadow flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">
                  {app.user?.name} ({app.user?.email})
                </p>
                <p>Uzmanlık: {app.specialization}</p>
                <p>Hakkında: {app.bio}</p>
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleApproval(app._id, "approved")}
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                >
                  Onayla
                </button>
                <button
                  onClick={() => handleApproval(app._id, "rejected")}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Reddet
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminDashboard;

//admin sayfasında beklenen başvurular gözükmüyor buradan devam edersin artık 