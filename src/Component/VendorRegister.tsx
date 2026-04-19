import { data, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { useForm } from "react-hook-form";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { motion } from "framer-motion";

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

            if (result.data?.token) {
                localStorage.setItem("token", result.data.token);
            }
            if (result.data?.vendor?.name) {
                localStorage.setItem("vendorName", result.data.vendor.name);
            }
            toast.success("Vendor account created successfully!");
            navigate("/vendor-jobs");

        } catch (error: any) {
            toast.error(error.message)
        }
    }

    const handleSocialLogin = async (provider: "google" | "apple", credentialToken: string, firstName?: string, lastName?: string) => {
        try {
            const response = await axios.post("http://localhost:4000/api/auth/social/login", {
                provider,
                token: credentialToken,
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

    // Apple login placeholder (actual Apple JS SDK integration required for production)
    const handleAppleLogin = () => {
        toast.info("Apple login configuration required.");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

            <div className="max-w-6xl w-full z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                    {/* Left Side - Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="glass rounded-3xl p-10 sm:p-12 mb-auto mt-auto max-h-[90vh] overflow-y-auto"
                    >
                        <div className="mb-8 sticky top-0 backdrop-blur-md pb-4 -mx-8 px-8 border-b border-white/20 z-10">
                            <h2 className="text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
                                Join as Vendor
                            </h2>
                            <p className="text-slate-500 text-lg">
                                Create your vendor account to start bidding on jobs
                            </p>
                        </div>

                        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
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
                                type="password"
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
                                        { value: "", label: "Select" },
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

                            <div className="pt-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Preferred Work Location
                                </label>
                                <div className="space-y-3">
                                    <label className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("preferredWorkLocation", {
                                                required: true
                                            })}
                                            value="inside"
                                            className="mr-3 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                        />
                                        <span className="text-slate-700 font-medium">Inside City</span>
                                    </label>
                                    <label className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("preferredWorkLocation", {
                                                required: true
                                            })}
                                            value="outside"
                                            className="mr-3 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                        />
                                        <span className="text-slate-700 font-medium">Outside City</span>
                                    </label>
                                    <label className="flex items-center p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("preferredWorkLocation", {
                                                required: true
                                            })}
                                            value="both"
                                            className="mr-3 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                        />
                                        <span className="text-slate-700 font-medium">Both</span>
                                    </label>
                                </div>
                            </div>

                            <Select
                                label="Document Type"
                                {...register("documentType", {
                                    required: true
                                })}
                                options={[
                                    { value: "", label: "Choose type" },
                                    { value: "aadhar", label: "Aadhaar Card" },
                                    { value: "pan", label: "PAN Card" },
                                    { value: "other", label: "Other Proof" },
                                ]}
                            />

                            <div className="pt-2">
                                <label className="block text-sm font-semibold text-slate-700 mb-3">
                                    Working Type
                                </label>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <label className="flex items-center flex-1 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("vendorType", {
                                                required: true
                                            })}
                                            value="individual"
                                            className="mr-3 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                        />
                                        <span className="text-slate-700 font-medium">Individual</span>
                                    </label>
                                    <label className="flex items-center flex-1 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                        <input
                                            type="radio"
                                            {...register("vendorType", {
                                                required: true
                                            })}
                                            value="company"
                                            className="mr-3 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                        />
                                        <span className="text-slate-700 font-medium">Company</span>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:-translate-y-0.5 transition-all text-lg font-semibold h-12 rounded-xl" size="lg">
                                    Create Vendor Account
                                </Button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200/50"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-3 bg-slate-50 text-slate-500 font-medium">Or sign up with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-4">
                                <div>
                                    <div className="w-full flex justify-center items-center overflow-hidden rounded-xl h-11 border border-slate-200 bg-white hover:bg-slate-50 transition-all [&>div]:!w-full [&>div>div]:!w-full [&_iframe]:!w-full">
                                        <GoogleLogin
                                            onSuccess={(credentialResponse) => {
                                                if (credentialResponse.credential) {
                                                    handleSocialLogin("google", credentialResponse.credential);
                                                }
                                            }}
                                            onError={() => {
                                                toast.error("Google login failed");
                                            }}
                                            useOneTap
                                            theme="outline"
                                            size="large"
                                            width="100%"
                                            type="standard"
                                            shape="rectangular"
                                            context="signup"
                                        />
                                    </div>
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
                                Already a vendor?{" "}
                                <Link to="/vendor-login" className="font-bold text-indigo-600 hover:text-blue-600 transition-colors ml-1">
                                    Sign in here
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
            </div >
        </div >
    );
}
