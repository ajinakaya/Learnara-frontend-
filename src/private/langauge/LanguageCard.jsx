import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LanguageContext from "../context/languagecontext";

const LanguageCard = () => {
  const { selectedLanguage, selectLanguage } = useContext(LanguageContext);
  const [languages, setLanguages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(
          "/preferred-language/preferredlanguages"
        );
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error.message);
      }
    };

    fetchLanguages();
  }, []);

  // Handle language selection and store it in localStorage
  const handleLanguageSelect = (language) => {
    selectLanguage(language);
    localStorage.setItem("selectedLanguage", JSON.stringify(language)); // Save selected language in localStorage
  };

  const handleContinue = () => {
    if (selectedLanguage) {
      console.log("Language preference will be saved:", selectedLanguage);
      navigate("/auth/login");
    } else {
      alert("Please select a language before continuing.");
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 gap-5">
        {languages.map((language) => (
          <div
            key={language._id}
            className={`flex flex-col items-center justify-center bg-white shadow-lg rounded-xl p-4 cursor-pointer hover:shadow-xl transition w-32 h-32 border ${
              selectedLanguage?._id === language._id
                ? "bg-blue-100 border-blue-500"
                : "border-gray-200"
            }`}
            onClick={() => handleLanguageSelect(language)}
          >
            <img
              src={`http://localhost:3001/${language.languageImage}`}
              alt={language.languageName}
              className="w-16 h-16 rounded-full mb-2 object-cover"
            />
            <h3 className="text-sm font-semibold text-center">
              {language.languageName}
            </h3>
          </div>
        ))}
      </div>

      {selectedLanguage && (
        <div className="flex justify-end mt-10">
          <button
            onClick={handleContinue}
            className="px-8 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageCard;
