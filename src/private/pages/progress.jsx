import axios from "axios";
import {
  AlertCircle, BookmarkCheck, BookOpen, Calendar, CheckCircle, ChevronRight, Clock, FileText, Headphones, Plus, Settings, Trophy,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import Navbar from "../components/navbar";
import { useAuth } from "../context/authcontext";

const ProgressTracker = () => {
  const { authToken } = useAuth();
  const [dailyStudyData, setDailyStudyData] = useState([]);
  const [weeklyConsistency, setWeeklyConsistency] = useState({});
  const [streakDays, setStreakDays] = useState(0);
  const [userProgress, setUserProgress] = useState({
    completionPercentage: 0,
    totalStudyTime: 0,
    streakDays: 0,
    recentActivities: [],
  });

  const [activityStats, setActivityStats] = useState({
    completed: {
      AudioActivity: 0,
      QuizActivity: 0,
      FlashcardActivity: 0,
    },
    inProgress: {
      AudioActivity: 0,
      QuizActivity: 0,
      FlashcardActivity: 0,
    },
    notStarted: {
      AudioActivity: 0,
      QuizActivity: 0,
      FlashcardActivity: 0,
    },
  });

  const [dailyGoals, setDailyGoals] = useState([]);
  const [selectedDailyGoal, setSelectedDailyGoal] = useState(null);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    days: [],
    duration: 30,
    time: "09:00",
  });

  // Auto-generate streak and active days data when user logs in
  const generateUserActivityData = () => {
    // Generate weekly consistency data
    const today = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const newWeeklyConsistency = {};
    const activeCount = Math.floor(Math.random() * 1) + 1; 
    const activeDayIndices = new Set();
    
    // Always mark today as active
    const todayIndex = today.getDay();
    activeDayIndices.add(todayIndex);
    
    // Add random active days until we reach the desired count
    while (activeDayIndices.size < activeCount) {
      const randomDay = Math.floor(Math.random() * 7);
      activeDayIndices.add(randomDay);
    }
    
    // Set active days in the weekly consistency object
    dayNames.forEach((day, index) => {
      newWeeklyConsistency[day] = activeDayIndices.has(index);
    });
    
    // Add last reset date
    newWeeklyConsistency.lastResetDate = today.toISOString().split('T')[0];
    
    // Generate streak data (between 1-14 days)
    const newStreakDays = Math.floor(Math.random() * 14) + 1;
    
    // Generate daily study data for the past 7 days
    const newDailyStudyData = [];
    for (let i = 3; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayOfWeek = dayNames[date.getDay()];
      const dateString = date.toISOString().split('T')[0];
      
      // Check if this day should have activity data
      const isActive = activeDayIndices.has(date.getDay());
      
      if (isActive) {
        // Generate random study time between 15-60 minutes
        const timeSpent = Math.floor(Math.random() * 70) + 1;
        
       
        const activitiesCompleted = Math.floor(Math.random() * 4) + 1;
        
        // Randomize activity types
        const activityTypes = {
          AudioActivity: Math.floor(Math.random() * 3),
          QuizActivity: Math.floor(Math.random() * 3),
          FlashcardActivity: Math.floor(Math.random() * 3),
        };
        
        newDailyStudyData.push({
          date: dateString,
          dayOfWeek,
          timeSpent,
          activitiesCompleted,
          activityTypes,
        });
      } else {
        // No activity for this day
        newDailyStudyData.push({
          date: dateString,
          dayOfWeek,
          timeSpent: 0,
          activitiesCompleted: 0,
          activityTypes: {
            AudioActivity: 0,
            QuizActivity: 0,
            FlashcardActivity: 0,
          },
        });
      }
    }
    
    // Save the generated data to localStorage
    localStorage.setItem("weeklyConsistency", JSON.stringify(newWeeklyConsistency));
    localStorage.setItem("dailyStudyData", JSON.stringify(newDailyStudyData));
    localStorage.setItem("streakData", JSON.stringify({ currentStreak: newStreakDays, lastActiveDate: today.toISOString().split('T')[0] }));
    
    // Update state with the new data
    setWeeklyConsistency(newWeeklyConsistency);
    setDailyStudyData(processDataForChart(newDailyStudyData));
    setStreakDays(newStreakDays);
    
    // Update user progress
    const totalTime = newDailyStudyData.reduce((total, day) => total + day.timeSpent, 0);
    setUserProgress(prev => ({
      ...prev,
      totalStudyTime: totalTime,
      streakDays: newStreakDays,
      weeklyProgress: newWeeklyConsistency,
    }));
    
    // Generate activity counts based on the daily data
    generateActivityCounts(newDailyStudyData);
  };
  
  // Generate activity counts and save to localStorage
  const generateActivityCounts = (dailyData) => {
    // Calculate total activities for each type
    const activityCounts = {
      AudioActivity: { completed: 0, inProgress: 0 },
      QuizActivity: { completed: 0, inProgress: 0 },
      FlashcardActivity: { completed: 0, inProgress: 0 },
    };
    
    // Count completed activities from daily data
    dailyData.forEach(day => {
      if (day.activityTypes) {
        Object.entries(day.activityTypes).forEach(([type, count]) => {
          activityCounts[type].completed += count;
        });
      }
    });
    
    // Add some in-progress activities
    Object.keys(activityCounts).forEach(type => {
      activityCounts[type].inProgress = Math.floor(Math.random() * 3) + 1;
    });
    
    // Save to localStorage
    localStorage.setItem("activityCounts", JSON.stringify(activityCounts));
    
    // Update activity stats
    const updatedActivityStats = {
      completed: {
        AudioActivity: activityCounts.AudioActivity.completed,
        QuizActivity: activityCounts.QuizActivity.completed,
        FlashcardActivity: activityCounts.FlashcardActivity.completed,
      },
      inProgress: {
        AudioActivity: activityCounts.AudioActivity.inProgress,
        QuizActivity: activityCounts.QuizActivity.inProgress,
        FlashcardActivity: activityCounts.FlashcardActivity.inProgress,
      },
      notStarted: {}, // Will be calculated in calculateActivityStats
    };
    
    setActivityStats(updatedActivityStats);
  };

  // Load data from localStorage on component mount or generate if not present
  useEffect(() => {
    const hasExistingData = localStorage.getItem("dailyStudyData") && 
                            localStorage.getItem("weeklyConsistency") && 
                            localStorage.getItem("streakData");
    
    if (!hasExistingData || authToken) {
      // Generate new data since either there's no existing data or user just logged in
      generateUserActivityData();
    } else {
      // Load existing data from localStorage
      // Load daily study data
      const storedDailyData = localStorage.getItem("dailyStudyData");
      if (storedDailyData) {
        const parsedData = JSON.parse(storedDailyData);

        // Format data for the chart (last 7 days)
        const chartData = processDataForChart(parsedData);
        setDailyStudyData(chartData);

        // Calculate total study time
        const totalTime = parsedData.reduce(
          (total, day) => total + day.timeSpent,
          0
        );

        // Update user progress with study time
        setUserProgress((prev) => ({
          ...prev,
          totalStudyTime: totalTime,
        }));
      }

      // Load weekly consistency
      const storedWeeklyData = localStorage.getItem("weeklyConsistency");
      if (storedWeeklyData) {
        const parsedWeeklyData = JSON.parse(storedWeeklyData);
        setWeeklyConsistency(parsedWeeklyData);

        // Update user progress with active days
        setUserProgress((prev) => ({
          ...prev,
          weeklyProgress: parsedWeeklyData,
        }));
      }

      // Load streak data
      const storedStreakData = localStorage.getItem("streakData");
      if (storedStreakData) {
        const { currentStreak } = JSON.parse(storedStreakData);
        setStreakDays(currentStreak);

        // Update user progress with streak
        setUserProgress((prev) => ({
          ...prev,
          streakDays: currentStreak,
        }));
      }
    }

    // Fetch learning goals from API
    fetchLearningGoals();

    // Calculate completion percentage from all localStorage lesson progress
    calculateCompletionPercentage();

    // Get recent activities
    getRecentActivities();
  }, [authToken]); 

  // Process daily data for chart display
  const processDataForChart = (rawData) => {
    // Sort by date, most recent first
    const sortedData = [...rawData].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Take last 7 days
    const recentData = sortedData.slice(0, 7).reverse();

    // Map to day abbreviations
    const dayAbbreviations = {
      Monday: "Mon",
      Tuesday: "Tue",
      Wednesday: "Wed",
      Thursday: "Thu",
      Friday: "Fri",
      Saturday: "Sat",
      Sunday: "Sun",
    };

    return recentData.map((item) => ({
      date: dayAbbreviations[item.dayOfWeek] || item.dayOfWeek.substr(0, 3),
      timeSpent: item.timeSpent,
      activitiesCompleted: item.activitiesCompleted,
    }));
  };

  // Fetch learning goals from API
  const fetchLearningGoals = async () => {
    if (!authToken) return;

    try {
      const response = await axios.get(
        "http://localhost:3001/learning-goal/get",
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data && response.data.goals) {
        setDailyGoals(response.data.goals);

        // Set first goal as selected if available
        if (response.data.goals.length > 0) {
          setSelectedDailyGoal(response.data.goals[0]);
        }
      }
    } catch (error) {
      console.error("Error fetching learning goals:", error);
    }
  };

  // Save new learning goal
  const saveNewGoal = async () => {
    if (!authToken || newGoal.days.length === 0) return;

    try {
      const response = await axios.post(
        "http://localhost:3001//learning-goal/goal",
        newGoal,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.data && response.data.goal) {
        // Add the new goal to the list and select it
        setDailyGoals([...dailyGoals, response.data.goal]);
        setSelectedDailyGoal(response.data.goal);
        setShowGoalForm(false);

        // Reset form
        setNewGoal({
          days: [],
          duration: 30,
          time: "09:00",
        });
      }
    } catch (error) {
      console.error("Error creating learning goal:", error);
    }
  };

  // Handle day selection for new goal
  const toggleDaySelection = (day) => {
    const updatedDays = [...newGoal.days];
    const index = updatedDays.indexOf(day);

    if (index === -1) {
      updatedDays.push(day);
    } else {
      updatedDays.splice(index, 1);
    }

    setNewGoal({
      ...newGoal,
      days: updatedDays,
    });
  };

  // Calculate overall completion percentage
  const calculateCompletionPercentage = () => {
    // Get all keys from localStorage that match lesson progress pattern
    const progressKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("lesson_progress_")
    );

    let totalActivities = 0;
    let completedActivities = 0;

    // Loop through all progress keys and count activities
    progressKeys.forEach((key) => {
      try {
        const progressData = JSON.parse(localStorage.getItem(key));
        if (progressData && progressData.completed) {
          completedActivities += progressData.completed.length;

          totalActivities += progressData.completed.length * 1.5;
        }
      } catch (e) {
        console.error("Error parsing progress data:", e);
      }
    });

    // Calculate percentage with a minimum of 5% for visibility
    const percentage =
      totalActivities > 0
        ? Math.round((completedActivities / totalActivities) * 100)
        : 5; // Default to 5% if no data

    // Update user progress
    setUserProgress((prev) => ({
      ...prev,
      completionPercentage: percentage,
    }));

    // Calculate activity type stats
    calculateActivityStats(progressKeys);
  };

  // Calculate stats for each activity type
  const calculateActivityStats = (progressKeys) => {
    // Initialize totals
    let completed = {
      AudioActivity: 0,
      QuizActivity: 0,
      FlashcardActivity: 0,
    };

    let inProgress = {
      AudioActivity: 0,
      QuizActivity: 0,
      FlashcardActivity: 0,
    };

    // Get activity counts from localStorage
    const activityCounts = localStorage.getItem("activityCounts");
    if (activityCounts) {
      try {
        const parsedCounts = JSON.parse(activityCounts);

        // Extract completed counts
        Object.keys(completed).forEach((type) => {
          completed[type] = parsedCounts[type]?.completed || 0;
          inProgress[type] = parsedCounts[type]?.inProgress || 0;
        });
      } catch (e) {
        console.error("Error parsing activity counts:", e);
      }
    }

    // Estimate not started based on completion percentage
    const notStarted = {};
    const completionRate = userProgress.completionPercentage / 100;

    Object.keys(completed).forEach((type) => {
      const totalEstimate = Math.ceil(completed[type] / completionRate);
      notStarted[type] = Math.max(
        0,
        totalEstimate - completed[type] - inProgress[type]
      );
    });

    // Update activity stats
    setActivityStats({
      completed,
      inProgress,
      notStarted,
    });
  };

  // Get recent activities from localStorage
  const getRecentActivities = () => {
    const dailyData = JSON.parse(
      localStorage.getItem("dailyStudyData") || "[]"
    );

    // Sort by date, most recent first
    const sortedData = [...dailyData].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );

    // Create recent activities list
    const recentActivities = [];

    // Use the first 3 days with activity data
    for (let i = 0; i < Math.min(3, sortedData.length); i++) {
      const day = sortedData[i];

      // For each activity type that day
      if (day.activityTypes) {
        Object.entries(day.activityTypes).forEach(([type, count]) => {
          if (count > 0) {
            recentActivities.push({
              title: `${type.replace("Activity", "")} Activity`,
              activityType: type,
              completedAt: `${day.date}T12:00:00Z`, // Approximate time
              progress: 100,
              score:
                type === "QuizActivity"
                  ? Math.floor(70 + Math.random() * 30)
                  : null,
            });
          }
        });
      }
    }

    // Limit to 3 activities
    const limitedActivities = recentActivities.slice(0, 3);

    // Update user progress
    setUserProgress((prev) => ({
      ...prev,
      recentActivities: limitedActivities,
    }));
  };

  // Calculate total activity counts
  const getTotalActivityCounts = () => {
    const result = {};
    for (const type in activityStats.completed) {
      result[type] =
        activityStats.completed[type] +
        activityStats.inProgress[type] +
        activityStats.notStarted[type];
    }
    return result;
  };

  const totalActivityCounts = getTotalActivityCounts();

  // Format minutes to hours and minutes
  const formatStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Get icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "AudioActivity":
        return <Headphones size={16} className="text-green-600" />;
      case "QuizActivity":
        return <FileText size={16} className="text-purple-600" />;
      case "FlashcardActivity":
        return <BookmarkCheck size={16} className="text-orange-500" />;
      default:
        return <BookOpen size={16} className="text-gray-600" />;
    }
  };

  // Get activity color
  const getActivityColor = (type) => {
    switch (type) {
      case "AudioActivity":
        return "green";
      case "QuizActivity":
        return "purple";
      case "FlashcardActivity":
        return "orange";
      default:
        return "gray";
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Calculate aggregate data
  const totalActivitiesCompleted = Object.values(
    activityStats.completed
  ).reduce((sum, val) => sum + val, 0);
  const totalActivities = Object.values(totalActivityCounts).reduce(
    (sum, val) => sum + val,
    0
  );

  // Get active days count
  const activeDaysCount = Object.keys(weeklyConsistency).filter(
    (key) => key !== "lastResetDate" && weeklyConsistency[key]
  ).length;

  // Check if today is a goal day
  const isTodayGoalDay = () => {
    if (!selectedDailyGoal) return false;

    const today = new Date();
    const dayAbbr = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][
      today.getDay()
    ];

    return selectedDailyGoal.days.includes(dayAbbr);
  };

  // Calculate progress toward daily goal
  const getDailyGoalProgress = () => {
    if (!selectedDailyGoal) return 0;

    // Find today's study time
    const today = new Date().toISOString().split("T")[0];
    const todayData = dailyStudyData.find((d) => d.date === today);

    if (!todayData) return 0;

    return Math.min(
      100,
      (todayData.timeSpent / selectedDailyGoal.duration) * 100
    );
  };

  // Progress for today's goal
  const todayGoalProgress = isTodayGoalDay() ? getDailyGoalProgress() : null;

  // Get days for display
  const getDayName = (dayAbbr) => {
    const days = {
      Sun: "Sunday",
      Mon: "Monday",
      Tue: "Tuesday",
      Wed: "Wednesday",
      Thu: "Thursday",
      Fri: "Friday",
      Sat: "Saturday",
    };

    return days[dayAbbr] || dayAbbr;
  };

  // Format time for display
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;

    return `${hour12}:${minutes} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar />
      <div className="p-6 max-w-6xl mx-auto bg-gray-50 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Learning Progress
          </h1>
          <div className="bg-indigo-100 text-indigo-800 font-medium px-3 py-1 rounded-full text-sm"></div>
        </div>

        {/* Main Progress Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center">
            <div className="mb-3 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <span className="text-3xl font-bold text-indigo-600">
                    {userProgress.completionPercentage}%
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Complete</span>
                </div>
              </div>
              <svg className="h-32 w-32" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#EEF2FF"
                  strokeWidth="12"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="#4F46E5"
                  strokeWidth="12"
                  strokeDasharray={`${
                    userProgress.completionPercentage * 2.51
                  } 251`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-gray-600 text-sm">Course Completion</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-2">
              <Clock className="text-indigo-500 mr-2" size={20} />
              <h3 className="font-semibold text-gray-700">Study Time</h3>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold text-indigo-600">
                {formatStudyTime(userProgress.totalStudyTime)}
              </p>
              <p className="text-sm text-gray-500 mt-1">Total study time</p>
            </div>
            <div className="mt-4 bg-gray-100 h-2 rounded-full">
              <div
                className="bg-indigo-500 h-2 rounded-full"
                style={{
                  width: `${Math.min(100, (userProgress.totalStudyTime / (selectedDailyGoal?.duration || 30)) * 100)}%`,
                }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Daily goal:{" "}
              {selectedDailyGoal
                ? `${selectedDailyGoal.duration} minutes`
                : "30 minutes"}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className="flex items-center mb-2">
              <Calendar className="text-indigo-500 mr-2" size={20} />
              <h3 className="font-semibold text-gray-700">Consistency</h3>
            </div>
            <div className="mt-3">
              <p className="text-3xl font-bold text-indigo-600">
                {activeDaysCount}/7
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Active days this week
              </p>
            </div>
            <div className="mt-4 flex justify-between">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                (day, index) => {
                  const isScheduled = selectedDailyGoal?.days.includes(day);
                  const isActive =
                    weeklyConsistency[
                      [
                        "Sunday",
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                        "Saturday",
                      ][index]
                    ];

                  return (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isActive
                          ? "bg-indigo-500 text-white"
                          : isScheduled
                          ? "bg-indigo-100 text-indigo-500 border border-indigo-300"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {day.charAt(0)}
                    </div>
                  );
                }
              )}
            </div>
          </div>
        </div>

        {/* Learning Goals Section */}
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700">Learning Goals</h3>
            <button
              onClick={() => setShowGoalForm(!showGoalForm)}
              className="flex items-center text-indigo-600 text-sm hover:text-indigo-800"
            >
              {showGoalForm ? (
                <span>Cancel</span>
              ) : (
                <>
                  <Plus size={16} className="mr-1" />
                  <span>Set New Goal</span>
                </>
              )}
            </button>
          </div>

          {showGoalForm ? (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <h4 className="font-medium text-gray-700 mb-3">
                Create New Learning Goal
              </h4>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Study Days
                </label>
                <div className="flex space-x-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <button
                        key={day}
                        onClick={() => toggleDaySelection(day)}
                        className={`w-10 h-10 rounded-full ${
                          newGoal.days.includes(day)
                            ? "bg-indigo-500 text-white"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {day.charAt(0)}
                      </button>
                    )
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Study Duration (minutes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newGoal.duration}
                    onChange={(e) =>
                      setNewGoal({
                        ...newGoal,
                        duration: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Preferred Study Time
                  </label>
                  <input
                    type="time"
                    value={newGoal.time}
                    onChange={(e) =>
                      setNewGoal({ ...newGoal, time: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <button
                onClick={saveNewGoal}
                disabled={newGoal.days.length === 0}
                className={`w-full py-2 px-4 rounded-md font-medium ${
                  newGoal.days.length === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-indigo-600 text-white hover:bg-indigo-700"
                }`}
              >
                Save Goal
              </button>
            </div>
          ) : (
            <>
              {dailyGoals.length > 0 ? (
                <div className="space-y-4">
                  {dailyGoals.map((goal, index) => (
                    <div
                      key={index}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedDailyGoal?._id === goal._id
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
                      }`}
                      onClick={() => setSelectedDailyGoal(goal)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">
                            {goal.duration} minutes per day
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {goal.days.map((day) => day.charAt(0)).join(", ")}{" "}
                            at {formatTime(goal.time)}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {goal.days.map((day) => (
                              <span
                                key={day}
                                className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded"
                              >
                                {getDayName(day)}
                              </span>
                            ))}
                          </div>
                        </div>

                        {isTodayGoalDay() &&
                          selectedDailyGoal?._id === goal._id && (
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-medium text-indigo-700">
                                Today's Goal
                              </span>
                              <div className="mt-1 w-16 h-16 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <span className="text-sm font-bold">
                                    {Math.round(todayGoalProgress || 0)}%
                                  </span>
                                </div>
                                <svg
                                  className="h-16 w-16"
                                  viewBox="0 0 100 100"
                                >
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#EEF2FF"
                                    strokeWidth="12"
                                  />
                                  <circle
                                    cx="50"
                                    cy="50"
                                    r="40"
                                    fill="none"
                                    stroke="#4F46E5"
                                    strokeWidth="12"
                                    strokeDasharray={`${
                                      (todayGoalProgress || 0) * 2.51
                                    } 251`}
                                    strokeLinecap="round"
                                    transform="rotate(-90 50 50)"
                                  />
                                </svg>
                              </div>
                            </div>
                          )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Calendar className="text-gray-400 mb-3" size={40} />
                  <p className="text-gray-600 mb-2">
                    No learning goals set yet
                  </p>
                  <p className="text-gray-500 text-sm mb-4">
                    Set a goal to track your progress and build consistency
                  </p>
                  <button
                    onClick={() => setShowGoalForm(true)}
                    className="bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700"
                  >
                    Create Your First Goal
                  </button>
                </div>
              )}
            </>
          )}
        </div>

      

        {/* Activity Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 col-span-1 md:col-span-2">
            <h3 className="font-semibold text-gray-700 mb-4">
              Activity Progress
            </h3>
            <div className="space-y-4">
              {Object.keys(activityStats.completed).map((type) => {
                const completed = activityStats.completed[type];
                const inProgress = activityStats.inProgress[type];
                const notStarted = activityStats.notStarted[type];
                const total = totalActivityCounts[type];
                const completedPercentage =
                  total > 0 ? Math.round((completed / total) * 100) : 0;
                const inProgressPercentage =
                  total > 0 ? Math.round((inProgress / total) * 100) : 0;
                const color = getActivityColor(type);
                const activityName = type.replace("Activity", "");

                return (
                  <div key={type} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {getActivityIcon(type)}
                        <span className="ml-2 text-gray-700 font-medium">
                          {activityName}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {completed} of {total} completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden flex">
                      <div
                        className={`bg-${color}-600 h-full`}
                        style={{ width: `${completedPercentage}%` }}
                      ></div>
                      <div
                        className={`bg-${color}-300 h-full`}
                        style={{ width: `${inProgressPercentage}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{completedPercentage}% Complete</span>
                      <span>{inProgressPercentage}% In Progress</span>
                      <span>
                        {100 - completedPercentage - inProgressPercentage}% Not
                        Started
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
            <h3 className="font-semibold text-gray-700 mb-4">
              Recent Activity
            </h3>
            <div className="divide-y">
              {userProgress.recentActivities.length > 0 ? (
                userProgress.recentActivities.map((activity, index) => (
                  <div key={index} className="py-3">
                    <div className="flex items-start">
                      <div className="mt-0.5">
                        {activity.progress === 100 ? (
                          <CheckCircle size={16} className="text-green-500" />
                        ) : (
                          <AlertCircle size={16} className="text-amber-500" />
                        )}
                      </div>
                      <div className="ml-3 flex-1">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-800">
                            {activity.title}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDate(activity.completedAt)}
                          </p>
                        </div>
                        <div className="mt-1 flex items-center">
                          {getActivityIcon(activity.activityType)}
                          <span className="ml-1 text-xs text-gray-600">
                            {activity.score
                              ? `Score: ${activity.score}%`
                              : "Completed"}
                          </span>
                        </div>
                      </div>
                      <div className="ml-2">
                        <ChevronRight size={16} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center">
                  <p className="text-gray-500">No recent activities found</p>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t">
              <button className="w-full py-2 text-sm text-center text-indigo-600 hover:text-indigo-800 font-medium">
                View All Activities
              </button>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-700">Progress Settings</h3>
            <button className="flex items-center text-indigo-600 text-sm hover:text-indigo-800">
              <Settings size={16} className="mr-1" />
              <span>Configure</span>
            </button>
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Reminders</h4>
              <p className="text-sm text-gray-600 mb-3">
                Get notifications to stay on track
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">
                  {selectedDailyGoal ? "Enabled" : "No schedule set"}
                </span>
                <div
                  className={`w-10 h-5 ${
                    selectedDailyGoal ? "bg-indigo-500" : "bg-gray-300"
                  } rounded-full relative`}
                >
                  <div
                    className={`absolute w-4 h-4 bg-white rounded-full top-0.5 transition-all ${
                      selectedDailyGoal ? "right-0.5" : "left-0.5"
                    }`}
                  ></div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Weekly Report</h4>
              <p className="text-sm text-gray-600 mb-3">
                Summary of your weekly progress
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Every Sunday</span>
                <div className="w-10 h-5 bg-indigo-500 rounded-full relative">
                  <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 right-0.5"></div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 mb-2">Data Sharing</h4>
              <p className="text-sm text-gray-600 mb-3">
                Share progress with tutors
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Disabled</span>
                <div className="w-10 h-5 bg-gray-300 rounded-full relative">
                  <div className="absolute w-4 h-4 bg-white rounded-full top-0.5 left-0.5"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default ProgressTracker;
