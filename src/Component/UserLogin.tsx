import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Input from "../components/Input";
import Button from "../components/Button";
import { motion } from "framer-motion";

export default function UserLogin() {
  const [formData, setFormData] = useState({ phone: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response: any = await axios.post("http://localhost:4000/api/login", formData, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.data.token);
        toast.success("User logged in");
        navigate("/user-dashboard");
      }
    } catch (error) {
      toast.error("Invalid credentials");
    }
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
              Your gateway to seamless service connections and verified local professionals.
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
            className="glass rounded-3xl p-10 sm:p-12"
          >
            <div className="mb-8">
              <h2 className="text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                Welcome Back
              </h2>
              <p className="text-slate-500 text-lg">
                Sign in to your account and continue building.
              </p>
            </div>

            <form className="space-y-6" onSubmit={onSubmit}>
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

              <div className="space-y-1">
                <Input
                  label="Password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-lg font-semibold h-12 rounded-xl" size="lg">
                  Sign In
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-200/50 text-center">
              <p className="text-base text-slate-600">
                New to KaamDo?{" "}
                <Link to="/register" className="font-bold text-blue-600 hover:text-indigo-600 transition-colors ml-1">
                  Create an account
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
