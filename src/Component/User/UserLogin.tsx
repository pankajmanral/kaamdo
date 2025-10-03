import React from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";

type LoginFormInput = { phone: string; password: string };

export default function UserLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInput>();

  const onSubmit = async ({ phone, password }: LoginFormInput) => {
    try {
      // normalize common separators; keep optional leading +
      const normalizedPhone = phone.replace(/[\s-]/g, "");
      const { token, user } = await api.login({ phone: normalizedPhone, password });
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      alert(`Welcome, ${user.name}, logged in successfully!`);
      // navigate("/dashboard");
    } catch (e: any) {
      alert(e?.message ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">User Login</h1>

        <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-gray-700 font-medium mb-1">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. 9876543210 or +91XXXXXXXXXX"
              {...register("phone", {
                required: "Phone is required",
                pattern: {
                  value: /^\+?\d{10,15}$/,
                  message: "Enter a valid phone (10–15 digits, optional +)",
                },
              })}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm ps-2 py-2">{errors.phone.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full ps-2 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Min 6 characters" },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-sm ps-2 py-2">{errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-500 mt-4 text-center">
          Don’t have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
