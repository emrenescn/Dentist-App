import React from "react";
import {useForm} from "react-hook-form";
import * as yup from "yup"
import {yupResolver} from "@hookform/resolvers/yup"
import API from "../api/api";
import { useNavigate } from "react-router-dom";

const schema=yup.object().shape(
{
  name:yup.string().required("İsim gerekli"),
  email:yup.string().email("Geçersiz e-posta").required("Email gerekli"),
  password:yup.string().min(6,"şifre en az 6 karakter olmalı").required("Şifre gerekli")

})

const Register=()=>{
  const navigate=useNavigate();
  const {register
    ,handleSubmit
    ,formState:{errors}
}=useForm({resolver:yupResolver(schema)})


const onSubmit=async(data)=>{
try{
    const response=await API.post("/auth/register",data)
    alert("kayıt başarılı kullanıcı giriş yapabilir")
    navigate("/login") //kayıt başarılı olduktan sonra login sayfasına yönlendir
}
catch(error){
    alert("Kayıt Başarısız :"+error.respons?.data?.message||error.message)
}}
return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Kayıt Ol</h2>

        <div className="mb-4">
          <label className="block mb-1">İsim</label>
          <input
            {...register("name")}
            className="w-full p-2 border rounded"
            placeholder="Adınız"
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div className="mb-4">
          <label className="block mb-1">E-posta</label>
          <input
            {...register("email")}
            className="w-full p-2 border rounded"
            placeholder="ornek@mail.com"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="mb-6">
          <label className="block mb-1">Şifre</label>
          <input
            type="password"
            {...register("password")}
            className="w-full p-2 border rounded"
            placeholder="Şifreniz"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          Kayıt Ol
        </button>
      </form>
    </div>
  );
}
export default Register;






