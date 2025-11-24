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
import JobBidsPage from "./Component/JobBidsPage";
import MainPage from "./Component/MainPage";
import WelcomePage from "./Component/WelcomePage";
import AssignedJobs from "./Component/AssignedJobs";
import ViewJobs from "./Component/ViewJobs";
import JobHistory from "./Component/JobHistory";



export default function App(){
	return(
		<>
			<Router>
				<Routes>
					<Route path="/vendor-register" element={<VendorRegister/>} />
					<Route path="/vendor-login" element={<VendorLogin/>}/>
                    <Route path="/" element={<WelcomePage/>} />
                    <Route element={<MainPage/>}>
                        <Route element={<ProtectedRoutes/>}>
                            <Route path="/vendor-jobs" element={<JobListing/>}/>
                            <Route path="/user-dashboard" element={<UserDashboard/>} />
                            <Route path="/create-job" element={<NewJobPage />} />
                            <Route path="/view-bids" element={<JobListing/>} />
                            <Route path="/jobs/:jobId/bids" element={<JobBidsPage />} />
                            <Route path="/assigned-jobs" element={<AssignedJobs/>}/>
                            <Route path="/view-jobs" element={<ViewJobs/>} />
                            <Route path="/job-history" element={<JobHistory/>} />
                        </Route>
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