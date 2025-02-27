

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "./authcontext";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const { authToken } = useContext(AuthContext);
  const [selectedLanguage, setSelectedLanguage] = useState(
    JSON.parse(localStorage.getItem("selectedLanguage")) || null
  );
  const [userLanguages, setUserLanguages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_URL = "http://localhost:3001/language";

  //  Add new language preference
  const addLanguagePreference = async (language) => {
    if (!authToken) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/language`,
        { languageId: language._id },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      
      setSelectedLanguage(language);
      localStorage.setItem("selectedLanguage", JSON.stringify(language));
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Error adding language preference");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get user's language preferences
  const getLanguagePreferences = async () => {
    if (!authToken) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${API_URL}/language`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      setUserLanguages(response.data);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Error fetching language preferences");
      throw error;
    } finally {
      setLoading(false);
    }
  };

 
  

  //  Remove language preference
  const removeLanguagePreference = async (preferenceId) => {
    if (!authToken) return;

    setLoading(true);
    setError(null);
    try {
      const response = await axios.delete(`${API_URL}/language/${preferenceId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      
      if (selectedLanguage?._id === preferenceId) {
        setSelectedLanguage(null);
        localStorage.removeItem("selectedLanguage");
      }
      
      // Update the list of user languages
      setUserLanguages(prevLanguages => 
        prevLanguages.filter(lang => lang._id !== preferenceId)
      );
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || "Error removing language preference");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load user's language preferences on mount
  useEffect(() => {
    if (authToken) {
      getLanguagePreferences();
    }
  }, [authToken]);

 
  const selectLanguage = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem("selectedLanguage", JSON.stringify(language));
  };

  return (
    <LanguageContext.Provider
      value={{
        selectedLanguage,
        selectLanguage,
        userLanguages,
        loading,
        error,
        addLanguagePreference,
        getLanguagePreferences,
        removeLanguagePreference,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export default LanguageContext;