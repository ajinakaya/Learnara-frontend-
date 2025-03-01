import React, { useState, useEffect } from "react";
import {
  Book, Trash2, Edit2, Clock, Tag, Star, DollarSign, BookOpen, FileText,
} from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import Sidebar from "./sidebar";

const Course = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [languages, setLanguages] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [filteredChapters, setFilteredChapters] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    language: "",
    level: ["A1"],
    description: "",
    thumbnail: "",
    premium: false,
    price: {
      amount: 0,
      currency: "USD",
    },
    category: "Beginner",
    tags: [],
    chapters: [],
    status: "draft",
    metadata: {
      totalDuration: 0,
      totalChapters: 0,
      totalSubLessons: 0,
      totalActivities: 0,
    },
  });

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [newTag, setNewTag] = useState("");

  // Fetch languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "/preferred-language/preferredlanguages"
        );
        setLanguages(response.data);
      } catch (err) {
        console.error("Error fetching languages:", err);
      }
    };
    fetchLanguages();
  }, []);

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get("/chapter/chapters");
        setChapters(response.data);
      } catch (err) {
        console.error("Error fetching chapters:", err);
      }
    };
    fetchChapters();
  }, []);

  // Filter chapters based on selected language
  useEffect(() => {
    if (formData.language && chapters.length > 0) {
      const filtered = chapters.filter(chapter => 
        chapter.language && chapter.language._id === formData.language
      );
      setFilteredChapters(filtered);
      
      // Clear selected chapters if they don't belong to the selected language
      setFormData(prev => ({
        ...prev,
        chapters: prev.chapters.filter(chapterId => 
          filtered.some(filteredChapter => filteredChapter._id === chapterId)
        )
      }));
    } else {
      setFilteredChapters([]);
    }
  }, [formData.language, chapters]);

  // Fetch all courses
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3001/course/course");
      setCourses(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch courses");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === "number" ? Number(value) : value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]:
          type === "checkbox"
            ? checked
            : type === "number"
            ? Number(value)
            : value,
      }));
    }
  };

  const handleLevelChange = (level) => {
    setFormData((prev) => ({
      ...prev,
      level: prev.level.includes(level)
        ? prev.level.filter((l) => l !== level)
        : [...prev.level, level],
    }));
  };

  const handleTagAdd = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          thumbnail: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Handle chapter selection
  const handleChapterChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setFormData((prev) => ({
      ...prev,
      chapters: selectedOptions,
    }));
  };

  // Create new course
  const createCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.post("/course/course", formData);
      setCourses((prev) => [...prev, response.data]);
      resetForm();
      setError(null);
    } catch (err) {
      setError("Failed to create course");
      console.error("Error creating course:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update course
  const updateCourse = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await axios.put(`/course/course/${editingId}`, formData);
      setCourses((prev) =>
        prev.map((course) =>
          course._id === editingId ? response.data : course
        )
      );
      resetForm();
      setEditingId(null);
      setError(null);
    } catch (err) {
      setError("Failed to update course");
      console.error("Error updating course:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete course
  const deleteCourse = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/course/course/${id}`);
      setCourses((prev) => prev.filter((course) => course._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete course");
      console.error("Error deleting course:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit course
  const editCourse = (course) => {
    setEditingId(course._id);
    setFormData({
      ...course,
      language: course.language._id,
    });
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      title: "",
      language: "",
      level: ["A1"],
      description: "",
      thumbnail: "",
      premium: false,
      price: {
        amount: 0,
        currency: "USD",
      },
      category: "Beginner",
      tags: [],
      status: "draft",
      metadata: {
        totalDuration: 0,
        totalChapters: 0,
        totalSubLessons: 0,
        totalActivities: 0,
      },
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
                Course Management
              </h1>
              <p className="mt-2 text-gray-600">
                Create and manage your courses
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
                  {editingId ? "Edit Course" : "Create New Course"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={editingId ? updateCourse : createCourse}
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
                        required
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
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div className="col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Levels
                      </label>
                      <div className="flex gap-4">
                        {["A1", "A2", "B1", "B2"].map((level) => (
                          <label
                            key={level}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              checked={formData.level.includes(level)}
                              onChange={() => handleLevelChange(level)}
                              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                            />
                            {level}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Thumbnail
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      {formData.thumbnail && (
                        <img
                          src={formData.thumbnail}
                          alt="Thumbnail preview"
                          className="mt-2 h-32 object-cover rounded-lg"
                        />
                      )}
                    </div>

                    <div>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          name="premium"
                          checked={formData.premium}
                          onChange={handleChange}
                          className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                        />
                        Premium Course
                      </label>
                    </div>

                    {formData.premium && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Price
                        </label>
                        <div className="flex gap-4">
                          <input
                            type="number"
                            name="price.amount"
                            value={formData.price.amount}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                          <select
                            name="price.currency"
                            value={formData.price.currency}
                            onChange={handleChange}
                            className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tags
                      </label>
                      <div className="flex gap-2 flex-wrap mb-2">
                        {formData.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-2"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleTagRemove(tag)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Add a tag"
                        />
                        <button
                          type="button"
                          onClick={handleTagAdd}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Add
                        </button>
                      </div>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Chapters
                      </label>
                      {!formData.language ? (
                        <div className="text-amber-600 mb-2">
                          Please select a language first to see available chapters
                        </div>
                      ) : filteredChapters.length === 0 ? (
                        <div className="text-amber-600 mb-2">
                          No chapters available for the selected language
                        </div>
                      ) : null}
                      <select
                        multiple
                        name="chapters"
                        value={formData.chapters}
                        onChange={handleChapterChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[100px]"
                        disabled={!formData.language || filteredChapters.length === 0}
                      >
                        {filteredChapters.map((chapter) => (
                          <option key={chapter._id} value={chapter._id}>
                            {chapter.title}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-sm text-gray-500">
                        Hold Ctrl (Windows) or Command (Mac) to select multiple
                        chapters
                      </p>
                    </div>

                    <div className="col-span-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">
                        Metadata
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Duration (hrs)
                          </label>
                          <input
                            type="number"
                            name="metadata.totalDuration"
                            value={formData.metadata.totalDuration}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Chapters
                          </label>
                          <input
                            type="number"
                            name="metadata.totalChapters"
                            value={formData.metadata.totalChapters}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Sub Lessons
                          </label>
                          <input
                            type="number"
                            name="metadata.totalSubLessons"
                            value={formData.metadata.totalSubLessons}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-600 mb-1">
                            Activities
                          </label>
                          <input
                            type="number"
                            name="metadata.totalActivities"
                            value={formData.metadata.totalActivities}
                            onChange={handleChange}
                            min="0"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2"
                      disabled={loading}
                    >
                      {loading
                        ? "Processing..."
                        : editingId
                        ? "Update Course"
                        : "Create Course"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Courses
              </h2>
              {loading && !editingId ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading courses...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {courses.map((course) => (
                    <Card key={course._id} className="hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {course.thumbnail && (
                              <img
                                src={course.thumbnail}
                                alt={course.title}
                                className="w-16 h-16 object-cover rounded-lg"
                              />
                            )}
                            <div>
                              <h3 className="text-xl font-semibold">
                                {course.title}
                              </h3>
                              <p className="text-sm text-gray-500">
                                {course.language.languageName} •{" "}
                                {course.category}
                              </p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 text-sm rounded-full ${
                              course.status === "published"
                                ? "bg-green-100 text-green-800"
                                : course.status === "draft"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {course.status.charAt(0).toUpperCase() +
                              course.status.slice(1)}
                          </span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-600">{course.description}</p>

                          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {course.metadata.totalDuration} hours
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-4 h-4" />
                              {course.metadata.totalChapters} chapters
                            </span>
                            <span className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              {course.metadata.totalSubLessons} lessons
                            </span>
                            {course.premium && (
                              <span className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {course.price.amount} {course.price.currency}
                              </span>
                            )}
                            {course.metadata.averageRating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="w-4 h-4" />
                                {course.metadata.averageRating.toFixed(1)}
                              </span>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {course.level.map((level) => (
                              <span
                                key={level}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                              >
                                Level {level}
                              </span>
                            ))}
                          </div>

                          {course.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {course.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 rounded text-sm"
                                >
                                  <Tag className="w-3 h-3" />
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="pt-4 border-t flex justify-end gap-4">
                            <button
                              onClick={() => editCourse(course)}
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteCourse(course._id)}
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
              {courses.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No courses created yet. Create your first course above!
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

export default Course;