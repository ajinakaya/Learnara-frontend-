import React, { useState, useEffect } from "react";
import {
  Target,Trash2,Edit2,Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import Sidebar from "./sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "./card";

const LanguagesPage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState({
    languageName: "",
    languageImage: null,
  });
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch all languages
  const fetchLanguages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "/preferred-language/preferredlanguages"
      );
      setLanguages(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch languages");
      console.error("Error fetching languages:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prev) => ({ ...prev, languageImage: file }));

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Create new language
  const createLanguage = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("languageName", formData.languageName);
      if (formData.languageImage) {
        formDataToSend.append("languageImage", formData.languageImage);
      }

      const response = await axios.post(
        "/preferred-language/preferredlanguages",
        formDataToSend
      );
      setLanguages((prev) => [...prev, response.data]);
      resetForm();
      setError(null);
    } catch (err) {
      setError("Failed to create language");
      console.error("Error creating language:", err);
    } finally {
      setLoading(false);
    }
  };

  // Update language
  const updateLanguage = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formDataToSend = new FormData();
      formDataToSend.append("languageName", formData.languageName);
      if (formData.languageImage) {
        formDataToSend.append("languageImage", formData.languageImage);
      }

      const response = await axios.put(
        `/preferred-language/preferredlanguages/${editingId}`,
        formDataToSend
      );
      setLanguages((prev) =>
        prev.map((lang) => (lang._id === editingId ? response.data : lang))
      );
      resetForm();
      setError(null);
    } catch (err) {
      setError("Failed to update language");
      console.error("Error updating language:", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete language
  const deleteLanguage = async (id) => {
    try {
      setLoading(true);
      await axios.delete(`/preferred-language/preferredlanguages/${id}`);
      setLanguages((prev) => prev.filter((lang) => lang._id !== id));
      setError(null);
    } catch (err) {
      setError("Failed to delete language");
      console.error("Error deleting language:", err);
    } finally {
      setLoading(false);
    }
  };

  // Edit language
  const editLanguage = (language) => {
    setEditingId(language._id);
    setFormData({
      languageName: language.languageName,
      languageImage: null,
    });
    setPreviewImage(`http://localhost:3001/${language.languageImage}`);
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      languageName: "",
      languageImage: null,
    });
    setEditingId(null);
    setPreviewImage(null);
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
                Language Management
              </h1>
              <p className="mt-2 text-gray-600">
                Create and manage available languages
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
                  {editingId ? "Edit Language" : "Add New Language"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={editingId ? updateLanguage : createLanguage}
                  className="space-y-6"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Language Name
                    </label>
                    <input
                      type="text"
                      value={formData.languageName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          languageName: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter language name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1"></label>
                    <div className="flex items-center space-x-4">
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          onChange={handleImageChange}
                          className="hidden"
                          accept="image/*"
                        />
                        <div className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                          <ImageIcon className="mr-2 w-4 h-4" />
                          Choose Image
                        </div>
                      </label>
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                      )}
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
                        ? "Update Language"
                        : "Create Language"}
                    </button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Languages List
                </h2>
                {languages.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">
                    No languages added yet
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {languages.map((language) => (
                      <div
                        key={language._id}
                        className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:shadow-md transition"
                      >
                        <div className="flex items-center space-x-4">
                          {language.languageImage ? (
                            <img
                              src={`http://localhost:3001/${language.languageImage}`}
                              alt={language.languageName}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                              <ImageIcon className="text-gray-500" />
                            </div>
                          )}
                          <span className="font-medium">
                            {language.languageName}
                          </span>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editLanguage(language)}
                            className="text-blue-500 hover:bg-blue-100 p-2 rounded-full transition"
                          >
                            <Edit2 size={20} />
                          </button>
                          <button
                            onClick={() => deleteLanguage(language._id)}
                            className="text-red-500 hover:bg-red-100 p-2 rounded-full transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
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

export default LanguagesPage;
