import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

type RegisterFormInputs = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  gender: string;
  location: string;
};

export default function UserRegister() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterFormInputs>();

  const onSubmit = async (data: RegisterFormInputs) => {
    // Only send what backend needs. Keep gender/location locally unless backend supports them.
    const { name, email, password } = data;
    try {
      const { user } = await api.register({ name, email, password }); // role optional
      alert(`Registered: ${user.email}`);
      reset();
    } catch (e: any) {
      alert(e.message ?? "Registration failed");
    }
  };

  const passwordValue = watch("password");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white py-2 px-8 rounded-lg shadow-md w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center">User Register</h1>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your name"
              {...register("name", {
                required: "Full name is required",
                pattern: { value: /^[^0-9]+$/, message: "Full name cannot contain digits." },
                minLength: { value: 2, message: "Min 2 characters" },
              })}
            />
            {errors.name && <p className="text-red-500 text-sm ps-2 py-2">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email Id is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Invalid email format",
                },
              })}
            />
            {errors.email && <p className="text-red-500 text-sm ps-2 py-2">{errors.email.message}</p>}
          </div>

          {/* Password + Confirm */}
          <div className="flex flex-col md:flex-row md:space-x-4">
            <div className="flex-1">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                  minLength: { value: 6, message: "Min 6 characters" },
                })}
              />
              {errors.password && <p className="text-red-500 text-sm ps-2 py-2">{errors.password.message}</p>}
            </div>

            <div className="flex-1 mt-4 md:mt-0">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm password",
                  validate: (v) => v === passwordValue || "Passwords do not match",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm ps-2 py-2">{errors.confirmPassword.message}</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-gray-700 font-medium mb-1">
              Gender
            </label>
            <select
              id="gender"
              className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              {...register("gender", { required: "Please select a gender" })}
              defaultValue=""
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm ps-2 py-2">{errors.gender.message}</p>}
          </div>

          {/* Location (kept for UI completeness) */}
          <div>
            <label htmlFor="location" className="block text-gray-700 font-medium mb-1">
              Location (optional)
            </label>
            <input
              type="text"
              id="location"
              className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="City / State"
              {...register("location")}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Already have an account?{" "}
          <Link to="/User/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
    