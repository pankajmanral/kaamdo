import { Navigate, Outlet } from "react-router-dom"

export default function ProtectedRoutes(){

    // get the token from localstorage 
    const token = localStorage.getItem("token")
    if(!token){
        return <Navigate to={"/login"} replace/>
    }

    return <Outlet />

}