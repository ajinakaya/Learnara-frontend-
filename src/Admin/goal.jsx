import React, { useState, useEffect } from "react";
import {
  Target,Plus,Trash2,Edit2,AlertCircle,
} from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import Sidebar from "./sidebar";

const Goal = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    goal: "",
    levels: [
      {
        level: "A1",
        description: "",
      },
    ],
  });

  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch all goals
  const fetchGoals = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/set-goal/goals");
      setGoals(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch goals");
      console.error("Error fetching goals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLevelChange = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      levels: prev.levels.map((level, i) =>
        i === index ? { ...level, [field]: value } : level
      ),
    }));
  };

  const addLevel = () => {
    setFormData((prev) => ({
      ...prev,
      levels: [...prev.levels, { level: "A1", description: "" }],
    }));
  };

  const removeLevel = (index) => {
    setFormData((prev) => ({
      ...prev,
      levels: prev.levels.filter((_, i) => i !== index),
    }));
  };

  // Create new goal
  const createGoal = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/set-goal/goals", formData);
      setGoals((prev) => [...prev, response.data]);
      resetForm();
      setError(null);
    } catch (err) {
      setError("Failed to create goal");
      console.error("Error creating goal:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update goal
  const updateGoal = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `/set-goal/goals/${editingId}`,
        formData
      );
      setGoals((prev) =>
        prev.map((goal) => (goal._id === editingId ? response.data : goal))
      );
      resetForm();
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError("Failed to update goal");
      console.error("Error updating goal:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete goal
  const deleteGoal = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/set-goal/goals/${id}`);
      setGoals((prev) => prev.filter((goal) => goal._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete goal");
      console.error("Error deleting goal:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit goal
  const editGoal = (goal) => {
    setEditingId(goal._id);
    setFormData({
      goal: goal.goal,
      levels: goal.levels,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      goal: "",
      levels: [
        {
          level: "A1",
          description: "",
        },
      ],
    });
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-2"></div>
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                Goal Management
              </h1>
              <p className="mt-2 text-gray-600">
                Create and manage learning goals and levels
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  {editingId ? "Edit Goal" : "Create New Goal"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={editingId ? updateGoal : createGoal}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Goal
                      </label>
                      <input
                        type="text"
                        name="goal"
                        value={formData.goal}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter goal title"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                          Levels
                        </label>
                        <button
                          type="button"
                          onClick={addLevel}
                          className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          Add Level
                        </button>
                      </div>

                      {formData.levels.map((level, index) => (
                        <div
                          key={index}
                          className="space-y-4 p-4 border border-gray-200 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <select
                              value={level.level}
                              onChange={(e) =>
                                handleLevelChange(
                                  index,
                                  "level",
                                  e.target.value
                                )
                              }
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="A1">A1</option>
                              <option value="A2">A2</option>
                              <option value="B1">B1</option>
                              <option value="B2">B2</option>
                            </select>
                            {formData.levels.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeLevel(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <textarea
                            value={level.description}
                            onChange={(e) =>
                              handleLevelChange(
                                index,
                                "description",
                                e.target.value
                              )
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Level description"
                            rows="3"
                            required
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading
                        ? "Processing..."
                        : editingId
                        ? "Update Goal"
                        : "Create Goal"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Goals
              </h2>
              {loading && !editingId ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading goals...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {goals.map((goal) => (
                    <Card key={goal._id} className="hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">{goal.goal}</span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editGoal(goal)}
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteGoal(goal._id)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {goal.levels.map((level, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">
                                  Level {level.level}
                                </span>
                              </div>
                              <p className="text-gray-600">
                                {level.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {goals.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No goals created yet. Create your first goal above!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Goal;
