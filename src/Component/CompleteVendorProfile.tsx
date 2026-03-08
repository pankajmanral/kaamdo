import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";

export default function CompleteVendorProfile() {
    const [formData, setFormData] = useState({
        phone: "",
        gender: "",
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
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Session expired, please login again");
                navigate("/vendor-login");
                return;
            }

            const response = await axios.post(
                "http://localhost:4000/api/auth/social/complete-vendor-profile",
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (response.status === 200) {
                toast.success("Profile completed successfully");
                navigate("/vendor-dashboard");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-zinc-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full bg-zinc-800 rounded-lg shadow-2xl p-8 border border-zinc-700">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-white mb-2">Complete Profile</h2>
                    <p className="text-zinc-400">Please provide a few more details to continue as a Vendor.</p>
                </div>

                <form className="space-y-6" onSubmit={onSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Phone Number"
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                            required
                        />
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

                        <Select
                            label="Preferred Work Location"
                            name="preferredWorkLocation"
                            value={formData.preferredWorkLocation}
                            onChange={handleChange}
                            options={[
                                { value: "", label: "Select Preference" },
                                { value: "inside", label: "Inside" },
                                { value: "outside", label: "Outside" },
                                { value: "both", label: "Both" },
                            ]}
                            required
                        />

                        <Select
                            label="Vendor Type"
                            name="vendorType"
                            value={formData.vendorType}
                            onChange={handleChange}
                            options={[
                                { value: "", label: "Select Vendor Type" },
                                { value: "individual", label: "Individual" },
                                { value: "company", label: "Company" },
                            ]}
                            required
                        />

                        <Select
                            label="Document Type"
                            name="documentType"
                            value={formData.documentType}
                            onChange={handleChange}
                            options={[
                                { value: "", label: "Select Document Type" },
                                { value: "aadhar", label: "Aadhar" },
                                { value: "pan", label: "PAN" },
                                { value: "driving_license", label: "Driving License" },
                                { value: "voter_id", label: "Voter ID" },
                                { value: "passport", label: "Passport" },
                            ]}
                            required
                        />
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            size="lg"
                        >
                            Complete Account
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
