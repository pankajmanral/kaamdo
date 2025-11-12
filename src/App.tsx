import Home from "./Component/Home";
import VendorLogin from "./Component/VendorLogin";
import VendorRegister from "./Component/VendorRegister";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import JobListing from "./Component/JobListing";
import UserRegister from "./Component/UserRegister";
import UserLogin from "./Component/UserLogin";
import { UserDashboard } from "./Component/UserDashboard";
import NewJobPage from "./Component/NewJobPage";

export default function App(){
	return(
		<>
			<Router>
				<Routes>
					<Route path="/vendor-register" element={<VendorRegister/>} />
					<Route path="/vendor-login" element={<VendorLogin/>}/>
                    <Route element={<ProtectedRoutes/>}>
					    <Route path="/" element={<Home/>} />
                        <Route path="/vendor-jobs" element={<JobListing/>}/>
						<Route path="/user-dashboard" element={<UserDashboard/>} />
						<Route path="/create-job" element={<NewJobPage />} />
                    </Route>
					<Route path="/login" element={<UserLogin/>} />
					<Route path="/register" element={<UserRegister/>} />
				</Routes>
			</Router>

            <ToastContainer 
                position="top-center"
                autoClose= {1000}
                closeOnClick
                pauseOnHover
            />

		</>
	)
}