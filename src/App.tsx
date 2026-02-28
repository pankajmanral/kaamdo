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
import Layout from "./components/Layout";

export default function App() {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/vendor-register" element={<VendorRegister />} />
					<Route path="/vendor-login" element={<VendorLogin />} />
					<Route path="/login" element={<UserLogin />} />
					<Route path="/register" element={<UserRegister />} />
					<Route element={<ProtectedRoutes />}>
						<Route path="/vendor-jobs" element={<JobListing />} />
						<Route path="/user-dashboard" element={<UserDashboard />} />
						<Route path="/create-job" element={<NewJobPage />} />
						<Route path="/view-bids" element={<JobListing />} />
					</Route>
				</Routes>
			</Layout>
			<ToastContainer
				position="top-center"
				autoClose={5000}
				closeOnClick
				pauseOnHover
			/>
		</Router>
	)
}