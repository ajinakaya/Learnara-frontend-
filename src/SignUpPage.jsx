import React, { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 font-['Poppins']">
      <div className="max-w-6xl w-full mx-auto flex shadow-lg rounded-lg overflow-hidden">
        {/* Left side - Form */}
        <div className="w-1/2 bg-white p-8">
          <h1 className="text-2xl font-semibold mb-6">Welcome to Learnara</h1>
          
          <form className="space-y-5">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="First name"
                className="flex-1 p-3 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm"
              />
              <input
                type="text"
                placeholder="Last name"
                className="flex-1 p-3 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm"
              />
            </div>

            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm"
            />

            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm"
            />

            <div className="space-y-2">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? (
                    <EyeOffIcon className="w-5 h-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="w-5 h-5 text-gray-400" />
                  )}
                </button>
              </div>

             
              <div className="grid grid-cols-3 gap-x-6 gap-y-1 text-xs text-gray-400 px-1">
                <span>• Use 8 or more characters</span>
                <span>• One uppercase character</span>
                <span>• One lowercase character</span>
                <span>• One special character</span>
                <span>• One number</span>
              </div>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-3 border rounded-2xl focus:outline-none focus:ring-1 focus:ring-purple-400 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showConfirmPassword ? (
                  <EyeOffIcon className="w-5 h-5 text-gray-400" />
                ) : (
                  <EyeIcon className="w-5 h-5 text-gray-400" />
                )}
              </button>
            </div>

            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1 rounded" />
              <label htmlFor="terms" className="text-sm text-gray-600">
                By creating an account, you agree to the{" "}
                <a href="#" className="text-purple-600">Terms of use</a> and{" "}
                <a href="#" className="text-purple-600">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-200 text-gray-700 py-3 rounded-2xl hover:bg-gray-300 transition-colors font-medium text-sm"
            >
              Create an account
            </button>

            <div className="text-center text-sm">
              Already have an account?{" "}
              <a href="#" className="text-purple-600">Log in</a>
            </div>
          </form>
        </div>

        {/* Right side - Purple section */}
        <div className="w-1/2 bg-purple-600 p-8 flex items-center justify-center">
          <div className="text-white relative">
            <div className="text-5xl font-bold leading-tight">
              WHAT'S
              <br />
              YOUR
              <br />
              LANGUAGE?
            </div>
            <div className="absolute -right-4 -top-4">
              <div className="bg-yellow-400 px-4 py-1 rounded-full text-black font-medium">
                Let's Talk!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;