import axios from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface RegisterFormInputs {
    name: string,
    phone: string
    email: string,
    password: string,
    gender: string,
    location: string,
}

export default function UserRegister() {
    const { register, handleSubmit, formState: { errors }} = useForm<RegisterFormInputs>();
    const navigate = useNavigate()

    const onSubmit = async (formData: RegisterFormInputs) => {

        try {
            
            const response = await axios.post("http://localhost:4000/api/register", formData, {
                headers : {
                    "Content-Type" : "application/json"
                }
            })

            if(response.status === 201){
                toast.success("Vendor registered successfully")
                navigate("/login")
            }

        } catch (error: any) {
            toast.error(error.response?.data.message)
        }

    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white my-10 py-2 px-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
                <h1 className="text-2xl font-bold mb-4 text-center">
                    User Register
                </h1>

                <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
                    {/* Name */}
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your name"
                            {...register("name", {
                                required: "Full name is required",
                                pattern: {
                                    value: /^[^0-9]+$/,
                                    message: "Full name cannot contain digits.",
                                },
                            })}
                        />
                        {errors.name && <p className="text-red-500 text-sm ps-2 py-2">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Enter Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your email address"
                            {...register("email",{
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: "Invalid email format"
                                }
                            })}
                        />
                        {errors.email && <p className="text-red-500 text-sm ps-2 py-2">{errors.email.message}</p>}
                    </div>
                   
                    {/* phone */}
                    <div>
                        <label
                            htmlFor="phone"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Enter Phone number
                        </label>
                        <input
                            type="text"
                            id="phone"
                            className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your phone number"
                            {...register("phone",{
                                required: "Phone number is mandatory",
                                pattern: {
                                    value: /^[0-9]{10}$/,
                                    message: "Phone number should be 10 digits only"
                                }
                            })}
                        />
                        {errors.phone && <p className="text-red-500 text-sm ps-2 py-2">{errors.phone.message}</p>}
                    </div>

                    {/* Password */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Enter password
                        </label>
                        <input
                            type="text"
                            id="password"
                            className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Create password"
                            {...register("password",{
                                required: "Password is required",
                                pattern: {
                                    message: "Password must be atleast 8 characters long",
                                    value: /^[0-9a-zA-Z!@#$%^&*()]{8,}$/
                                }
                            })}
                        />
                        {errors.password && <p className="text-red-500 text-sm ps-2 py-2">{errors.password.message}</p>}
                    </div>

                    {/* Gender */}
                    <div>
                        <label
                            htmlFor="gender"
                            className="block text-gray-700 font-medium mb-1"
                        >
                            Gender
                        </label>
                        <select
                            id="gender"
                            className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            {...register("gender",{
                                required: "Please select a gender",
                            })} 
                        >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                        {errors.gender && <p className="text-red-500 text-sm ps-2 py-2">{errors.gender.message}</p>}
                    </div>

                    {/* location */}
                    <div>
                        <label htmlFor="location" className="block text-gray-700 font-medium mb-1">
                            Select your working city
                        </label>
                        <select id="location" className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                            {...register("location",{
                                required: "Please choose the city you want to work in",
                            })}
                        >
                            <option value="mumbai">Mumbai</option>
                            <option value="pune">Pune</option>
                            <option value="banglore">Banglore</option>
                            <option value="delhi">Delhi</option>
                            <option value="chennai">Chennai</option>
                            <option value="hyderabad">Hyderabad</option>
                            <option value="kolkata">Kolkata</option>
                        </select>
                        {errors.location && <p className="text-red-500 text-sm ps-2 py-2">{errors.location.message}</p>}
                    </div>


                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Register
                    </button>
                </form>

                <p className="text-sm text-gray-500 mt-4 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
}
