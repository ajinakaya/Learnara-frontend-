import React, { useState, useEffect } from "react";
import { Book, Plus, Trash2, Edit2, Clock, Target, Flag } from "lucide-react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import Sidebar from "./sidebar";

const ChapterPage = () => {
  const [languages, setLanguages] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [subLessons, setSubLessons] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    order: 0,
    language: "",
    subLessons: [],
    prerequisites: [],
    learningObjectives: [],
    estimatedDuration: 0,
    status: "draft",
  });

  // Fetch languages, sublessons, and chapters
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [languagesRes, subLessonsRes, chaptersRes] = await Promise.all([
          fetch(
            "http://localhost:3001/preferred-language/preferredlanguages"
          ).then((res) => res.json()),
          fetch("http://localhost:3001/sublesson/lesson").then((res) =>
            res.json()
          ),
          fetch("http://localhost:3001/chapter/chapters").then((res) =>
            res.json()
          ),
        ]);

        setLanguages(languagesRes);
        setSubLessons(subLessonsRes);
        setChapters(chaptersRes);
        setError(null);
      } catch (err) {
        setError("Failed to fetch data");
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "select-multiple") {
      const options = e.target.options;
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedValues.push(options[i].value);
        }
      }
      setFormData((prev) => ({
        ...prev,
        [name]: selectedValues,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "number" ? Number(value) : value,
      }));
    }
  };

  const addObjective = () => {
    setFormData((prev) => ({
      ...prev,
      learningObjectives: [...prev.learningObjectives, ""],
    }));
  };

  const handleObjectiveChange = (index, value) => {
    const newObjectives = [...formData.learningObjectives];
    newObjectives[index] = value;
    setFormData((prev) => ({
      ...prev,
      learningObjectives: newObjectives,
    }));
  };

  const handleObjectiveRemove = (index) => {
    setFormData((prev) => ({
      ...prev,
      learningObjectives: prev.learningObjectives.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingId) {
        const response = await fetch(
          `http://localhost:3001/chapter/chapters/${editingId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        const updatedChapter = await response.json();
        setChapters((prev) =>
          prev.map((chapter) =>
            chapter._id === editingId ? updatedChapter : chapter
          )
        );
      } else {
        const response = await fetch("http://localhost:3001/chapter/chapters", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        const newChapter = await response.json();
        setChapters((prev) => [...prev, newChapter]);
      }
      resetForm();
      setError(null);
    } catch (err) {
      setError(`Failed to ${editingId ? "update" : "create"} chapter`);
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const deleteChapter = async (id) => {
    try {
      setLoading(true);
      await fetch(`http://localhost:3001/chapter/chapters/${id}`, {
        method: "DELETE",
      });
      setChapters((prev) => prev.filter((chapter) => chapter._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete chapter");
      console.error("Error deleting chapter:", err);
    } finally {
      setLoading(false);
    }
  };

  const editChapter = (chapter) => {
    setEditingId(chapter._id);
    setFormData({
      ...chapter,
      language: chapter.language._id,
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      order: 0,
      language: "",
      subLessons: [],
      prerequisites: [],
      learningObjectives: [],
      estimatedDuration: 0,
      status: "draft",
    });
    setEditingId(null);
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
                Chapter Management
              </h1>
              <p className="mt-2 text-gray-600">
                Create and manage your chapters
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
                  {editingId ? "Edit Chapter" : "Create New Chapter"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6"></div>
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
                      Order
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sub Lessons
                    </label>
                    <select
                      name="subLessons"
                      value={formData.subLessons}
                      onChange={handleChange}
                      multiple
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      size="4"
                    >
                      {subLessons.map((lesson) => (
                        <option key={lesson._id} value={lesson._id}>
                          {lesson.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prerequisites
                    </label>
                    <select
                      name="prerequisites"
                      value={formData.prerequisites}
                      onChange={handleChange}
                      multiple
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      size="4"
                    >
                      {chapters.map((chapter) => (
                        <option key={chapter._id} value={chapter._id}>
                          {chapter.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-gray-700">
                        Learning Objectives
                      </label>
                      <button
                        type="button"
                        onClick={addObjective}
                        className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Add Objective
                      </button>
                    </div>
                    {formData.learningObjectives.map((objective, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={objective}
                          onChange={(e) =>
                            handleObjectiveChange(index, e.target.value)
                          }
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter learning objective"
                        />
                        {formData.learningObjectives.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleObjectiveRemove(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Estimated Duration (minutes)
                      </label>
                      <input
                        type="number"
                        name="estimatedDuration"
                        value={formData.estimatedDuration}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
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
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    {editingId && (
                      <button
                        type="button"
                        onClick={resetForm}
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
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
                        ? "Update Chapter"
                        : "Create Chapter"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                Chapters List
              </h2>
              {loading && !editingId ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading chapters...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {chapters.map((chapter) => (
                    <Card key={chapter._id} className="hover:shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="w-8 h-8 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center">
                              {chapter.order}
                            </span>
                            <span className="text-lg">{chapter.title}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => editChapter(chapter)}
                              className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteChapter(chapter._id)}
                              className="text-red-500 hover:text-red-700 flex items-center gap-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-gray-600">{chapter.description}</p>

                          <div className="flex flex-wrap gap-4">
                            <div className="flex items-center gap-2 text-gray-600">
                              <Clock className="w-4 h-4" />
                              {chapter.estimatedDuration} minutes
                            </div>
                            <div className="flex items-center gap-2 text-gray-600">
                              <Target className="w-4 h-4" />
                              {chapter.learningObjectives.length} objectives
                            </div>
                            <div className="flex items-center gap-2">
                              <Flag className="w-4 h-4" />
                              <span
                                className={`px-2 py-1 rounded-full text-sm ${
                                  chapter.status === "published"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-yellow-100 text-yellow-700"
                                }`}
                              >
                                {chapter.status}
                              </span>
                            </div>
                          </div>
                          {chapter.learningObjectives.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Learning Objectives
                              </h4>
                              <ul className="space-y-2">
                                {chapter.learningObjectives.map(
                                  (objective, index) => (
                                    <li
                                      key={index}
                                      className="flex items-start gap-2"
                                    >
                                      <div className="w-5 h-5 bg-blue-100 text-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                        {index + 1}
                                      </div>
                                      <span className="text-gray-600">
                                        {objective}
                                      </span>
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                          {chapter.prerequisites.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Prerequisites
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {chapter.prerequisites.map((prereq) => (
                                  <span
                                    key={prereq._id}
                                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                  >
                                    {prereq.title}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {chapter.subLessons.length > 0 && (
                            <div className="mt-4">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Sub Lessons
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {chapter.subLessons.map((lesson) => (
                                  <div
                                    key={lesson._id}
                                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                                  >
                                    <span className="text-gray-700">
                                      {lesson.title}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              {chapters.length === 0 && !loading && (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No chapters created yet. Create your first chapter above!
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

export default ChapterPage;
