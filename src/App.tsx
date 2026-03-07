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

import AssignedJobs from "./Component/AssignedJobs";
import JobBidsPage from "./Component/JobBidsPage";
import JobHistory from "./Component/JobHistory";
import axios from "axios";
import { toast } from "react-toastify";

// Define a global Axios interceptor to catch 401 Unauthorized errors (like expired tokens)
axios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const isUnauthorized = error.response && error.response.status === 401;
		const isJwtExpired = error.response && error.response.status === 400 && error.response.data?.error === "jwt expired";

		if (isUnauthorized || isJwtExpired) {
			const token = localStorage.getItem("token");
			if (token) {
				const isVendor = !!localStorage.getItem("vendorName");
				localStorage.removeItem("token");
				localStorage.removeItem("vendorName");
				toast.error("Session expired. Please log in again.");
				// Quick redirect based on previous role
				window.location.href = isVendor ? "/vendor-login" : "/login";
			}
		}
		return Promise.reject(error);
	}
);

export default function App() {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/vendor-register" element={<VendorRegister />} />
					<Route path="/vendor-login" element={<VendorLogin />} />
					<Route element={<ProtectedRoutes />}>
						<Route path="/vendor-jobs" element={<JobListing />} />
						<Route path="/user-dashboard" element={<UserDashboard />} />
						<Route path="/create-job" element={<NewJobPage />} />
						<Route path="/view-bids" element={<JobListing />} />
						<Route path="/jobs/:jobId" element={<JobBidsPage />} />
						<Route path="/job-history" element={<JobHistory />} />
						<Route path="/assigned-jobs" element={<AssignedJobs />} />
					</Route>
					<Route path="/login" element={<UserLogin />} />
					<Route path="/register" element={<UserRegister />} />
				</Routes>
			</Layout>
			<ToastContainer
				position="top-center"
				autoClose={1000}
				closeOnClick
				pauseOnHover
			/>
		</Router>
	)
}