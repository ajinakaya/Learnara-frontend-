import axios from "axios";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  Globe,
  PlayCircle,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useLanguage } from "../context/languagecontext";

// Import activity components
import AudioActivity from "../Activitytype/audio";
import FlashcardActivity from "../Activitytype/flashcard";
import QuizActivity from "../Activitytype/quiz";

const ProgressBar = ({ value = 0 }) => {
  const clampedValue = Math.min(Math.max(value, 0), 100);
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-blue-500 transition-all duration-300"
        style={{ width: `${clampedValue}%` }}
      />
    </div>
  );
};

const LearnPage = () => {
  const [activeTab, setActiveTab] = useState("audio");
  const [selectedActivity, setSelectedActivity] = useState(null);
  const { selectedLanguage: globalLanguage, userLanguages } = useLanguage();
  const [selectedLanguage, setSelectedLanguage] = useState(globalLanguage);

  const [activities, setActivities] = useState({
    audio: [],
    flashcards: [],
    quiz: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchActivities = async () => {
      if (!selectedLanguage) {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [audioRes, flashcardRes, quizRes] = await Promise.all([
          axios.get(
            `http://localhost:3001/audio/audio?language=${selectedLanguage._id}`
          ),
          axios.get(
            `http://localhost:3001/flashcard/flashcard?language=${selectedLanguage._id}`
          ),
          axios.get(
            `http://localhost:3001/quiz/quiz?language=${selectedLanguage._id}`
          ),
        ]);

        setActivities({
          audio: audioRes.data,
          flashcards: flashcardRes.data,
          quiz: quizRes.data,
        });
      } catch (err) {
        setError("Failed to load activities: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
    setSelectedActivity(null);
  }, [selectedLanguage]);

  // Reset selected activity when changing tabs
  useEffect(() => {
    setSelectedActivity(null);
  }, [activeTab]);

  const renderActivityCard = (activity) => (
    <div
      key={activity._id}
      className="bg-white rounded-lg shadow-md mb-4 overflow-hidden hover:shadow-lg transition cursor-pointer"
      onClick={() => setSelectedActivity(activity)}
    >
      <div className="p-4">
        <h3 className="text-lg font-semibold">{activity.title}</h3>
        <p className="text-sm text-gray-500 capitalize">
          Difficulty: {activity.difficulty}
        </p>
        <p className="text-gray-600 mb-4">{activity.description}</p>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
          Start Activity
        </button>
      </div>
    </div>
  );

  const renderActivityDetail = () => {
    if (!selectedActivity) return null;

    switch (activeTab) {
      case "audio":
        return <AudioActivity activity={selectedActivity} />;
      case "flashcards":
        return <FlashcardActivity activity={selectedActivity} />;
      case "quiz":
        return <QuizActivity activity={selectedActivity} />;
      default:
        return null;
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-500">{error}</div>;
  }

  // Show message if no languages are selected
  if (userLanguages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <Navbar />
        <div className="max-w-4xl mx-auto py-20 px-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">
            No Languages Selected
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Please select at least one language to start learning.
          </p>
          <button
            onClick={() => (window.location.href = "/languagepage")}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar />
      <div className="max-w-4xl mx-auto py-10 px-6 space-y-6">
        {/* Page Title with Language Selection */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Learn with Interactive Activities
            </h1>
            <p className="text-lg text-gray-500 mt-2">
              Choose an activity to enhance your learning experience!
            </p>
          </div>

          {/* Language Selection dropdown with only user's languages */}
          {userLanguages.length > 0 && (
            <div className="mt-4 md:mt-0">
              <div className="flex items-center gap-2 bg-white px-4 py-2 border rounded-lg shadow-sm">
                <Globe size={18} className="text-blue-500" />
                <select
                  value={selectedLanguage?._id || ""}
                  onChange={(e) => {
                    const lang = userLanguages.find(
                      (l) => l._id === e.target.value
                    );
                    if (lang) setSelectedLanguage(lang);
                  }}
                  className="bg-transparent text-gray-700 focus:outline-none"
                >
                  {userLanguages.map((lang) => (
                    <option key={lang._id} value={lang._id}>
                      {lang.languageName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Activity Tabs */}
        <div className="flex justify-center gap-4 mt-6">
          {["audio", "flashcards", "quiz"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-lg font-medium transition ${
                activeTab === tab
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Show either activity list or selected activity detail */}
        {selectedActivity ? (
          <div className="mt-6">
            <button
              onClick={() => setSelectedActivity(null)}
              className="mb-4 flex items-center text-blue-500 hover:text-blue-700 transition"
            >
              <ArrowLeft size={18} className="mr-1" />
              Back to Activities
            </button>

            {renderActivityDetail()}
          </div>
        ) : (
          <div className="mt-6">
            <div className="flex items-center mb-4">
              {activeTab === "audio" && (
                <PlayCircle size={20} className="text-blue-500 mr-2" />
              )}
              {activeTab === "flashcards" && (
                <BookOpen size={20} className="text-blue-500 mr-2" />
              )}
              {activeTab === "quiz" && (
                <CheckCircle size={20} className="text-blue-500 mr-2" />
              )}
              <h2 className="text-2xl font-semibold text-gray-800">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
            </div>

            <p className="text-gray-600 mb-6">
              {activeTab === "audio" &&
                "Listen to audio lessons to improve your language skills. Perfect for pronunciation and comprehension."}
              {activeTab === "flashcards" &&
                "Review flashcards to reinforce vocabulary and essential phrases. Includes hints and examples."}
              {activeTab === "quiz" &&
                "Test your knowledge with interactive quiz questions. Track your progress and learn from detailed explanations."}
            </p>

            {activities[activeTab].length > 0 ? (
              <div className="space-y-4">
                {activities[activeTab].map((activity) =>
                  renderActivityCard(activity)
                )}
              </div>
            ) : (
              <div className="text-center py-10 bg-white rounded-lg shadow-sm">
                <p className="text-gray-500">
                  No {activeTab} activities available for{" "}
                  {selectedLanguage?.languageName || "this language"}.
                </p>
                <p className="text-gray-400 mt-2">
                  Check back later for new content!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnPage;
