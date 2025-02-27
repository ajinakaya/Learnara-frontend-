import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AudioActivity,
  FlashcardActivity,
  QuizActivity,
} from "../Activitytype/activitycomponents";
import Navbar from "../components/navbar";
import { useAuth } from "../context/authcontext";

const LessonPage = () => {
  const { id } = useParams();
  const [sublesson, setSublesson] = useState(null);
  const { authToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [completedActivities, setCompletedActivities] = useState([]);

  useEffect(() => {
    const fetchSublesson = async () => {
      if (!authToken) return;
      try {
        const { data } = await axios.get(
          `http://localhost:3001/sublesson/lesson/${id}`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        setSublesson(data);

        // Initialize completed activities from localStorage if available
        const savedProgress = localStorage.getItem(`lesson_progress_${id}`);
        if (savedProgress) {
          const { completed, lastActivityIndex } = JSON.parse(savedProgress);
          setCompletedActivities(completed || []);
          setCurrentActivityIndex(lastActivityIndex || 0);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching sublesson:", err);
        setLoading(false);
      }
    };

    fetchSublesson();
  }, [id, authToken]);

  // Save progress whenever completed activities change
  useEffect(() => {
    if (sublesson && completedActivities.length > 0) {
      localStorage.setItem(
        `lesson_progress_${id}`,
        JSON.stringify({
          completed: completedActivities,
          lastActivityIndex: currentActivityIndex,
        })
      );
    }
  }, [completedActivities, currentActivityIndex, id, sublesson]);

  //   if (loading) {
  //     return (
  //       <div className="min-h-screen flex items-center justify-center bg-gray-50">
  //         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  //       </div>
  //     );
  //   }

  if (!sublesson) {
    return (
      <div className="min-h-screen bg-gray-50 font-poppins">
        <Navbar />
        <div className="max-w-5xl mx-auto py-10 px-6 text-center">
          <h1 className="text-2xl font-semibold text-red-600">
            Error loading lesson
          </h1>
          <p className="mt-2 text-gray-600">Please try again later</p>
        </div>
      </div>
    );
  }

  const markActivityComplete = () => {
    if (!completedActivities.includes(currentActivityIndex)) {
      setCompletedActivities([...completedActivities, currentActivityIndex]);
    }
  };

  const goToNextActivity = () => {
    if (currentActivityIndex < sublesson.activities.length - 1) {
      // Mark current activity as complete when moving to next
      markActivityComplete();
      setCurrentActivityIndex(currentActivityIndex + 1);
    }
  };

  const goToPrevActivity = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
    }
  };

  // Get current activity
  const currentActivity = sublesson.activities[currentActivityIndex];
  const isActivityCompleted =
    completedActivities.includes(currentActivityIndex);

  // Helper function to get appropriate activity icon
  const getActivityIcon = (type) => {
    switch (type) {
      case "AudioActivity":
      case "audio":
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            ></path>
          </svg>
        );
      case "QuizActivity":
      case "quiz":
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
        );
      case "FlashcardActivity":
      case "flashcard":
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            ></path>
          </svg>
        );
      default:
        return (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            ></path>
          </svg>
        );
    }
  };

  // Render appropriate activity component based on type
  const renderActivityComponent = () => {
    const activityType = currentActivity.activityType || currentActivity.type;

    switch (activityType) {
      case "AudioActivity":
      case "audio":
        return (
          <AudioActivity
            activity={currentActivity}
            onComplete={markActivityComplete}
          />
        );
      case "QuizActivity":
      case "quiz":
        return (
          <QuizActivity
            activity={currentActivity}
            onComplete={markActivityComplete}
          />
        );
      case "FlashcardActivity":
      case "flashcard":
        return (
          <FlashcardActivity
            activity={currentActivity}
            onComplete={markActivityComplete}
          />
        );
      default:
        return (
          <div className="p-4 bg-yellow-100 rounded-lg">
            Unsupported activity type: {activityType}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar />
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        {/* Lesson Header with Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-gray-800">
              {sublesson.title}
            </h1>
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              {currentActivityIndex + 1} / {sublesson.activities.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
            <div
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{
                width: `${
                  ((currentActivityIndex + 1) / sublesson.activities.length) *
                  100
                }%`,
              }}
            ></div>
          </div>

          {/* Activity Pills */}
          <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
            {sublesson.activities.map((activity, index) => (
              <button
                key={index}
                onClick={() => setCurrentActivityIndex(index)}
                className={`flex items-center px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                  index === currentActivityIndex
                    ? "bg-indigo-600 text-white"
                    : completedActivities.includes(index)
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {index + 1}.{" "}
                {activity.title.length > 15
                  ? activity.title.substring(0, 15) + "..."
                  : activity.title}
                {completedActivities.includes(index) && (
                  <svg
                    className="w-3 h-3 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 bg-indigo-500 rounded-full p-2">
                {getActivityIcon(
                  currentActivity.activityType || currentActivity.type
                )}
              </div>
              <h2 className="ml-3 text-xl font-semibold text-gray-800">
                {currentActivity.title}
              </h2>
              {isActivityCompleted && (
                <span className="ml-auto bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  Completed
                </span>
              )}
            </div>

            <p className="text-gray-600 mb-6">{currentActivity.description}</p>

            {/* Render Activity Component based on the type */}
            <div className="bg-gray-50 p-4 rounded-lg">
              {renderActivityComponent()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="bg-gray-50 px-6 py-4 flex justify-between">
            <button
              onClick={goToPrevActivity}
              disabled={currentActivityIndex === 0}
              className={`px-4 py-2 rounded-md flex items-center ${
                currentActivityIndex === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-indigo-600 hover:bg-indigo-50"
              }`}
            >
              <svg
                className="w-5 h-5 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 19l-7-7 7-7"
                ></path>
              </svg>
              Previous
            </button>

            {!isActivityCompleted && (
              <button
                onClick={markActivityComplete}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200"
              >
                Mark Complete
              </button>
            )}

            <button
              onClick={goToNextActivity}
              disabled={
                currentActivityIndex === sublesson.activities.length - 1
              }
              className={`px-4 py-2 rounded-md flex items-center ${
                currentActivityIndex === sublesson.activities.length - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              Next
              <svg
                className="w-5 h-5 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5l7 7-7 7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Lesson Summary/Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Your Progress
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {completedActivities.length}
              </p>
              <p className="text-sm text-gray-600">Activities Completed</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {Math.round(
                  (completedActivities.length / sublesson.activities.length) *
                    100
                )}
                %
              </p>
              <p className="text-sm text-gray-600">Lesson Progress</p>
            </div>
            <div className="bg-indigo-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-indigo-600">
                {sublesson.activities.length - completedActivities.length}
              </p>
              <p className="text-sm text-gray-600">Remaining Activities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
