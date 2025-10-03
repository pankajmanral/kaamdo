import VendorLogin from "./Component/Vendor/VendorLogin";
import VendorRegister from "./Component/Vendor/VendorRegister";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLogin from "./Component/User/UserLogin";
import UserRegister from "./Component/User/UserRegister";	
import Home from "./Component/Home";

export default function App(){
	return(
		<>
			<Router>
				<Routes>
					<Route path="/" element={<UserRegister/>} />
					<Route path="/vendor/login" element={<VendorLogin/>}/>
					<Route path="/vendor/register" element={<VendorRegister/>}/>
					<Route path="/login" element={<UserLogin/>}/>
					{/* <Route path="/user/register" element={<UserRegister/>}/> */}
				</Routes>
			</Router>
		</>
	)
}