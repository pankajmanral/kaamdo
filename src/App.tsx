import VendorLogin from "./Component/VendorLogin";
import VendorRegister from "./Component/VendorRegister";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App(){
	return(
		<>
			<Router>
				<Routes>
					<Route path="/" element={<VendorRegister/>} />
					<Route path="/login" element={<VendorLogin/>}/>
				</Routes>
			</Router>
		</>
	)
}