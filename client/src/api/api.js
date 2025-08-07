import axios from "axios";

// API isteği yaparken ortak base URL’i burada tutuyoruz.
// Backend sunucumuz localhost'ta 5000 portunda çalışıyor
const API=axios.create({
    baseURL:"http://localhost:5000/api",
})


//istekler için token eklemek için interceptor
API.interceptors.request.use((config)=>{
    const token=localStorage.getItem("token");
    if(token){
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
},(error)=>{
        return Promise.reject(error) //hata olursa axios bunu göz ardı etmesin hata fırlatsın diye eklendi try catch eklenebilirdi
}
)

export default API;