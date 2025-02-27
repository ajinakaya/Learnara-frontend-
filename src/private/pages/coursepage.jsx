import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import { useLanguage } from "../context/languagecontext";

const CoursesPage = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { selectedLanguage } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      if (!selectedLanguage) return;
      try {
        const response = await axios.get(
          `/course/course?language=${selectedLanguage._id}`
        );
        setCourses(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedLanguage]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 text-center p-4">
        Error loading courses: {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Language Header */}
        {courses[0]?.language && (
          <div className="flex items-center gap-4 mb-10">
            <img
              src={`http://localhost:3001/${courses[0].language.languageImage}`}
              alt={`${courses[0].language.languageName} flag`}
              className="w-11 h-8 shadow-md"
            />
            <h1 className="text-4xl font-bold">
              {courses[0].language.languageName} Courses
            </h1>
          </div>
        )}

        <h2 className="text-2xl font-semibold mb-6">All Courses</h2>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-20">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl  overflow-hidden border border-gray-200 hover:shadow-xl transition-all flex w-[415px] h-[233px]"
            >
              {/* Course Image */}
              <div className="w-47 h-30">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Course Info */}
              <div className="w-2/3 p-5 flex flex-col justify-between h-full">
                <div>
                  {/* Course Level */}
                  <div className="text-sm text-gray-600 mb-2">
                    Level {course.level.join("- ")}
                  </div>

                  {/* Course Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {course.title}
                  </h3>

                  {/* Course Description */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {course.description}
                  </p>
                </div>

                {/* Start Button */}
                <div className="flex justify-end items-end">
                  <button
                    className="bg-blue-600 text-white w-[80px] h-[30px] rounded-full hover:bg-blue-700 transition-all"
                    onClick={() => navigate(`/course/${course._id}/chapters`)}
                  >
                    Start
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
