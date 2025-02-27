import axios from "axios";
import {
  AlertCircle,
  Book,
  Edit2,
  Grid,
  PlusCircle,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import Sidebar from "../sidebar";

const Flashcard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    order: 1,
    langauge: "",
    completionCriteria: {
      cardsReviewed: 0,
      minimumCorrect: 70,
    },
    cards: [],
  });

  const [activities, setActivities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  // Fetch all flashcard activities
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/flashcard/flashcard");
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch flashcard activities");
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch available languages
  const fetchLanguages = async () => {
    try {
      const response = await axios.get(
        "/preferred-language/preferredlanguages"
      );
      setLanguages(response.data);
    } catch (err) {
      console.error("Error fetching languages:", err);
      setError("Failed to fetch languages");
    }
  };

  useEffect(() => {
    fetchActivities();
    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCardChange = (index, e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newCards = [...prev.cards];
      newCards[index] = { ...newCards[index], [name]: value };
      return { ...prev, cards: newCards };
    });
  };

  const addCard = () => {
    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, { front: "", back: "", hint: "", example: "" }],
    }));
  };

  // Create new flashcard activity
  const createActivity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/flashcard/flashcard", formData);
      setActivities((prev) => [...prev, response.data]);
      setFormData({
        title: "",
        description: "",
        difficulty: "beginner",
        order: 1,
        language: "",
        completionCriteria: {
          cardsReviewed: 0,
          minimumCorrect: 70,
        },
        cards: [],
      });
      setError(null);
    } catch (err) {
      setError("Failed to create flashcard activity");
      console.error("Error creating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete flashcard activity
  const deleteActivity = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/flashcard/flashcard/${id}`);
      setActivities((prev) => prev.filter((activity) => activity._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete flashcard activity");
      console.error("Error deleting activity:", err);
    } finally {
      setLoading(false);
    }
  };
  const editActivity = (activity) => {
    setEditingId(activity._id);
    setFormData({
      title: activity.title,
      description: activity.description,
      difficulty: activity.difficulty,
      order: activity.order,
      language: activity.language._id,
      completionCriteria: activity.completionCriteria,
      cards: activity.cards,
    });
  };

  // Update flashcard activity
  const updateActivity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(
        `/flashcard/flashcard/${editingId}`,
        formData
      );
      setActivities((prev) =>
        prev.map((activity) =>
          activity._id === editingId ? response.data : activity
        )
      );
      setEditingId(null);
      setFormData({
        title: "",
        description: "",
        difficulty: "beginner",
        order: 1,
        language: "",
        completionCriteria: {
          cardsReviewed: 0,
          minimumCorrect: 70,
        },
        cards: [],
      });
      setError(null);
    } catch (err) {
      setError("Failed to update flashcard activity");
      console.error("Error updating activity:", err);
    } finally {
      setLoading(false);
    }
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
        <div className="p-2">
          <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Header */}
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Flashcard Activities
                </h1>
                <p className="mt-2 text-gray-600">
                  Create and manage your flashcard study sets
                </p>
              </div>
              {/* Create Activity Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-blue-500" />
                    {editingId
                      ? "Edit Flashcard Set"
                      : "Create New Flashcard Set"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={editingId ? updateActivity : createActivity}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Title */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Enter a title for your flashcard set"
                        />
                      </div>
                      {/* Description */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          rows="3"
                          placeholder="Describe what students will learn from these flashcards"
                        />
                      </div>
                      {/* Add Language Selection */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Language
                        </label>
                        <select
                          name="language"
                          value={formData.language}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          required
                        >
                          <option value="">Select a language</option>
                          {languages.map((lang) => (
                            <option key={lang._id} value={lang._id}>
                              {lang.languageName}
                            </option>
                          ))}
                        </select>
                      </div>
                      {/* Difficulty and Order */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Difficulty
                        </label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order
                        </label>
                        <input
                          type="number"
                          name="order"
                          value={formData.order}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                      </div>
                      {/* Completion Criteria */}
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Completion Criteria
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Cards to Review
                            </label>
                            <input
                              type="number"
                              name="cardsReviewed"
                              value={formData.completionCriteria.cardsReviewed}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  completionCriteria: {
                                    ...formData.completionCriteria,
                                    cardsReviewed: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Minimum Correct (%)
                            </label>
                            <input
                              type="number"
                              name="minimumCorrect"
                              value={formData.completionCriteria.minimumCorrect}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  completionCriteria: {
                                    ...formData.completionCriteria,
                                    minimumCorrect: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Flashcards Section */}
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Flashcards
                        </h3>
                        <button
                          type="button"
                          onClick={addCard}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add Card
                        </button>
                      </div>
                      <div className="space-y-4">
                        {formData.cards.map((card, index) => (
                          <div
                            key={index}
                            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Front
                                </label>
                                <input
                                  type="text"
                                  name="front"
                                  value={card.front}
                                  onChange={(e) => handleCardChange(index, e)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  placeholder="Question or term"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Back
                                </label>
                                <input
                                  type="text"
                                  name="back"
                                  value={card.back}
                                  onChange={(e) => handleCardChange(index, e)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  placeholder="Answer or definition"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Hint
                                </label>
                                <input
                                  type="text"
                                  name="hint"
                                  value={card.hint}
                                  onChange={(e) => handleCardChange(index, e)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  placeholder="Optional hint"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Example
                                </label>
                                <input
                                  type="text"
                                  name="example"
                                  value={card.example}
                                  onChange={(e) => handleCardChange(index, e)}
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                  placeholder="Optional example"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                      >
                        {editingId
                          ? "Update Flashcard Set"
                          : "Create Flashcard Set"}
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
              {/* Activities List */}
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Your Flashcard Sets
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {activities.map((activity) => (
                    <Card
                      key={activity._id}
                      className="hover:shadow-lg transition-shadow"
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">{activity.title}</span>
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              activity.difficulty === "beginner"
                                ? "bg-green-100 text-green-800"
                                : activity.difficulty === "intermediate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {activity.difficulty}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-600">
                            {activity.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Grid className="w-4 h-4" />
                              {activity.cards.length} cards
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {activity.completionCriteria.minimumCorrect}% to
                              pass
                            </span>
                          </div>
                          <div className="pt-4 border-t flex justify-between">
                            <button
                              onClick={() => editActivity(activity)}
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteActivity(activity._id)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Flashcard;
