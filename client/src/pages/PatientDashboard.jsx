import React,{useEffect,useState} from "react";
import API from "../api/api";
import { useForm } from "react-hook-form";
import axios from "axios";





const PatientDashboard = () => {
      //Doktorları saklayacağımız state 
      const [doctors,setDoctors]=useState([]);
      const[availableTimes,setAvailableTimes]=useState([]);
      //react-hook-form tanımı
      const {register,handleSubmit,reset,watch}=useForm();
      const selectedDoctorId=watch("doctor")//seçilen doktoru takip etmek için

    //hastanın kendi randevularını çek
    const [myAppointments,setMyAppointments]=useState([]);

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

      //yukarıdaki doktor seçimi gerçekleşince ona uygun saatleri çek backendden 
     useEffect(() => {
  const date = watch("date");
  const doctorId = watch("doctor"); // Bunu doğrudan watch ile de alabilirsin

  if (!doctorId || !date) {
    setAvailableTimes([]);
    return;
  }

  const fetchAvailableTimes = async () => {
    try {
      const response = await API.get(`/doctor/${doctorId}/available-times`, {
        params: { date },
      });
      setAvailableTimes(response.data.availableTimes);
    } catch (error) {
      console.error("Uygun saatler alınamadı", error.message);
    }
  };

  fetchAvailableTimes();
}, [watch("doctor"), watch("date")]); //buradaki useeffecte bu parametrelerin eklenmesinin sebebi kullanıcı formda doktor ismi değiş
                                          //tirdiğinde tekrar use effect seçtiği doktora göre bu fonksiyonları çalıştırsın diye
                                          //aynı şekilde buradaki watch fonksiyonunun içierisndeki alanda anlık değişince formdaki seçenekler ona göre güncellensin diye
useEffect(()=>{
    const fetchMyAppointments=async()=>{
      try{
        const response=await API.get("/appointment/my-appointments");
        setMyAppointments(response.data.appointments)
      }
      catch(error){
          console.error("Randevular alınamadı",error.message)
      }
    }
      fetchMyAppointments();
},[])
  

const onSubmit=async(data)=>{
      try{
         const response=API.post("/appointment/book",data)
          alert("Randevu başarıyla alındı");
          reset(); //formu sıfırla
          setAvailableTimes([]);
         }
        catch(error){
         alert("Randevu alınamadı :"+ error.response?.data?.message || error.message)
       }
      }

       return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Hasta Paneli</h1>

        <div className="bg-white shadow-md rounded p-4 mb-6">
          <h2 className="text-xl font-semibold mb-4">Yeni Randevu Al</h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

            <div>
              <label className="block mb-1">Tarih</label>
              <input
                type="date"
                {...register("date")}
                className="w-full border p-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Saat</label>
              <select {...register("time")} className="w-full border p-2 rounded" required>
  <option value="">Saat Seçiniz</option>

  {!watch("doctor") || !watch("date") ? (
    <option disabled>Önce doktor ve tarih seçiniz</option>
  ) : availableTimes.length === 0 ? (
    <option disabled>Seçilen tarihte uygun saat bulunamadı</option>
  ) : (
    availableTimes.map((time) => (
      <option key={time} value={time}>
        {time}
      </option>
    ))
  )}
</select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Randevu Al
            </button>
          </form>
        </div>
        <div className="bg-white shadow-md rounded p-4">
  <h2 className="text-xl font-semibold mb-4">Randevularım</h2>

  {myAppointments.length === 0 ? (
    <p>Hiç randevunuz bulunmamaktadır.</p>
  ) : (
    <ul className="space-y-2">
      {myAppointments.map((appointment) => (
        <li
          key={appointment._id}
          className="border p-3 rounded shadow-sm flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{appointment.doctor?.user?.name}</p>
            <p className="text-sm text-gray-500">{appointment.doctor?.specialization}</p>
            <p>{appointment.date} - {appointment.time} -{appointment.status}</p>
          </div>
        </li>
      ))}
    </ul>
  )}
</div>
      </div>
    </div>
  );

};

export default PatientDashboard;

//randevu iptali kısmında kaldık 
 