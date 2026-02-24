import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";

export default function VendorRegister() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    password: "",
    location: "",
    preferredWorkLocation: "",
    vendorType: "",
    documentType: "",
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:4000/api/vendorRegister", formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        toast.success("Vendor registered successfully");
        navigate("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data.message);
    }
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
                  label="Working City"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Preferred Work Location
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredWorkLocation"
                      value="inside"
                      checked={formData.preferredWorkLocation === "inside"}
                      onChange={handleChange}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Inside City</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredWorkLocation"
                      value="outside"
                      checked={formData.preferredWorkLocation === "outside"}
                      onChange={handleChange}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Outside City</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredWorkLocation"
                      value="both"
                      checked={formData.preferredWorkLocation === "both"}
                      onChange={handleChange}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Both</span>
                  </label>
                </div>
              </div>

              <Select
                label="Document Type"
                name="documentType"
                value={formData.documentType}
                onChange={handleChange}
                options={[
                  { value: "", label: "Choose document type" },
                  { value: "aadhar", label: "Aadhaar Card" },
                  { value: "pan", label: "PAN Card" },
                  { value: "other", label: "Other Proof" },
                ]}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Working Type
                </label>
                <div className="flex flex-col sm:flex-row sm:space-x-6 space-y-2 sm:space-y-0">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="vendorType"
                      value="individual"
                      checked={formData.vendorType === "individual"}
                      onChange={handleChange}
                      className="mr-3 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">Individual</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="vendorType"
                      value="company"
                      checked={formData.vendorType === "company"}
                      onChange={handleChange}
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
