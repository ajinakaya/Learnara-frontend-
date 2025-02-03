import axios from "axios";
import {
  AlertCircle,
  Book,
  Clock,
  Edit2,
  Grid,
  PlusCircle,
  Trash2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import Sidebar from "../sidebar";

const Quiz = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    difficulty: "beginner",
    order: 1,
    language: "",
    duration: 30,
    completionCriteria: {
      passingScore: 70,
      attemptsAllowed: 3,
    },
    questions: [],
  });

  const [activities, setActivities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/quiz/quiz");
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch quiz activities");
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

  const handleQuestionChange = (index, field, value) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[index] = { ...newQuestions[index], [field]: value };
      return { ...prev, questions: newQuestions };
    });
  };

  const handleOptionChange = (questionIndex, optionIndex, value) => {
    setFormData((prev) => {
      const newQuestions = [...prev.questions];
      newQuestions[questionIndex].options[optionIndex] = value;
      return { ...prev, questions: newQuestions };
    });
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          question: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          explanation: "",
        },
      ],
    }));
  };

  const createActivity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/quiz/quiz", formData);
      setActivities((prev) => [...prev, response.data]);
      setFormData({
        title: "",
        description: "",
        difficulty: "beginner",
        order: 1,
        duration: 30,
        language: "",
        completionCriteria: {
          passingScore: 70,
          attemptsAllowed: 3,
        },
        questions: [],
      });
      setError(null);
    } catch (err) {
      setError("Failed to create quiz activity");
      console.error("Error creating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteActivity = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/quiz/quiz/${id}`);
      setActivities((prev) => prev.filter((activity) => activity._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete quiz activity");
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
      duration: activity.duration,
      completionCriteria: activity.completionCriteria,
      questions: activity.questions,
    });
  };

  const updateActivity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`/quiz/quiz/${editingId}`, formData);
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
        duration: 30,
        completionCriteria: {
          passingScore: 70,
          attemptsAllowed: 3,
        },
        questions: [],
      });
      setError(null);
    } catch (err) {
      setError("Failed to update quiz activity");
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

      <div className="flex-1 overflow-auto">
        <div className="p-2">
          <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900">
                  Quiz Activities
                </h1>
                <p className="mt-2 text-gray-600">
                  Create and manage your quiz sets
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
                    <Book className="w-5 h-5 text-blue-500" />
                    {editingId ? "Edit Quiz" : "Create New Quiz"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={editingId ? updateActivity : createActivity}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Title
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter quiz title"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          rows="3"
                          placeholder="Describe the quiz objectives"
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
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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

                      {/* Add Order field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order
                        </label>
                        <input
                          type="number"
                          name="order"
                          value={formData.order}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Difficulty
                        </label>
                        <select
                          name="difficulty"
                          value={formData.difficulty}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                          <option value="beginner">Beginner</option>
                          <option value="intermediate">Intermediate</option>
                          <option value="advanced">Advanced</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Duration (minutes)
                        </label>
                        <input
                          type="number"
                          name="duration"
                          value={formData.duration}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          min="1"
                        />
                      </div>

                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Completion Criteria
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Passing Score (%)
                            </label>
                            <input
                              type="number"
                              value={formData.completionCriteria.passingScore}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  completionCriteria: {
                                    ...formData.completionCriteria,
                                    passingScore: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="0"
                              max="100"
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">
                              Attempts Allowed
                            </label>
                            <input
                              type="number"
                              value={
                                formData.completionCriteria.attemptsAllowed
                              }
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  completionCriteria: {
                                    ...formData.completionCriteria,
                                    attemptsAllowed: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              min="1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">
                          Questions
                        </h3>
                        <button
                          type="button"
                          onClick={addQuestion}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <PlusCircle className="w-4 h-4" />
                          Add Question
                        </button>
                      </div>

                      <div className="space-y-4">
                        {formData.questions.map((question, qIndex) => (
                          <div
                            key={qIndex}
                            className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md"
                          >
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Question {qIndex + 1}
                                </label>
                                <input
                                  type="text"
                                  value={question.question}
                                  onChange={(e) =>
                                    handleQuestionChange(
                                      qIndex,
                                      "question",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                  placeholder="Enter your question"
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {question.options.map((option, oIndex) => (
                                  <div key={oIndex}>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Option {oIndex + 1}
                                    </label>
                                    <input
                                      type="text"
                                      value={option}
                                      onChange={(e) =>
                                        handleOptionChange(
                                          qIndex,
                                          oIndex,
                                          e.target.value
                                        )
                                      }
                                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                      placeholder={`Option ${oIndex + 1}`}
                                    />
                                  </div>
                                ))}
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Correct Answer
                                  </label>
                                  <input
                                    type="text"
                                    value={question.correctAnswer}
                                    onChange={(e) =>
                                      handleQuestionChange(
                                        qIndex,
                                        "correctAnswer",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Enter correct answer"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Explanation
                                  </label>
                                  <input
                                    type="text"
                                    value={question.explanation}
                                    onChange={(e) =>
                                      handleQuestionChange(
                                        qIndex,
                                        "explanation",
                                        e.target.value
                                      )
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Optional explanation"
                                  />
                                </div>
                              </div>
                            </div>
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
                        {editingId ? "Update Quiz" : "Create Quiz"}
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Your Quizzes
                </h2>
                {loading && !editingId ? (
                  <div className="text-center text-gray-500">
                    Loading quizzes...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {activities.map((activity) => (
                      <Card key={activity._id} className="hover:shadow-lg">
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

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Grid className="w-4 h-4" />
                                {activity.questions.length} questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {activity.duration} minutes
                              </span>
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                {activity.completionCriteria.passingScore}% to
                                pass
                              </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-600">
                                Attempts allowed:
                              </span>
                              <span className="font-medium">
                                {activity.completionCriteria.attemptsAllowed}
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
                )}
                {activities.length === 0 && !loading && (
                  <div className="text-center py-8">
                    <p className="text-gray-500">
                      No quizzes created yet. Create your first quiz above!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Quiz;
