import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

interface LoginFormInput{
    email: String,
    password: String
}

export default function VendorLogin() {

    const {register, handleSubmit, formState:{errors}} = useForm<LoginFormInput>()

    const onSubmit = (data: LoginFormInput) => {
        console.log(data)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Vendor Login
                </h1>

                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your email"
                            {...register("email",{
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email id"
                                }
                            })}
                            />
                        {errors.email && <p className="text-red-500 text-sm ps-2 py-2">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                            {...register("password",{
                                required: "Password is required",
                                pattern: {
                                    value: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
                                    message: "Please provide a stronger password"
                                }
                            })}
                        />
                        {errors.password && <p className="text-red-500 text-sm ps-2 py-2">Invalid password</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Login
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Don’t have an account?{" "}
                    <Link to="/" className="text-blue-500 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}
