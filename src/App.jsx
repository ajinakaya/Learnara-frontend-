import axios from "axios";
import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import AudioUpload from "./Admin/activitytype/audio";
import Flashcard from "./Admin/activitytype/flashcard";
import Quiz from "./Admin/activitytype/quiz";
import VideoActivity from "./Admin/activitytype/video";
import ChapterPage from "./Admin/chapter";
import Course from "./Admin/course";
import AdminDashboard from "./Admin/dashbaord";
import Goal from "./Admin/goal";
import LanguagesPage from "./Admin/language";
import SubLessonPage from "./Admin/sublesson";
import UserManagement from "./Admin/user";
import Navbar from "./private/components/navbar";
import LanguageSelector from "./private/langauge/selected language";
import ChaptersPage from "./private/pages/chapter";
import CoursePage from "./private/pages/coursepage";
import LearningGoals from "./private/pages/goal";
import LearnPage from "./private/pages/learn";
import LessonPage from "./private/pages/lesson";
import UserProfile from "./private/pages/profile";
import ProgressTracker from "./private/pages/progress";
import LoginPage from "./public/Auth/login";
import SignUpPage from "./public/Auth/register";
import HomePage from "./public/HomePage";

axios.defaults.baseURL = "http://localhost:3001";
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={2000} // 2 seconds
      />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<SignUpPage />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/coursepage" element={<CoursePage />} />
        <Route path="/languagepage" element={<LanguageSelector />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/Languages" element={<LanguagesPage />} />
        <Route path="/admin/courses" element={<Course />} />
        <Route path="/admin/chapter" element={<ChapterPage />} />
        <Route path="/admin/Lesson" element={<SubLessonPage />} />
        <Route path="/admin/activities/audio" element={<AudioUpload />} />
        <Route path="/admin/activities/flashcard" element={<Flashcard />} />
        <Route path="/admin/activities/quiz" element={<Quiz />} />
        <Route path="/admin/activities/video" element={<VideoActivity />} />
        <Route path="/admin/user" element={<UserManagement />} />
        <Route path="/admin/goals" element={<Goal />} />
        <Route path="/navbar" element={<Navbar />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/course/:id/chapters" element={<ChaptersPage />} />
        <Route path="/learn" element={<LearnPage />} />
        <Route path="/progress" element={<ProgressTracker />} />
        <Route path="/goals" element={<LearningGoals />} />
        <Route path="/sublesson/:id" element={<LessonPage />} />
      </Routes>
    </>
  );
};

export default App;
