import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GoogleLogin } from "@react-oauth/google";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";
import { motion } from "framer-motion";

export default function UserRegister() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    gender: "",
    location: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/register", formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 201 || response.status === 200) {
        if (response.data?.data?.token) {
          localStorage.setItem("token", response.data.data.token);
        }
        toast.success("User registered successfully");
        navigate("/user-dashboard");
      }
    } catch (error: any) {
      toast.error(error.response?.data.message);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple", credentialToken: string, firstName?: string, lastName?: string) => {
    try {
      const response = await axios.post("http://localhost:4000/api/auth/social/login", {
        provider,
        token: credentialToken,
        role: "user",
        firstName,
        lastName
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.data.token);
        if (!response.data.data.isProfileComplete) {
          toast.info("Please complete your profile to continue");
          navigate("/complete-user-profile");
        } else {
          toast.success("Account created successfully");
          navigate("/user-dashboard");
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to link social account");
    }
  };

  // Apple login placeholder (actual Apple JS SDK integration required for production)
  const handleAppleLogin = () => {
    toast.info("Apple login requires Apple Developer configuration");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Features */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="hidden lg:flex flex-col items-center justify-center h-[90vh]"
          >
            <Link to="/" className="text-5xl font-extrabold text-gradient mb-8 text-center hover:scale-105 transition-transform">KaamDo</Link>
            <p className="text-xl text-slate-600 mb-12 text-center max-w-md">
              Start finding perfect local professionals for all your needs.
            </p>


            <div className="space-y-8 max-w-sm mx-auto">
              {[
                { title: "Connect with talent", desc: "Find skilled professionals for your projects", icon: "🤝" },
                { title: "Post jobs easily", desc: "Simple and intuitive fast job posting process", icon: "⚡" },
                { title: "Grow your network", desc: "Expand your reach and find local opportunities", icon: "📈" }
              ].map((feature, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  key={i}
                  className="flex items-start gap-5 glass p-5 rounded-2xl hover:-translate-y-1 transition-transform"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-blue-100/50 text-2xl shadow-inner border border-blue-200">
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

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass rounded-3xl p-6 sm:p-8 mb-auto mt-auto max-h-[90vh] overflow-y-auto"
          >
            <div className="mb-4 sticky top-0 backdrop-blur-md pb-3 -mx-6 px-6 sm:-mx-8 sm:px-8 border-b border-white/20 z-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-1 tracking-tight">
                Create Account
              </h2>
              <p className="text-slate-500 text-sm sm:text-base">
                Join us to post jobs and find services
              </p>
            </div>

            <form className="space-y-3" onSubmit={onSubmit}>
              <div className="space-y-1">
                <Input
                  label="Full Name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div className="space-y-1">
                <Input
                  label="Phone Number"
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />
              </div>



              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "Select gender" },
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                  required
                />

                <Select
                  label="City"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  options={[
                    { value: "", label: "City" },
                    { value: "mumbai", label: "Mumbai" },
                    { value: "pune", label: "Pune" },
                    { value: "bangalore", label: "Bangalore" },
                    { value: "delhi", label: "Delhi" },
                    { value: "chennai", label: "Chennai" },
                    { value: "hyderabad", label: "Hyderabad" },
                    { value: "kolkata", label: "Kolkata" },
                  ]}
                  required
                />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-lg font-semibold h-12 rounded-xl" size="lg">
                  Create Account
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200/50"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-slate-50 text-slate-500 font-medium">Or continue with</span>
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
                    className="w-full flex items-center justify-center px-4 py-2 border border-slate-200 rounded-xl shadow-sm text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5 transition-all"
                  >
                    {/* Apple SVG */}
                    <svg className="h-5 w-5 mr-2 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.43.987 3.96.945 1.565-.027 2.606-1.479 3.605-2.934 1.156-1.685 1.636-3.321 1.662-3.414-.033-.013-3.183-1.22-3.216-4.858-.026-3.04 2.484-4.507 2.598-4.58-1.453-2.124-3.693-2.414-4.498-2.486-1.921-.17-3.844 1.144-4.832 1.144-.974 0-2.583-1.121-4.226-1.085L12.152 6.896zm-1.04-6.494c-.053.013-.105.027-.158.04-1.42.065-3.064.912-3.936 2.095-.778.938-1.346 2.195-1.187 3.425.04.013.08.026.12.026 1.488-.04 2.973-.836 3.868-2.036.852-1.066 1.345-2.275 1.293-3.55z" />
                    </svg>
                    Apple
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200/50 text-center">
              <p className="text-sm sm:text-base text-slate-600">
                Already have an account?{" "}
                <Link to="/login" className="font-bold text-blue-600 hover:text-indigo-600 transition-colors ml-1">
                  Sign in here
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
