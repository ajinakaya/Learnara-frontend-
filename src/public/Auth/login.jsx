import axios from "axios";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RightSide from "./rightside";
import LanguageContext from "../../private/context/languagecontext";
import { jwtDecode } from "jwt-decode"; 


const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formValues, setFormValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false); 

  const { selectedLanguage } = useContext(LanguageContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Check if all fields are filled
    if (!formValues.email) {
      newErrors.email = "Email is required";
    } else if (!formValues.email.includes("@")) {
      newErrors.email = "Invalid email address";
    }

    if (!formValues.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      try {
        const response = await axios.post("/login", formValues);
        console.log("Login response:", response.data); 
    
        const { token } = response.data; 
        localStorage.setItem("authToken", token);
    
        // Decode the token to extract role
        const decodedToken = jwtDecode(token);
        const role = decodedToken.role; 
        console.log("Decoded User role:", role); 
    
        if (!role) {
          toast.error("User role is missing from token");
          return;
        }
    
        if (role !== "admin" &&  selectedLanguage) {
          await axios.post(
            "/language/language",
            { languageId: selectedLanguage._id },
            { headers: { Authorization: `Bearer ${token}` } }
          );
        }
    
        toast.success("Login successful!");
    
        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/coursepage");
        }
      } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        toast.error(error.response?.data?.error || "Failed to login. Please try again.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Poppins']">
      <style>
        {`
       @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .gradient-bg {
            background: linear-gradient(135deg, #508991 0%, #365EA4 100%);
          }
          .gradient-btn {
            background: linear-gradient(135deg, #508991 0%, #365EA4 100%);
          }
          .gradient-btn:hover {
            background: linear-gradient(135deg, #457b82 0%, #2f5290 100%);
          }
          .input-field {
            height: 45px;
            padding-left: 12px;
            padding-right: 12px;
            font-size: 13px;
          }
          .input-field:focus {
            outline: 1px solid grey;
            border-color: grey;
          }
          .custom-checkbox {
            accent-color: #508991;
          }
        `}
      </style>
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row shadow-2xl rounded-[32px] overflow-hidden h-[600px] bg-white">
        {/* Left side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md space-y-8">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-800">Sign in</h1>
              <p className="text-base text-gray-600">
                Welcome back to Learnara
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formValues.email}
                  onChange={handleChange}
                  className="w-full input-field rounded-xl bg-gray-50 border border-gray-200 shadow-sm"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs">{errors.email}</p>
                )}

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    value={formValues.password}
                    onChange={handleChange}
                    className="w-full input-field rounded-xl bg-gray-50 border border-gray-200 shadow-sm pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? (
                      <EyeOffIcon className="w-5 h-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {" "}
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    checked={formValues.rememberMe}
                    onChange={handleChange}
                    className="custom-checkbox rounded border-gray-300 w-3 h-3" // Smaller width and height
                  />
                  <label htmlFor="rememberMe" className="text-xs text-gray-600">
                    {" "}
                    {/* Smaller text */}
                    Remember me
                  </label>
                </div>
                <a
                  href="#"
                  className="text-xs text-[#508991] hover:text-[#365EA4] font-medium"
                >
                  {" "}
                  Forgot your password?
                </a>
              </div>

              <button
                type="submit"
                className="w-full gradient-btn text-white py-3 rounded-lg transition-colors font-medium text-sm shadow-lg"
              >
                Log in
              </button>

              <div className="text-center text-xs text-gray-600">
                Don't have an account?{" "}
                <a
                  href="/register"
                  className="text-[#508991] hover:text-[#365EA4] font-medium"
                >
                  Sign up
                </a>
              </div>
            </form>
          </div>
        </div>

        {/* Right side */}
        <RightSide />
      </div>
    </div>
  );
};

export default LoginPage;
