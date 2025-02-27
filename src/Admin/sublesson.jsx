import React, { useState, useEffect } from "react";
import {
  PlusCircle,
  Book,
  Grid,
  Clock,
  AlertCircle,
  Edit2,
  Trash2,
  Video,
  PlayCircle,
  FileText,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import Sidebar from "./sidebar";

const SubLesson = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 1,
    language: "",
    activityType: "",
    activities: [],
    duration: 30,
    objectives: [],
    status: "draft",
    completionCriteria: {
      requiredActivities: 0,
      minimumScore: 70,
    },
  });

  const [subLessons, setSubLessons] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [availableActivities, setAvailableActivities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [objectiveInput, setObjectiveInput] = useState("");

  const activityTypes = [
    { value: "VideoActivity", label: "Video", icon: Video },
    { value: "QuizActivity", label: "Quiz", icon: FileText },
    { value: "AudioActivity", label: "Audio", icon: PlayCircle },
    { value: "FlashcardActivity", label: "Flashcard", icon: Book },
  ];

  // Fetch sublessons
  const fetchSubLessons = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3001/sublesson/lesson");
      const data = await response.json();
      setSubLessons(data);
    } catch (err) {
      setError("Failed to fetch sublessons");
    } finally {
      setLoading(false);
    }
  };

  // Fetch languages
  const fetchLanguages = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/preferred-language/preferredlanguages"
      );
      const data = await response.json();
      setLanguages(data);
    } catch (err) {
      setError("Failed to fetch languages");
    }
  };

  // Fetch activities based on selected type
  const fetchActivitiesByType = async (type) => {
    try {
      let endpoint = "";
      switch (type) {
        case "VideoActivity":
          endpoint = "http://localhost:3001/video/video";
          break;
        case "QuizActivity":
          endpoint = "http://localhost:3001/quiz/quiz";
          break;
        case "AudioActivity":
          endpoint = "http://localhost:3001/audio/audio";
          break;
        case "FlashcardActivity":
          endpoint = "http://localhost:3001/flashcard/flashcard";
          break;
      }
      const response = await fetch(endpoint);
      const data = await response.json();
      setAvailableActivities(data);
    } catch (err) {
      setError(`Failed to fetch ${type} activities`);
    }
  };

  useEffect(() => {
    fetchSubLessons();
    fetchLanguages();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "activityType") {
      fetchActivitiesByType(value);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        activities: [],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleActivitiesChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      activities: selectedOptions,
    }));
  };

  const addObjective = () => {
    if (objectiveInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        objectives: [...prev.objectives, objectiveInput.trim()],
      }));
      setObjectiveInput("");
    }
  };

  const removeObjective = (index) => {
    setFormData((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        await fetch(`http://localhost:3001/sublesson/lesson/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      } else {
        await fetch("http://localhost:3001/sublesson/lesson", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
      }
      fetchSubLessons();
      resetForm();
    } catch (err) {
      setError(
        editingId ? "Failed to update sublesson" : "Failed to create sublesson"
      );
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      order: 1,
      language: "",
      activityType: "",
      activities: [],
      duration: 30,
      objectives: [],
      status: "draft",
      completionCriteria: {
        requiredActivities: 0,
        minimumScore: 70,
      },
    });
    setEditingId(null);
    setObjectiveInput("");
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
                SubLesson Management
              </h1>
              <p className="mt-2 text-gray-600">
                Create and manage your sub-lessons
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
                  {editingId ? "Edit SubLesson" : "Create New SubLesson"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        name="language"
                        value={formData.language}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Language</option>
                        {languages.map((lang) => (
                          <option key={lang._id} value={lang._id}>
                            {lang.languageName}
                          </option>
                        ))}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Activity Type
                      </label>
                      <select
                        name="activityType"
                        value={formData.activityType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Select Activity Type</option>
                        {activityTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                      />
                    </div>

                    {formData.activityType && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Select Activities
                        </label>
                        <select
                          multiple
                          value={formData.activities}
                          onChange={handleActivitiesChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          size="4"
                        >
                          {availableActivities.map((activity) => (
                            <option key={activity._id} value={activity._id}>
                              {activity.title}
                            </option>
                          ))}
                        </select>
                        <p className="mt-1 text-sm text-gray-500">
                          Hold Ctrl/Cmd to select multiple activities
                        </p>
                      </div>
                    )}

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Objectives
                      </label>
                      <div className="flex gap-2 mb-2">
                        <input
                          type="text"
                          value={objectiveInput}
                          onChange={(e) => setObjectiveInput(e.target.value)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Add an objective"
                        />
                        <button
                          type="button"
                          onClick={addObjective}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {formData.objectives.map((objective, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between bg-gray-50 p-2 rounded-lg"
                          >
                            <span>{objective}</span>
                            <button
                              type="button"
                              onClick={() => removeObjective(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Completion Criteria
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Required Activities
                          </label>
                          <input
                            type="number"
                            value={
                              formData.completionCriteria.requiredActivities
                            }
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                completionCriteria: {
                                  ...prev.completionCriteria,
                                  requiredActivities: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Minimum Score (%)
                          </label>
                          <input
                            type="number"
                            value={formData.completionCriteria.minimumScore}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                completionCriteria: {
                                  ...prev.completionCriteria,
                                  minimumScore: parseInt(e.target.value),
                                },
                              }))
                            }
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading
                        ? "Saving..."
                        : editingId
                        ? "Update SubLesson"
                        : "Create SubLesson"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your SubLessons
              </h2>
              {loading && !editingId ? (
                <div className="text-center text-gray-500">
                  Loading sublessons...
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {subLessons.map((sublesson) => (
                    <Card key={sublesson._id} className="hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="text-lg">{sublesson.title}</span>
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              sublesson.status === "published"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {sublesson.status}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-600">
                            {sublesson.description}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Grid className="w-4 h-4" />
                              Order: {sublesson.order}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {sublesson.duration} minutes
                            </span>
                            {sublesson.language && (
                              <span className="flex items-center gap-1">
                                <Book className="w-4 h-4" />
                                {sublesson.language.languageName}
                              </span>
                            )}
                          </div>

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              Activity Type
                            </h4>
                            <div className="flex items-center gap-2">
                              {sublesson.activityType === "VideoActivity" && (
                                <Video className="w-4 h-4 text-blue-500" />
                              )}
                              {sublesson.activityType === "AudioActivity" && (
                                <PlayCircle className="w-4 h-4 text-blue-500" />
                              )}
                              {sublesson.activityType === "QuizActivity" && (
                                <FileText className="w-4 h-4 text-blue-500" />
                              )}
                              <span className="text-sm text-gray-600">
                                {
                                  activityTypes.find(
                                    (type) =>
                                      type.value === sublesson.activityType
                                  )?.label
                                }
                              </span>
                            </div>
                          </div>

                          {sublesson.objectives.length > 0 && (
                            <div className="space-y-2">
                              <h4 className="text-sm font-medium text-gray-700">
                                Objectives
                              </h4>
                              <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                                {sublesson.objectives.map(
                                  (objective, index) => (
                                    <li key={index}>{objective}</li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          <div className="space-y-2">
                            <h4 className="text-sm font-medium text-gray-700">
                              Completion Criteria
                            </h4>
                            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Required Activities:{" "}
                                {
                                  sublesson.completionCriteria
                                    .requiredActivities
                                }
                              </span>
                              <span className="flex items-center gap-1">
                                <AlertCircle className="w-4 h-4" />
                                Minimum Score:{" "}
                                {sublesson.completionCriteria.minimumScore}%
                              </span>
                            </div>
                          </div>

                          <div className="pt-4 border-t flex justify-between">
                            <button
                              onClick={() => {
                                setEditingId(sublesson._id);
                                setFormData({
                                  title: sublesson.title,
                                  description: sublesson.description,
                                  order: sublesson.order,
                                  language: sublesson.language._id,
                                  activityType: sublesson.activityType,
                                  activities: sublesson.activities.map(
                                    (a) => a._id
                                  ),
                                  duration: sublesson.duration,
                                  objectives: sublesson.objectives,
                                  status: sublesson.status,
                                  completionCriteria:
                                    sublesson.completionCriteria,
                                });
                                fetchActivitiesByType(sublesson.activityType);
                              }}
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={async () => {
                                if (
                                  window.confirm(
                                    "Are you sure you want to delete this sublesson?"
                                  )
                                ) {
                                  try {
                                    await fetch(
                                      `http://localhost:3001/lesson/sublesson/${sublesson._id}`,
                                      {
                                        method: "DELETE",
                                      }
                                    );
                                    fetchSubLessons();
                                  } catch (err) {
                                    setError("Failed to delete sublesson");
                                  }
                                }
                              }}
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
              {subLessons.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No sublessons created yet. Create your first sublesson
                    above!
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

export default SubLesson;
