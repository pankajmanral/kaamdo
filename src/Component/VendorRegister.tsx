import { data, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { useForm } from "react-hook-form";

interface VendorRegisterForm {
    fullName: string,
    email: string,
    phoneNumber: string,
    password: string,
    gender: string,
    city: string,
    preferredWorkLocation: string;
    documentType: string;
    vendorType: string;
}

export default function VendorRegister() {
    const { register, handleSubmit } = useForm<VendorRegisterForm>()
    const navigate = useNavigate();

    const onSubmit = async (data: VendorRegisterForm) => {
        try {
            const response = await fetch("http://localhost:4000/api/vendorRegister",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: data.fullName,
                    email: data.email,
                    phone: data.phoneNumber,
                    password: data.password,
                    gender: data.gender,
                    location: data.city,
                    preferredWorkLocation: data.preferredWorkLocation,
                    documentType: data.documentType,
                    vendorType: data.vendorType
                })
            })

            const result = await response.json()

            if(!response.ok){
                throw new Error(result.message)
            }

            // navigate to vendor dashboard
            // navigate('/dashboard')

        } catch (error: any) {
                toast.error(error.message)
        }
    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side - Form */}
                    <div className="bg-white rounded-lg shadow-lg p-8 max-h-[90vh] overflow-y-auto">
                        <div className="mb-8 sticky top-0 bg-white pb-4 -mx-8 px-8 border-b z-10">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Join as Vendor
                            </h2>
                            <p className="text-gray-600">
                                Create your vendor account to start bidding on jobs
                            </p>
                        </div>

                        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                            <Input
                                label="Full Name"
                                {...register("fullName", {
                                    required: true
                                })}
                                placeholder="Enter your full name"
                            />

                            <Input
                                label="Email Address"
                                {...register("email", {
                                    required: false
                                })}
                                placeholder="Enter your email address"
                            />

                            <Input
                                label="Phone Number"
                                minLength={10}
                                maxLength={10}
                                {...register("phoneNumber", {
                                    required: true
                                })}
                                placeholder="Enter your phone number"
                            />

                            <Input
                                label="Password"
                                minLength={8}
                                {...register("password", {
                                    required: true
                                })}
                                placeholder="Create a strong password"
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <Select
                                    label="Gender"
                                    {...register("gender", {
                                        required: true
                                    })}
                                    options={[
                                        { value: "", label: "Select gender" },
                                        { value: "male", label: "Male" },
                                        { value: "female", label: "Female" },
                                        { value: "other", label: "Other" },
                                    ]}
                                />

                                <Select
                                    label="Working City"
                                    {...register("city", {
                                        required: true
                                    })}
                                    options={[
                                        { value: "", label: "Select city" },
                                        { value: "mumbai", label: "Mumbai" },
                                        { value: "pune", label: "Pune" },
                                        { value: "bangalore", label: "Bangalore" },
                                        { value: "delhi", label: "Delhi" },
                                        { value: "chennai", label: "Chennai" },
                                        { value: "hyderabad", label: "Hyderabad" },
                                        { value: "kolkata", label: "Kolkata" },
                                    ]}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Preferred Work Location
                                </label>
                                <div className="space-y-2">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            {...register("preferredWorkLocation", {
                                                required: true
                                            })}
                                            value="inside"
                                            className="mr-3 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">Inside City</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            {...register("preferredWorkLocation", {
                                                required: true
                                            })}
                                            value="outside"
                                            className="mr-3 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">Outside City</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            {...register("preferredWorkLocation", {
                                                required: true
                                            })}
                                            value="both"
                                            className="mr-3 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">Both</span>
                                    </label>
                                </div>
                            </div>

                            <Select
                                label="Document Type"
                                {...register("documentType", {
                                    required: true
                                })}
                                options={[
                                    { value: "", label: "Choose document type" },
                                    { value: "aadhar", label: "Aadhaar Card" },
                                    { value: "pan", label: "PAN Card" },
                                    { value: "other", label: "Other Proof" },
                                ]}
                            />

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Working Type
                                </label>
                                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            {...register("vendorType", {
                                                required: true
                                            })}
                                            value="individual"
                                            className="mr-3 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">Individual</span>
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            {...register("vendorType", {
                                                required: true
                                            })}
                                            value="company"
                                            className="mr-3 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="text-gray-700">Company</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Button type="submit" className="w-full" size="lg">
                                    Create Vendor Account
                                </Button>
                            </div>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already a vendor?{" "}
                                <Link to="/vendor-login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Right Side - Features */}
                    <div className="hidden lg:flex flex-col items-center justify-center h-[90vh]">
                        <h1 className="text-5xl font-bold text-blue-600 mb-8 text-center">KaamDo</h1>
                        <p className="text-xl text-gray-600 mb-8 text-center">
                            Grow your service business
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
                                        Earn Money
                                    </h3>
                                    <p className="mt-1 text-gray-600">
                                        Get paid for your skills and services
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
                                        Choose Your Schedule
                                    </h3>
                                    <p className="mt-1 text-gray-600">
                                        Work at your own pace and availability
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
                                        Build Your Profile
                                    </h3>
                                    <p className="mt-1 text-gray-600">
                                        Showcase your expertise and attract clients
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
