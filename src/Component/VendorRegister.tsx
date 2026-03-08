import { data, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";

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
            const response = await fetch("http://localhost:4000/api/vendorRegister", {
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

            if (!response.ok) {
                throw new Error(result.message)
            }

            // navigate to vendor dashboard
            // navigate('/dashboard')

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
                    toast.success("Account created successfully");
                    navigate("/vendor-dashboard");
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to link social account");
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

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <div>
                                    <button
                                        onClick={() => googleLogin()}
                                        type="button"
                                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
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
                                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="h-5 w-5 mr-2 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.987 3.96.945 1.565-.027 2.606-1.479 3.605-2.934 1.156-1.685 1.636-3.321 1.662-3.414-.033-.013-3.183-1.22-3.216-4.858-.026-3.04 2.484-4.507 2.598-4.58-1.453-2.124-3.693-2.414-4.498-2.486-1.921-.17-3.844 1.144-4.832 1.144-.974 0-2.583-1.121-4.226-1.085L12.152 6.896zm-1.04-6.494c-.053.013-.105.027-.158.04-1.42.065-3.064.912-3.936 2.095-.778.938-1.346 2.195-1.187 3.425.04.013.08.026.12.026 1.488-.04 2.973-.836 3.868-2.036.852-1.066 1.345-2.275 1.293-3.55z" />
                                        </svg>
                                        Apple
                                    </button>
                                </div>
                            </div>
                        </div>

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
