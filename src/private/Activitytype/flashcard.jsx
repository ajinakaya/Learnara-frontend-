import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, RotateCw, Lightbulb, BookOpen, Check } from 'lucide-react';

const FlashcardActivity = ({ activity }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showExample, setShowExample] = useState(false);
  const [cardsReviewed, setCardsReviewed] = useState(0);
  const [completed, setCompleted] = useState(false);

  const currentCard = activity.cards[currentCardIndex];
  const totalCards = activity.cards.length;

  useEffect(() => {
    if (cardsReviewed === totalCards) {
      setCompleted(true);
    }
  }, [cardsReviewed, totalCards]);

  const flipCard = () => {
    setFlipped(!flipped);
  };

  const nextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setFlipped(false);
      setShowHint(false);
      setShowExample(false);
      setCardsReviewed(cardsReviewed + 1);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setFlipped(false);
      setShowHint(false);
      setShowExample(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{activity.title}</h3>
        {completed && (
          <span className="flex items-center text-green-500">
            <Check size={16} className="mr-1" />
            Completed
          </span>
        )}
      </div>

      <p className="text-gray-600 mb-4">{activity.description}</p>

      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>Card {currentCardIndex + 1} of {totalCards}</span>
      </div>

      {/* Flashcard */}
      <div 
        className="relative w-full h-64 perspective-1000 cursor-pointer mb-4"
        onClick={flipCard}
      >
        <div className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${flipped ? 'rotate-y-180' : ''}`}>
          {/* Front */}
          <div className="absolute w-full h-full bg-blue-50 rounded-lg border border-blue-200 flex items-center justify-center p-6 backface-hidden">
            <p className="text-xl text-center font-medium">{currentCard?.front}</p>
          </div>
          
          {/* Back */}
          <div className="absolute w-full h-full bg-blue-500 text-white rounded-lg flex items-center justify-center p-6 transform rotate-y-180 backface-hidden">
            <p className="text-xl text-center">{currentCard?.back}</p>
          </div>
        </div>
      </div>

      {/* Hints & Examples */}
      <div className="flex flex-wrap gap-2 mb-4">
        {currentCard?.hint && (
          <div className="w-full">
            <button 
              className={`flex items-center text-sm ${showHint ? 'text-yellow-600' : 'text-gray-500'} hover:text-yellow-600`}
              onClick={() => setShowHint(!showHint)}
            >
              <Lightbulb size={16} className="mr-1" />
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
            
            {showHint && (
              <div className="mt-2 p-3 bg-yellow-50 border border-yellow-100 rounded-md">
                <p className="text-sm">{currentCard.hint}</p>
              </div>
            )}
          </div>
        )}
        
        {currentCard?.example && (
          <div className="w-full">
            <button 
              className={`flex items-center text-sm ${showExample ? 'text-green-600' : 'text-gray-500'} hover:text-green-600`}
              onClick={() => setShowExample(!showExample)}
            >
              <BookOpen size={16} className="mr-1" />
              {showExample ? 'Hide Example' : 'Show Example'}
            </button>
            
            {showExample && (
              <div className="mt-2 p-3 bg-green-50 border border-green-100 rounded-md">
                <p className="text-sm">{currentCard.example}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevCard}
          disabled={currentCardIndex === 0}
          className={`flex items-center p-2 rounded-md ${
            currentCardIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={20} />
        </button>

        <button 
          onClick={flipCard}
          className="flex items-center p-2 text-blue-500 hover:bg-blue-50 rounded-md"
        >
          <RotateCw size={20} className="mr-1" />
          Flip
        </button>

        <button
          onClick={nextCard}
          disabled={currentCardIndex === totalCards - 1}
          className={`flex items-center p-2 rounded-md ${
            currentCardIndex === totalCards - 1 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default FlashcardActivity;
