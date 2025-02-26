import axios from "axios";
import {
  AlertCircle,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  Loader,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Navbar from "../components/navbar";
import { useAuth } from "../context/authcontext";

const LearningGoal = () => {
  const [goals, setGoals] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [expandedGoals, setExpandedGoals] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentGoal, setCurrentGoal] = useState(null);
  const { authToken } = useAuth();

  // Form state for add/edit goal
  const [formData, setFormData] = useState({
    goalId: "",
    days: [],
    duration: 30,
    time: "18:00",
  });

  const [availableGoals, setAvailableGoals] = useState([]);

  useEffect(() => {
    if (authToken) {
      fetchGoals();
    }
  }, [authToken]);

  const fetchGoals = async () => {
    if (!authToken) return;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get("/learning-goal/get", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setGoals(response.data);
    } catch (err) {
      console.error("Error fetching goals:", err);
      setError("Failed to load goals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch available goals for dropdown
  const fetchAvailableGoals = async () => {
    try {
      const response = await axios.get("/set-goal/goals", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAvailableGoals(response.data);
    } catch (err) {
      console.error("Error fetching available goals:", err);
    }
  };

  // Load data on component mount
  useEffect(() => {
    fetchAvailableGoals();
  }, []);

  // Toggle goal expansion
  const toggleExpand = (goalId) => {
    setExpandedGoals((prev) => ({
      ...prev,
      [goalId]: !prev[goalId],
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle day selection
  const handleDayToggle = (day) => {
    setFormData((prev) => {
      if (prev.days.includes(day)) {
        return { ...prev, days: prev.days.filter((d) => d !== day) };
      } else {
        return { ...prev, days: [...prev.days, day] };
      }
    });
  };

  // Add new learning goal
  const addGoal = async () => {
    if (!authToken) return;
    try {
      setLoading(true);
      const response = await axios.post("/learning-goal/goal", formData, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setGoals([...goals, response.data]);
      setIsAddModalOpen(false);
      setFormData({
        goalId: "",
        days: [],
        duration: 30,
        time: "18:00",
      });
    } catch (err) {
      console.error("Error adding goal:", err);
      setError("Failed to add goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Update existing goal
  const updateGoal = async (id) => {
    if (!authToken) return;
    console.log("Updating goal with ID:", id, "Type:", typeof id);

    if (!id || typeof id !== "string") {
      console.error("Invalid ID:", id);
      return setError("Invalid goal ID.");
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `/learning-goal/${id}`,
        {
          goalId: formData.goalId,
          frequency: formData.frequency,
          days: formData.days,
          duration: formData.duration,
          time: formData.time,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      setGoals(goals.map((goal) => (goal._id === id ? response.data : goal)));
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Error updating goal:", err);
      setError("Failed to update goal. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete a goal
  const deleteGoal = async (id) => {
    if (!authToken) return;

    if (window.confirm("Are you sure you want to delete this goal?")) {
      try {
        setLoading(true);

        await axios.delete(`/learning-goal/delete/${id}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        // Remove deleted goal from state
        setGoals(goals.filter((goal) => goal._id !== id));
      } catch (err) {
        console.error("Error deleting goal:", err);
        setError("Failed to delete goal. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  // Open edit modal and populate form
  const openEditModal = (goal) => {
    setCurrentGoal(goal);
    setFormData({
      goalId: goal.goalId._id,
      days: goal.days,
      duration: goal.duration,
      time: goal.time,
    });
    setIsEditModalOpen(true);
  };

  // Filter goals based on search term
  const filteredGoals = goals.filter((goal) =>
    goal.goalId.goal.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function for displaying days
  const daysDisplay = (days) => {
    if (days.length === 7) return "Everyday";
    if (days.length === 5 && !days.includes("Sat") && !days.includes("Sun"))
      return "Weekdays";
    if (days.length === 2 && days.includes("Sat") && days.includes("Sun"))
      return "Weekends";
    return days.join(", ");
  };

  const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const GoalForm = ({ isEdit = false, onSubmit }) => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Learning Goal
        </label>
        <select
          name="goalId"
          value={formData.goalId}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="">Select a goal</option>
          {availableGoals.map((goal) => (
            <option key={goal._id} value={goal._id}>
              {goal.goal}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Practice Days
        </label>
        <div className="flex flex-wrap gap-2">
          {weekdays.map((day) => (
            <button
              key={day}
              type="button"
              onClick={() => handleDayToggle(day)}
              className={`w-12 h-12 flex items-center justify-center rounded-full text-sm font-medium transition-colors ${
                formData.days.includes(day)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration}
            onChange={handleInputChange}
            min="1"
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time
          </label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
      </div>

      <div className="pt-4 flex justify-end space-x-4">
        <button
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          onClick={() =>
            isEdit ? setIsEditModalOpen(false) : setIsAddModalOpen(false)
          }
        >
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          onClick={onSubmit}
          disabled={!formData.goalId || formData.days.length === 0}
        >
          {isEdit ? "Update Goal" : "Save Goal"}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">
                My Learning Goals
              </h1>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Plus size={20} className="mr-2" />
                Add Goal
              </button>
            </div>

            <div className="mb-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search goals..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
                <AlertCircle size={24} className="mr-3 flex-shrink-0" />
                <div>{error}</div>
              </div>
            )}

            {/* Loading state */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader size={36} className="text-blue-600 animate-spin" />
              </div>
            )}

            {/* Empty state */}
            {!loading && filteredGoals.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  {searchTerm
                    ? "No goals match your search."
                    : "No learning goals found. Add your first goal!"}
                </p>
              </div>
            )}

            {/* Goals list */}
            {!loading && filteredGoals.length > 0 && (
              <div className="space-y-4">
                {filteredGoals.map((goal) => (
                  <div
                    key={goal._id}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div
                      className="bg-white p-4 flex justify-between items-center cursor-pointer"
                      onClick={() => toggleExpand(goal._id)}
                    >
                      <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                          {goal.goalId.goal}
                        </h2>
                        <div className="flex items-center mt-2 text-gray-600">
                          <CalendarDays size={18} className="mr-2" />
                          <span>{daysDisplay(goal.days)}</span>
                          <span className="mx-2">•</span>
                          <Clock size={18} className="mr-2" />
                          <span>
                            {goal.duration} min at {goal.time}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          className="text-gray-500 hover:text-blue-600 p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(goal);
                          }}
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          className="text-gray-500 hover:text-red-600 p-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteGoal(goal._id);
                          }}
                        >
                          <Trash2 size={20} />
                        </button>
                        {expandedGoals[goal._id] ? (
                          <ChevronUp size={24} className="text-gray-500 ml-2" />
                        ) : (
                          <ChevronDown
                            size={24}
                            className="text-gray-500 ml-2"
                          />
                        )}
                      </div>
                    </div>

                    {expandedGoals[goal._id] && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50">
                        <h3 className="font-medium text-gray-700 mb-2">
                          Proficiency Levels:
                        </h3>
                        <div className="space-y-3">
                          {goal.goalId.levels.map((level) => (
                            <div key={level.level} className="flex">
                              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 text-xs font-medium mr-3">
                                {level.level}
                              </span>
                              <span className="text-gray-600">
                                {level.description}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <h3 className="font-medium text-gray-700 mb-2">
                            Schedule:
                          </h3>
                          <div className="flex space-x-2 mb-3">
                            {weekdays.map((day) => (
                              <div
                                key={day}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium ${
                                  goal.days.includes(day)
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-gray-100 text-gray-400"
                                }`}
                              >
                                {day.charAt(0)}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Goal Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Add New Learning Goal
                </h2>
              </div>
              <div className="p-6">
                <GoalForm onSubmit={addGoal} />
              </div>
            </div>
          </div>
        )}

        {/* Edit Goal Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-800">
                  Edit Learning Goal
                </h2>
              </div>
              <div className="p-6">
                <GoalForm isEdit={true} onSubmit={updateGoal} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearningGoal;
