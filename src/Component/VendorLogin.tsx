import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
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

	const handleSocialLogin = async (provider: "google" | "apple", token: string, firstName?: string, lastName?: string) => {
		try {
			const response = await axios.post("http://localhost:4000/api/auth/social/login", {
				provider,
				token,
				role: "vendor",
				firstName,
				lastName
			});

			if (response.status === 200) {
				localStorage.setItem("token", response.data.data.token);
				if (response.data.data.name) {
					localStorage.setItem("vendorName", response.data.data.name);
				}
				if (!response.data.data.isProfileComplete) {
					toast.info("Please complete your vendor profile to continue");
					navigate("/complete-vendor-profile");
				} else {
					toast.success("Logged in successfully");
					navigate("/vendor-dashboard");
				}
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to login with social account");
		}
	};

	const googleLogin = useGoogleLogin({
		onSuccess: (codeResponse) => handleSocialLogin("google", codeResponse.access_token),
		onError: () => toast.error("Google login failed")
	});

	const handleAppleLogin = () => {
		toast.info("Apple login configuration required.");
	};

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

						<div className="mt-8">
							<div className="relative">
								<div className="absolute inset-0 flex items-center">
									<div className="w-full border-t border-slate-200/50"></div>
								</div>
								<div className="relative flex justify-center text-sm">
									<span className="px-3 bg-slate-50 text-slate-500 font-medium">Or continue as Vendor with</span>
								</div>
							</div>

							<div className="mt-6 grid grid-cols-2 gap-4">
								<div>
									<button
										onClick={() => googleLogin()}
										type="button"
										className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
									>
										<svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
											<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
											<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
											<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
											<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
										</svg>
										Google
									</button>
								</div>
								<div>
									<button
										onClick={handleAppleLogin}
										type="button"
										className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:-translate-y-0.5 transition-all"
									>
										<svg className="h-5 w-5 mr-2 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
											<path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.987 3.96.945 1.565-.027 2.606-1.479 3.605-2.934 1.156-1.685 1.636-3.321 1.662-3.414-.033-.013-3.183-1.22-3.216-4.858-.026-3.04 2.484-4.507 2.598-4.58-1.453-2.124-3.693-2.414-4.498-2.486-1.921-.17-3.844 1.144-4.832 1.144-.974 0-2.583-1.121-4.226-1.085L12.152 6.896zm-1.04-6.494c-.053.013-.105.027-.158.04-1.42.065-3.064.912-3.936 2.095-.778.938-1.346 2.195-1.187 3.425.04.013.08.026.12.026 1.488-.04 2.973-.836 3.868-2.036.852-1.066 1.345-2.275 1.293-3.55z" />
										</svg>
										Apple
									</button>
								</div>
							</div>
						</div>

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
