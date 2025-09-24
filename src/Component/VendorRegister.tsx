import { Link } from "react-router-dom";

export default function UserRegister() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white py-2 px-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">Vendor Register</h1>

        <form className="space-y-3">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your name"
                required
                />
            </div>

            {/* Email */}
            <div>
                <label
                htmlFor="email"
                className="block text-gray-700 font-medium mb-1"
                >
                Email or Phone Number
                </label>
                <input
                type="email"
                id="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your email or phone number"
                required
                />
            </div>

            {/* Password and Confirm Password Side by Side */}
            <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex-1">
                <label
                    htmlFor="password"
                    className="block text-gray-700 font-medium mb-1"
                >
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter your password"
                    required
                />
                </div>

                <div className="flex-1 mt-4 md:mt-0">
                <label
                    htmlFor="confirm-password"
                    className="block text-gray-700 font-medium mb-1"
                >
                    Confirm Password
                </label>
                <input
                    type="password"
                    id="confirm-password"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Confirm your password"
                    required
                />
                </div>
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
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                </select>
            </div>

            {/* Preferred Work Location */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                Preferred Work Location
                </label>
                <div className="flex space-x-6">
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="location"
                    value="inside-city"
                    className="form-radio h-5 w-5 text-blue-500"
                    required
                    />
                    <span className="ml-2 text-gray-700">Inside City</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="location"
                    value="outside-city"
                    className="form-radio h-5 w-5 text-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Outside City</span>
                </label>
                </div>
            </div>

            {/* Document Type Selection */}
            <div>
                <label
                htmlFor="documentType"
                className="block text-gray-700 font-medium mb-1"
                >
                Select Document Type
                </label>
                <select
                id="documentType"
                name="documentType"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
                >
                <option value="">Choose document type</option>
                <option value="aadhar">Aadhaar Card</option>
                <option value="pan">PAN Card</option>
                <option value="other">Other Proof</option>
                </select>
            </div>

            {/* Document Upload */}
            <div>
                <label
                htmlFor="document"
                className="block text-gray-700 font-medium mb-1"
                >
                Upload Document
                </label>
                <input
                type="file"
                id="document"
                name="document"
                accept=".pdf,.jpg,.jpeg,.png"
                className="block w-full text-sm text-gray-700
                                    file:mr-4 file:py-2 file:px-4 file:rounded-md
                                    file:border-0 file:text-sm file:font-semibold
                                    file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                required
                />
                <p className="text-xs text-gray-500 mt-1">
                Accepted: PDF, JPG, PNG
                </p>
            </div>

            {/* Vendor Working Type */}
            <div>
                <label className="block text-gray-700 font-medium mb-2">
                Are you working individually or as a group?
                </label>
                <div className="flex space-x-6">
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="vendorWorkingType"
                    value="individual"
                    className="form-radio h-5 w-5 text-blue-500"
                    required
                    />
                    <span className="ml-2 text-gray-700">Individually</span>
                </label>
                <label className="inline-flex items-center">
                    <input
                    type="radio"
                    name="vendorWorkingType"
                    value="group"
                    className="form-radio h-5 w-5 text-blue-500"
                    />
                    <span className="ml-2 text-gray-700">Group</span>
                </label>
                </div>
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
            <Link
                to="/login"
                className="text-blue-500 hover:underline"
            >
                Login
            </Link>
            </p>
        </div>
        </div>
    );
}
