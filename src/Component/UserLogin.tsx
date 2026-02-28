import { Link, useNavigate } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface LoginUserForm {
	phone: number,
	password: string
}

export default function UserLogin() {

	const navigate = useNavigate();
	const { register, handleSubmit } = useForm<LoginUserForm>()

	const userLogin = async (data: LoginUserForm) => {
		try {
			const { phone, password } = data
			const payload = {
				phone: phone,
				password: password
			}
			const response = await fetch("http://localhost:4000/api/login", {
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
			toast.success("Successfully logged in")
			navigate("/user-dashboard")
			localStorage.setItem("userToken", result.data.token)
		} catch (error: any) {
			toast.error(error.message)
		}
	}


	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl w-full">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Left Side - Features */}
					<div className="hidden lg:flex flex-col items-center justify-center h-[90vh]">
						<h1 className="text-5xl font-bold text-blue-600 mb-8 text-center">KaamDo</h1>
						<p className="text-xl text-gray-600 mb-8 text-center">
							Join us to post jobs and find services
						</p>

						<div className="space-y-6 max-w-sm mx-auto">
							<div className="flex items-start gap-4">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
										<svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
									</div>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">
										Connect with talent
									</h3>
									<p className="mt-1 text-gray-600">
										Find skilled professionals for your projects
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
										<svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
									</div>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">
										Post jobs easily
									</h3>
									<p className="mt-1 text-gray-600">
										Simple and intuitive job posting process
									</p>
								</div>
							</div>

							<div className="flex items-start gap-4">
								<div className="flex-shrink-0">
									<div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
										<svg className="h-6 w-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
											<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
										</svg>
									</div>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900">
										Grow your business
									</h3>
									<p className="mt-1 text-gray-600">
										Expand your reach and find opportunities
									</p>
								</div>
							</div>
						</div>
					</div>

					{/* Right Side - Form */}
					<div className="bg-white rounded-lg shadow-lg p-8">
						<div className="mb-8 sticky top-0 bg-white pb-4 -mx-8 px-8 border-b z-10">
							<h2 className="text-3xl font-bold text-gray-900 mb-2">
								Welcome Back
							</h2>
							<p className="text-gray-600">
								Sign in to your account to continue
							</p>
						</div>

						<form className="space-y-5" onSubmit={handleSubmit(userLogin)}>
							<Input
								label="Phone Number"
								type="text"
								maxLength={10}
								placeholder="Enter your phone number"
								{...register("phone", {
									required: true
								})}
							/>

							<Input
								label="Password"
								type="password"
								placeholder="Enter your password"
								{...register("password", {
									required: true
								})}
							/>

							<div className="pt-2">
								<Button type="submit" className="w-full" size="lg">
									Sign In
								</Button>
							</div>
						</form>

						<div className="mt-6 text-center">
							<p className="text-sm text-gray-600">
								Don't have an account?{" "}
								<Link to="/register" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
									Create one here
								</Link>
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
