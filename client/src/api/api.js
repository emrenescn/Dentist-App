import axios from "axios";

// API isteği yaparken ortak base URL’i burada tutuyoruz.
// Backend sunucumuz localhost'ta 5000 portunda çalışıyor
const API=axios.create({
    baseURL:"http://localhost:5000/api",
})

// Eğer istersek burada token ekleme gibi işlemler için interceptor yazabiliriz
export default API;