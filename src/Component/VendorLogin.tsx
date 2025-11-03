import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface LoginFormInput{
    phone: string,
    password: string
}

export default function VendorLogin() {
    
    const {register, handleSubmit, formState: {errors}} = useForm<LoginFormInput>();
    const navigate = useNavigate()

    const onSubmit = async(formData: LoginFormInput) => {
        try {
            
            const response = await axios.post("http://localhost:4000/api/vendorLogin", formData, {
                headers: {
                    "Content-Type": "application/json"
                }
            })

            if(response.status === 200){
                localStorage.setItem("token", response.data.data.token)
                toast.success("User logged in");
                navigate("/")
            }

        } catch (error) {
            toast.error("Invalid creadentials")
        }

    }
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-center">
                    Vendor Login
                </h1>

                <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
                    {/* Phone */}
                    <div className="mt-4">
                        <label htmlFor="phone" className="block text-gray-700 font-medium mb-1" >
                            Phone
                        </label>
                        <input type="text" id="phone" className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your phone number"
                        {
                            ...register("phone",{
                            required: "Phone number is required",
                            pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Phone number should be 10 digits long"
                            }
                        })}
                        />
                        {errors.phone ? <p className={`text-sm ps-2 h-4 my-1 ${errors.phone.message ? "text-red-500" : "invisible"}`}>{errors.phone.message}</p> : <p className="text-sm ps-2 h-4 my-1 invisible">This is for the error</p>}
                    </div>

                    {/* Password */}
                    <div className="mt-4">
                        <label  htmlFor="password" className="block text-gray-700 font-medium mb-1">
                            Password
                        </label>
                        <input type="password" id="password"  className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your password"
                        {
                            ...register("password",{
                                required: "Password is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9]{8,}$/,
                                    message: "Password must be atleast 8 characters long",
                                }
                            })
                        }
                        />
                        {errors.password ? <p className={`text-sm ps-2 h-4 my-1 ${errors.password.message ? "text-red-500" : "invisible"}`}>{errors.password.message}</p> : <p className="text-sm ps-2 h-4 my-1 invisible">This is for the error</p>}

                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors mt-10">
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
