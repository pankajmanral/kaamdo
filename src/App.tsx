import { ToastContainer } from "react-toastify";
import VendorLogin from "./Component/VendorLogin";
import VendorRegister from "./Component/VendorRegister";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Component/Home";

export default function App(){
	return(
		<>
			<Router>
				<Routes>
					<Route path="/" element={<Home/>} />
					<Route path="/register" element={<VendorRegister/>} />
					<Route path="/login" element={<VendorLogin/>}/>
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