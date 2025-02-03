import axios from "axios";
import {
  AlertCircle,
  Clock,
  Edit2,
  FileText,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../card";
import Sidebar from "../sidebar";

const VideoActivity = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    video: null,
    duration: 0,
    difficulty: "beginner",
    order: 1,
    language: "",
    transcription: "",
    completionCriteria: {
      watchPercentage: 90,
    },
  });

  const [activities, setActivities] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Fetch all video activities
  const fetchActivities = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/video/video");
      setActivities(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch video activities");
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

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        video: file,
      }));
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Create new video activity
  const createActivity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();

      // Append all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "video") {
          if (formData.video) {
            form.append("video", formData.video);
          }
        } else if (key === "completionCriteria") {
          form.append(key, JSON.stringify(formData.completionCriteria)); 
        } else {
          form.append(key, formData[key]);
        }
      });

      const response = await axios.post("/video/video", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setActivities((prev) => [...prev, response.data]);
      resetForm();
      setError(null);
    } catch (err) {
      setError("Failed to create video activity");
      console.error("Error creating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateActivity = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const form = new FormData();

      // Append all form fields to FormData
      Object.keys(formData).forEach((key) => {
        if (key === "video") {
          if (formData.video) {
            // Only append if a new video was uploaded
            form.append("video", formData.video);
          }
        } else if (key === "completionCriteria") {
          form.append(key, JSON.stringify(formData[key]));
        } else {
          form.append(key, formData[key]);
        }
      });

      const response = await axios.put(`/video/video/${editingId}`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setActivities((prev) =>
        prev.map((activity) =>
          activity._id === editingId ? response.data : activity
        )
      );
      resetForm();
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError("Failed to update video activity");
      console.error("Error updating activity:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete video activity
  const deleteActivity = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/video/video/${id}`);
      setActivities((prev) => prev.filter((activity) => activity._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete video activity");
      console.error("Error deleting activity:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit video activity
  const editActivity = (activity) => {
    setEditingId(activity._id);
    setFormData({
      title: activity.title,
      description: activity.description,
      difficulty: activity.difficulty,
      duration: activity.duration,
      order: activity.order,
      language: activity.language._id,
      video: activity.video,
      transcription: activity.transcription || "",
      completionCriteria: activity.completionCriteria || {
        watchPercentage: 90,
      },
    });
    // Set the preview URL to the existing video
    setPreviewUrl(`http://localhost:3001/${activity.video}`);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      video: null,
      duration: 0,
      difficulty: "beginner",
      order: 1,
      language: "",
      transcription: "",
      completionCriteria: {
        watchPercentage: 90,
      },
    });
    setPreviewUrl(null);
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
                Video Activities
              </h1>
              <p className="mt-2 text-gray-600">
                Upload and manage your video content
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
                  <Video className="w-5 h-5 text-blue-500" />
                  {editingId ? "Edit Video" : "Upload New Video"}
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
                        placeholder="Enter video title"
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
                        placeholder="Describe the video content"
                      />
                    </div>

                    {/* Added Language Selection */}
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

                    {/* Added Order field */}
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

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Video Upload
                      </label>
                      <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600">
                            <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                              <span>Upload a video</span>
                              <input
                                type="file"
                                className="sr-only"
                                accept="video/*"
                                onChange={handleVideoUpload}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">
                            MP4, WebM up to 2GB
                          </p>
                        </div>
                      </div>
                    </div>

                    {previewUrl && (
                      <div className="col-span-2">
                        <video
                          className="w-full rounded-lg"
                          controls
                          src={previewUrl}
                        />
                      </div>
                    )}

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
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Transcription
                      </label>
                      <textarea
                        name="transcription"
                        value={formData.transcription}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        rows="4"
                        placeholder="Add video transcription"
                      />
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
                        ? "Update Video"
                        : "Upload Video"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Videos
              </h2>
              {loading && !editingId ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading videos...</p>
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
                          <video
                            className="w-full rounded-lg"
                            controls
                            src={`http://localhost:3001/${activity.video}`}
                          />
                          <p className="text-gray-600">
                            {activity.description}
                          </p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {activity.duration} minutes
                            </span>
                            {activity.transcription && (
                              <span className="flex items-center gap-1">
                                <FileText className="w-4 h-4" />
                                Transcription available
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-4 h-4" />
                              {activity.completionCriteria.watchPercentage}% to
                              complete
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
                    No videos uploaded yet. Create your first video activity
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

export default VideoActivity;
