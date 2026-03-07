import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

interface LoginVendorData {
	phone: string,
	password: string
}

export default function VendorLogin() {
	const navigate = useNavigate();

	// http://localhost:4000/api/vendorLogin

	const { register, handleSubmit } = useForm<LoginVendorData>();

	const loginVendor = async (data: LoginVendorData) => {
		try {
			const { phone, password } = data
			const payload = {
				phone: phone,
				password: password
			}
			const response = await fetch("http://localhost:4000/api/vendorLogin", {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(payload)
			})
			const result = await response.json()
			if (!response.ok) {
				throw new Error(result.message)
			}
			toast.success(result.message)
			localStorage.setItem("token", result.data.token)
			localStorage.setItem("vendorName", result.data.vendor.name)
			navigate("/vendor-jobs")
		} catch (error: any) {
			toast.error(error.message)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
			{/* Decorative Blobs */}
			<div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
			<div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

			<div className="max-w-6xl w-full z-10">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Side - Form */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: 0.2 }}
						className="glass rounded-3xl p-10 sm:p-12 mb-auto mt-auto"
					>
						<div className="mb-8">
							<h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
								Vendor Portal
							</h2>
							<p className="text-slate-500 text-lg">
								Sign in to manage jobs and connect with clients.
							</p>
						</div>

						<form className="space-y-6" onSubmit={handleSubmit(loginVendor)}>
							<div className="space-y-1">
								<Input
									label="Phone Number"
									maxLength={10}
									minLength={10}
									type="text"
									placeholder="Enter your phone number"
									{...register("phone", {
										required: true
									})}
								/>
							</div>

							<div className="space-y-1">
								<Input
									label="Password"
									type="password"
									placeholder="Enter your password"
									{...register("password", {
										required: true
									})}
								/>
							</div>

							<div className="pt-4">
								<Button type="submit" className="w-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all text-lg font-semibold h-12 rounded-xl" size="lg">
									Sign In to Dashboard
								</Button>
							</div>
						</form>

						<div className="mt-8 pt-6 border-t border-slate-200/50 text-center">
							<p className="text-base text-slate-600">
								New vendor?{" "}
								<Link to="/vendor-register" className="font-bold text-indigo-600 hover:text-blue-600 transition-colors ml-1">
									Apply here
								</Link>
							</p>
						</div>
					</motion.div>

					{/* Right Side - Features */}
					<motion.div
						initial={{ opacity: 0, x: 50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="hidden lg:flex flex-col items-center justify-center h-[90vh]"
					>
						<Link to="/" className="text-5xl font-extrabold text-gradient mb-8 text-center hover:scale-105 transition-transform">KaamDo Pro</Link>
						<p className="text-xl text-slate-600 mb-12 text-center max-w-md">
							Grow your service business with thousands of active local customers.
						</p>

						<div className="space-y-8 max-w-sm mx-auto">
							{[
								{ title: "Earn Money", desc: "Get paid securely for your skills and services", icon: "💰" },
								{ title: "Flexible Schedule", desc: "Work at your own pace and bid on your terms", icon: "📅" },
								{ title: "Build Reputation", desc: "Showcase expertise and attract more clients", icon: "⭐" }
							].map((feature, i) => (
								<motion.div
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.2 + (i * 0.1) }}
									key={i}
									className="flex items-start gap-5 glass p-5 rounded-2xl hover:-translate-y-1 transition-transform"
								>
									<div className="flex-shrink-0">
										<div className="flex items-center justify-center h-12 w-12 rounded-xl bg-indigo-100/50 text-2xl shadow-inner border border-indigo-200">
											{feature.icon}
										</div>
									</div>
									<div>
										<h3 className="text-lg font-bold text-slate-900">{feature.title}</h3>
										<p className="mt-1 text-slate-600 leading-snug">{feature.desc}</p>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
