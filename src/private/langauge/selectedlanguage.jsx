import React, { useState } from "react";
import LanguageCard from "./LanguageCard";

const LanguageSelection = () => {
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const handleCardClick = (language) => {
    setSelectedLanguage(language);
    console.log(`You selected: ${language.languageName}`);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-50">
      <div className="text-center">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">
          Which language do you want to learn?
        </h1>
      </div>
      <div className="flex flex-wrap gap-4 justify-center p-4">
        <LanguageCard
          onCardClick={handleCardClick}
          selectedLanguage={selectedLanguage}
        />
      </div>
      {selectedLanguage && (
        <p className="mt-4 text-center text-lg font-medium">
          Selected Language: {selectedLanguage.languageName}
        </p>
      )}
    </div>
  );
};

export default LanguageSelection;
