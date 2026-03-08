import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGoogleLogin } from "@react-oauth/google";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";

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

      if (response.status === 200) {
        toast.success("User registered successfully");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data.message);
    }
  };

  const handleSocialLogin = async (provider: "google" | "apple", token: string, firstName?: string, lastName?: string) => {
    try {
      const response = await axios.post("http://localhost:4000/api/auth/social/login", {
        provider,
        token,
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

  const googleLogin = useGoogleLogin({
    onSuccess: (codeResponse) => handleSocialLogin("google", codeResponse.access_token),
    onError: () => toast.error("Google login failed")
  });

  const handleAppleLogin = () => {
    toast.info("Apple login integration coming soon.");
  };

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
                Create Account
              </h2>
              <p className="text-gray-600">
                Join us to post jobs and find services
              </p>
            </div>

            <form className="space-y-5" onSubmit={onSubmit}>
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />

              <Input
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />

              <Input
                label="Phone Number"
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />

              <Input
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />

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
                    { value: "", label: "Select city" },
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
                <Button type="submit" className="w-full" size="lg">
                  Create Account
                </Button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div>
                  <button
                    onClick={() => googleLogin()}
                    type="button"
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    {/* Google SVG */}
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
                    {/* Apple SVG */}
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
                Already have an account?{" "}
                <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
