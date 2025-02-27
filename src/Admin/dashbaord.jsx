import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";
import {
  BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,Legend,
} from "recharts";
import {
  FileText,Languages,GraduationCap,Layers,Globe,
} from "lucide-react";
import Sidebar from "./sidebar";

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [flashcard, setFlashcard] = useState([]);
  const [quiz, setQuiz] = useState([]);
  const [video, setVideo] = useState([]);
  const [courses, setCourses] = useState([]);
  const [audio, setAudio] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    axios
      .get("/preferred-language/preferredlanguages")
      .then((res) => setLanguages(res.data))
      .catch((err) => console.error("Error fetching languages:", err));

    // Fetch flashcard
    axios
      .get("/flashcard/flashcard")
      .then((res) => setFlashcard(res.data))
      .catch((err) => console.error("Error fetching flashcard:", err));

    // Fetch quiz
    axios
      .get("/quiz/quiz")
      .then((res) => setQuiz(res.data))
      .catch((err) => console.error("Error fetching quiz:", err));

    // Fetch video
    axios
      .get("/video/video")
      .then((res) => setVideo(res.data))
      .catch((err) => console.error("Error fetching video:", err));

    // Fetch courses
    axios
      .get("/course/course")
      .then((res) => setCourses(res.data))
      .catch((err) => console.error("Error fetching courses:", err));

    // Fetch audio
    axios
      .get("/audio/audio")
      .then((res) => setAudio(res.data))
      .catch((err) => console.error("Error fetching audio:", err));

    // Fetch chapters
    axios
      .get("/chapter/chapters")
      .then((res) => setChapters(res.data))
      .catch((err) => console.error("Error fetching chapters:", err));

    // Fetch lessons
    axios
      .get("/sublesson/lesson")
      .then((res) => setLessons(res.data))
      .catch((err) => console.error("Error fetching lessons:", err));
  }, []);

  // Language data - just names without user counts
  const languageList = languages.map((lang) => ({
    name: lang.languageName || "Unknown",

  }));

  const activityData = [
    { name: "Flashcards", value: flashcard.length, color: "#4F46E5" },
    { name: "Quizzes", value: quiz.length, color: "#06B6D4" },
    { name: "Videos", value: video.length, color: "#16A34A" },
    { name: "Audio", value: audio.length, color: "#EA580C" },
  ];

  const courseStructureData = [
    { name: "Courses", value: courses.length },
    { name: "Chapters", value: chapters.length },
    { name: "Lessons", value: lessons.length },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-50 p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Admin Dashboard
        </h1>

        {/* Stats Overview */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-indigo-100 p-3 mr-4">
              <GraduationCap className="text-indigo-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Courses</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-cyan-100 p-3 mr-4">
              <Layers className="text-cyan-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Lessons</p>
              <p className="text-2xl font-bold">{lessons.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-green-100 p-3 mr-4">
              <Languages className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Languages</p>
              <p className="text-2xl font-bold">{languages.length}</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 flex items-center">
            <div className="rounded-full bg-orange-100 p-3 mr-4">
              <FileText className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Activities</p>
              <p className="text-2xl font-bold">
                {flashcard.length + quiz.length + video.length + audio.length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Languages List */}
          <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Globe className="mr-3 text-blue-600" size={24} />
              <h2 className="text-xl font-semibold">Supported Languages</h2>
            </div>
            <div className="mb-4">
              <p className="text-gray-600">
                Total languages:{" "}
                <span className="font-semibold">{languages.length}</span>
              </p>
            </div>
            <div className="mt-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-3 gap-4">
                {languageList.map((lang, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-50 p-2 rounded-lg shadow"
                  >
                    <Languages className="text-blue-600" size={20} />
                    <span className="font-medium">{lang.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activities Card (Redesigned) */}
          <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <FileText className="mr-3 text-green-500" size={24} />
              <h2 className="text-xl font-semibold">Learning Activities</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {activityData.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg flex items-center"
                  style={{ backgroundColor: `${item.color}15` }}
                >
                  <div
                    className="w-3 h-12 rounded mr-3"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <div>
                    <p className="text-sm text-gray-600">{item.name}</p>
                    <p
                      className="text-2xl font-bold"
                      style={{ color: item.color }}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Total Learning Activities</p>
              <p className="text-2xl font-bold text-gray-800">
                {activityData.reduce((sum, item) => sum + item.value, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 mb-6">
          {/* Course Structure */}
          <div className="bg-white rounded-lg shadow-md p-5 hover:shadow-xl transition-shadow">
            <div className="flex items-center mb-4">
              <Layers className="mr-3 text-indigo-500" size={24} />
              <h2 className="text-xl font-semibold">Course Structure</h2>
            </div>
            <div className="flex">
              <div className="w-2/3">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={courseStructureData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366F1" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="w-1/3 flex flex-col justify-center">
                <div className="bg-indigo-50 p-4 rounded-lg text-center mb-4">
                  <p className="text-sm text-gray-600">Lessons per Chapter</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {(lessons.length / (chapters.length || 1)).toFixed(1)}
                  </p>
                </div>
                <div className="bg-indigo-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Chapters per Course</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {(chapters.length / (courses.length || 1)).toFixed(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main className="mt-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
