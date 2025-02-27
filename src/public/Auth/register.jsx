import React, { useState } from 'react';
import RightSide from './rightside';  
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify'; 
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showconfirmpassword, setShowconfirmpassword] = useState(false);
  const [formValues, setFormValues] = useState({
    fullname: '',
    email: '',
    username: '',
    password: '',
    confirmpassword: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Check if all fields are filled
    if (!formValues.fullname) {
      newErrors.fullname = 'Full name is required';
      
    }
    if (!formValues.email) {
      newErrors.email = 'Email is required';
      
    } else if (!formValues.email.includes('@')) {
      newErrors.email = 'Invalid email address';
      
    }
    if (!formValues.username) {
      newErrors.username = 'Username is required';
    
    }
    if (!formValues.password) {
      newErrors.password = 'Password is required';
     
    } else if (formValues.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
   
    }
    if (!formValues.confirmpassword) {
      newErrors.confirmpassword = 'Confirm Password is required';
     
    } else if (formValues.password !== formValues.confirmpassword) {
      newErrors.confirmpassword = 'Passwords do not match';
    
    }

    setErrors(newErrors);

  
    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await axios.post('/register', formValues);
        toast.success('Account created successfully!');
        navigate('/auth/login');
      } catch (error) {
        console.error('Registration error:', error.response?.data || error.message);
        if (error.response?.data?.error) {
          if (error.response?.data?.error === 'Email already taken') {
            toast.error('This email is already taken.');
          } else {
            toast.error(error.response?.data?.error);
          }
        } else {
          toast.error('Failed to create account. Please try again.');
        }
      }
    }
      };
      

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 font-['Poppins']">
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .gradient-bg {
            background: linear-gradient(135deg, #508991 0%,#365EA4 100%);
          }
          .gradient-btn {
            background: linear-gradient(135deg, #508991 0%,#365EA4 100%);
          }
          .gradient-btn:hover {
            background: linear-gradient(135deg, #457b82 0%,#2f5290 100%);
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
        `}
      </style>
      <div className="max-w-5xl w-full mx-auto flex flex-col md:flex-row shadow-xl rounded-2xl overflow-hidden h-[600px]">
        {/* Left side */}
        <div className="w-full md:w-1/2 bg-white p-6 relative flex flex-col">
          {/* Decorative elements */}
          <div className="absolute top-0 left-0 w-32 h-32 bg-teal-50 rounded-br-full -z-10"></div>
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-teal-50 rounded-tl-full -z-10"></div>
          
          <h1 className="text-2xl font-bold mb-2 text-gray-800">
            Welcome to Learnara
          </h1>
          <p className="text-sm text-gray-600 mb-4">Start your language learning journey today</p>

          <form className="space-y-4" onSubmit={handleSubmit}>
          
            <input
              type="text"
              name="fullname"
              placeholder="Fullname"
              value={formValues.fullname}
              onChange={handleChange}
              className="w-full input-field border border-gray-200 rounded-lg bg-gray-50"
            />
             {errors.fullname && <p className="text-red-500 text-xs">{errors.fullname}</p>}


            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formValues.email}
              onChange={handleChange}
              className="w-full input-field border border-gray-200 rounded-lg bg-gray-50"
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formValues.username}
              onChange={handleChange}
              className="w-full input-field border border-gray-200 rounded-lg bg-gray-50"
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formValues.password}
                  onChange={handleChange}
                  className="w-full input-field border border-gray-200 rounded-lg bg-gray-50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}

            
            </div>

            <div className="relative">
              <input
                type={showconfirmpassword ? 'text' : 'password'}
                name="confirmpassword"
                placeholder="Confirm Password"
                value={formValues.confirmpassword}
                onChange={handleChange}
                className="w-full input-field border border-gray-200 rounded-lg bg-gray-50 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowconfirmpassword(!showconfirmpassword)}
                className="absolute right-2 top-1/2 -translate-y-1/2"
              >
                {showconfirmpassword ? (
                  <EyeOffIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <EyeIcon className="w-4 h-4 text-gray-400" />
                )}
              </button>
            </div>
            {errors.confirmpassword && (
              <p className="text-red-500 text-xs">{errors.confirmpassword}</p>
            )}

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1 rounded border-gray-300" />
              <label htmlFor="terms" className="text-xs text-gray-600">
                By creating an account, you agree to the{' '}
                <a href="#" className="text-[#508991] hover:text-[#365EA4] underline">
                  Terms of use
                </a>{' '}
                and{' '}
                <a href="#" className="text-[#508991] hover:text-[#365EA4] underline">
                  Privacy Policy
                </a>
                .
              </label>
            </div>

            <button
              type="submit"
              className="w-full gradient-btn text-white py-3 rounded-lg transition-colors font-medium text-sm shadow-lg"
            >
              Create an account
            </button>

            <div className="text-center text-xs text-gray-600">
              Already have an account?{' '}
              <a href="/auth/login" className="text-[#508991] hover:text-[#365EA4] underline">
                Log in
              </a>
            </div>
          </form>
        </div>

        {/* Right side */}
        <RightSide /> 
      </div>
    </div>
  );
};

export default SignupPage;
