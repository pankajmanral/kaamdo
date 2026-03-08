import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Select from "../components/Select";
import Button from "../components/Button";

export default function CompleteUserProfile() {
    const [formData, setFormData] = useState({
        phone: "",
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
            const token = localStorage.getItem("token");
            if (!token) {
                toast.error("Session expired, please login again");
                navigate("/login");
                return;
            }

            const response = await axios.post(
                "http://localhost:4000/api/auth/social/complete-user-profile",
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
                navigate("/user-dashboard");
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Profile</h2>
                    <p className="text-gray-600">Please provide a few more details to continue as a User.</p>
                </div>

                <form className="space-y-5" onSubmit={onSubmit}>
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

                    <div className="pt-2">
                        <Button type="submit" className="w-full" size="lg">Complete Account</Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
