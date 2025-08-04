import React,{createContext,useState,useEffect} from "react";
import {jwtDecode} from "jwt-decode";
import API from "../api/api";

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
    const [user,setUser]=useState(null); //kullanıcı bilgisi
    const[token,setToken]=useState(null); //token jwt

    //local storagede token varsa sayfa yenilense bile kullanıcı bilgisi gelsin diye
    useEffect(()=>{
      const savedToken=localStorage.getItem("token");
      if(savedToken){
        setToken(savedToken);
        const decoded=jwtDecode(savedToken);
        setUser(decoded)}
    },[]);
    //giriş
 const login=(token)=>{
    localStorage.setItem("token",token);
    setToken(token);
    const decoded=jwtDecode(token);
    setUser(decoded)
}
//çıkış
 const logout=()=>{
    localStorage.removeItem("token");
    setToken(null)
    setUser(null)
}
return(
    //auth context üzerinden user token ve auth fonksiyonlarını sunduk
    <AuthContext.Provider value={{token,user,login,logout}}>
        {children}
    </AuthContext.Provider>
)
}
