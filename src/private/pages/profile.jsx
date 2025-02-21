import axios from "axios";
import { BookOpen, Camera, Clock, Edit, Flame, Target } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../Admin/card";
import Navbar from "../components/navbar";
import { useAuth } from "../context/authcontext";

const UserProfile = () => {
  const { user, authToken, setUser } = useAuth();
  const navigate = useNavigate();
  const [selectedImage, setSelectedImage] = useState(user?.avatar || "");
  const [isUploading, setIsUploading] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(
    user?.language || "English"
  );
  const [selectedDays, setSelectedDays] = useState(user?.learningDays || []);

  const allDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleProfileImageClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        await uploadImage(file);
      }
    };
    input.click();
  };

  const toggleDay = (day) => {
    setSelectedDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const uploadImage = async (file) => {
    if (!authToken) {
      console.error("No token found");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post("/imageupload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setSelectedImage(response.data.imagePath);
        setUser((prev) => ({ ...prev, avatar: response.data.imagePath }));
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-blue-50">
                  <img
                    src={`http://localhost:3001/${user.image}`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  onClick={handleProfileImageClick}
                  className="absolute bottom-0 right-0 bg-white shadow-lg p-2 rounded-full 
                         transition-transform hover:scale-110 group-hover:bg-blue-50"
                >
                  <Camera className="w-4 h-4 text-blue-500" />
                </button>
              </div>

              <div className="text-center md:text-left flex-1">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user.fullname || "User"}
                  </h2>
                  <button
                    onClick={() => navigate("/edit-profile")}
                    className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <p className="text-gray-600 mb-4">
                  {user.email || "No email set"}
                </p>

                <div className="flex items-center gap-4 flex-wrap justify-center md:justify-start">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-700">
                      {selectedLanguage}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-700">
                      {user.dailyGoal || 30} mins/day
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Learning Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    transition-all duration-200 hover:scale-105
                    ${
                      selectedDays.includes(day)
                        ? "bg-blue-500 text-white shadow-lg"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                    }
                  `}
                  >
                    {day.slice(0, 1)}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                Today's Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    <span className="font-medium">Goal Progress</span>
                  </div>
                  <span className="text-lg font-bold">
                    {user.todayProgress || 0}%
                  </span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${user.todayProgress || 0}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-orange-50 to-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-full">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Current Streak</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {user.streak || 0} days
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-white rounded-full">
                  <Target className="w-6 h-6 text-blue-500" />
                </div>
                <h3 className="font-semibold text-gray-900">Daily Goal</h3>
              </div>
              <p className="text-3xl font-bold text-gray-900">
                {user.dailyGoal || 30} mins
              </p>
            </CardContent>
          </Card>
        </div>

        {isUploading && (
          <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-xl flex items-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-4 border-blue-500 border-t-transparent"></div>
              <span className="font-medium">Uploading...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
