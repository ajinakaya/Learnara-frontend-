import axios from "axios";
import {
  AlertCircle,
  Book,
  Clock,
  Edit2,
  Link,
  Trash2,
  Upload,
  Volume2,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import Sidebar from "../sidebar";

const AudioActivity = () => {
  const [activities, setActivities] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    audio: null,
    duration: 0,
    language: "",
    transcript: "",
    difficulty: "beginner",
    order: 1,
    resources: [],
    completionCriteria: {
      listenPercentage: 90,
    },
  });

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/audio/audio");
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch audio activities");
      console.error("Error fetching activities:", err);
    } finally {
      setLoading(false);
    }
  };

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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (file) => {
    if (file.type.startsWith("audio/")) {
      setFormData((prev) => ({
        ...prev,
        audio: file,
      }));
      setSelectedFileName(file.name);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const createActivity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "audio" && formData[key] instanceof File) {
          formDataToSend.append("audio", formData[key]);
        } else if (key === "resources" || key === "completionCriteria") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.post("/audio/audio", formDataToSend);
      setActivities((prev) => [...prev, response.data]);
      resetForm();
      setError(null);
    } catch (err) {
      setError("Failed to create audio activity");
      console.error("Error creating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "audio" && formData[key] instanceof File) {
          formDataToSend.append("audio", formData[key]);
        } else if (key === "resources" || key === "completionCriteria") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      const response = await axios.put(
        `/audio/audio/${editingId}`,
        formDataToSend
      );
      setActivities((prev) =>
        prev.map((activity) =>
          activity._id === editingId ? response.data : activity
        )
      );
      resetForm();
      setError(null);
    } catch (err) {
      setError("Failed to update audio activity");
      console.error("Error updating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      audio: null,
      duration: 0,
      language: "",
      transcript: "",
      difficulty: "beginner",
      order: 1,
      resources: [],
      completionCriteria: {
        listenPercentage: 90,
      },
    });
    setSelectedFileName("");
    setPreviewUrl(null);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/audio/audio/${id}`);
      setActivities((prev) => prev.filter((activity) => activity._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete audio activity");
      console.error("Error deleting activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (activity) => {
    setEditingId(activity._id);
    setFormData({
      title: activity.title,
      description: activity.description,
      audio: activity.audio,
      duration: activity.duration,
      language: activity.language._id,
      transcript: activity.transcript || "",
      difficulty: activity.difficulty,
      order: activity.order,
      resources: activity.resources || [],
      completionCriteria: activity.completionCriteria,
    });
    setSelectedFileName(activity.audio ? activity.audio.split("/").pop() : "");
    setPreviewUrl(`http://localhost:3001/${activity.audio}`);
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
                Audio Activities
              </h1>
              <p className="mt-2 text-gray-600">
                Create and manage your audio lessons
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
                  {editingId
                    ? "Edit Audio Activity"
                    : "Create New Audio Activity"}
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
                        value={formData.title}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            title: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="3"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Language
                      </label>
                      <select
                        value={formData.language}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            language: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order
                      </label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            order: parseInt(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Difficulty
                      </label>
                      <select
                        value={formData.difficulty}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            difficulty: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
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
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            duration: parseInt(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        min="1"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Audio File
                      </label>
                      <div
                        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors
                      ${
                        dragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }
                      ${selectedFileName ? "bg-gray-50" : ""}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                      >
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) =>
                            e.target.files[0] &&
                            handleFileSelect(e.target.files[0])
                          }
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="text-center">
                          {selectedFileName ? (
                            <>
                              <Volume2 className="mx-auto h-8 w-8 text-blue-500" />
                              <div className="mt-2 text-sm font-medium text-gray-900">
                                {selectedFileName}
                              </div>
                              <p className="text-xs text-gray-500">
                                Click or drag to replace
                              </p>
                            </>
                          ) : (
                            <>
                              <Upload className="mx-auto h-8 w-8 text-gray-400" />
                              <div className="mt-2 text-sm font-medium text-gray-900">
                                Drop your audio file here
                              </div>
                              <p className="text-xs text-gray-500">
                                or click to browse
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                      {previewUrl && (
                        <div className="mt-4">
                          <audio controls className="w-full" src={previewUrl} />
                        </div>
                      )}
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Completion Criteria
                      </label>
                      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Required Listen Percentage (%)
                          </label>
                          <input
                            type="number"
                            value={formData.completionCriteria.listenPercentage}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                completionCriteria: {
                                  ...prev.completionCriteria,
                                  listenPercentage: parseInt(e.target.value),
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
                        Transcript
                      </label>
                      <textarea
                        value={formData.transcript}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            transcript: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        rows="4"
                      />
                    </div>
                  </div>

                  {/* Previous code remains the same until the button section */}
                  <div className="flex justify-end gap-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      disabled={loading}
                    >
                      {editingId ? "Update Activity" : "Create Activity"}
                    </button>
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Audio Activities
              </h2>
              {loading && !editingId ? (
                <div className="text-center text-gray-500">
                  Loading activities...
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
                              <Volume2 className="w-4 h-4" />
                              Activity {activity.order}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {activity.duration} minutes
                            </span>
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {activity.completionCriteria.listenPercentage}%
                              required
                            </span>
                          </div>

                          {activity.audio && (
                            <div className="mt-4">
                              <audio
                                controls
                                className="w-full"
                                src={`http://localhost:3001/${activity.audio}`}
                              />
                            </div>
                          )}

                          {activity.transcript && (
                            <div className="mt-2">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">
                                Transcript
                              </h4>
                              <p className="text-sm text-gray-600 line-clamp-3">
                                {activity.transcript}
                              </p>
                            </div>
                          )}

                          {activity.resources?.length > 0 && (
                            <div className="space-y-1">
                              <h4 className="text-sm font-medium text-gray-700">
                                Resources
                              </h4>
                              <div className="space-y-1">
                                {activity.resources.map((resource, index) => (
                                  <a
                                    key={index}
                                    href={resource.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
                                  >
                                    <Link className="w-4 h-4" />
                                    {resource.title}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="pt-4 border-t flex justify-between">
                            <button
                              onClick={() => handleEdit(activity)}
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(activity._id)}
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
                    No audio activities created yet. Create your first activity
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

export default AudioActivity;
