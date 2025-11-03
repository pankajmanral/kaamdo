import Home from "./Component/Home";
import VendorLogin from "./Component/VendorLogin";
import VendorRegister from "./Component/VendorRegister";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProtectedRoutes from "./utils/ProtectedRoutes";

export default function App(){
	return(
		<>
			<Router>
				<Routes>
					<Route path="/register" element={<VendorRegister/>} />
					<Route path="/login" element={<VendorLogin/>}/>
                    <Route element={<ProtectedRoutes/>}>
					    <Route path="/" element={<Home/>} />
                    </Route>
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