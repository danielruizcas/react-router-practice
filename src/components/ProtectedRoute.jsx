import { Navigate, Outlet } from "react-router-dom"
import Login from "../routes/Login"


export const ProtectedRoute = ({isAllowed, children, redirectTo="/"}) => {
    if(!isAllowed){
        return <Navigate to={redirectTo}/>
    }
    return children ? children : <Outlet />
}