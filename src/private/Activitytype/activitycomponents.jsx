import React, { useState, useRef, useEffect } from "react";

const AudioActivity = ({ activity }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current.duration);
      });

      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current.currentTime);
        setProgress(
          (audioRef.current.currentTime / audioRef.current.duration) * 100
        );
      });

      return () => {
        if (audioRef.current) {
          audioRef.current.removeEventListener("loadedmetadata", () => {});
          audioRef.current.removeEventListener("timeupdate", () => {});
        }
      };
    }
  }, [audioRef]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const repeatAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      <audio
        ref={audioRef}
        src={`http://localhost:3001/${activity.audio}`}
        className="hidden"
      />

      <div className="flex flex-col space-y-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-indigo-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={togglePlay}
          className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 focus:outline-none"
        >
          {isPlaying ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          )}
        </button>

        <button
          onClick={repeatAudio}
          className="bg-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-300 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
        </button>

        {activity.transcript && (
          <button
            onClick={() => setShowTranscript(!showTranscript)}
            className="bg-gray-200 text-gray-700 p-3 rounded-full hover:bg-gray-300 focus:outline-none ml-auto"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </button>
        )}
      </div>

      {showTranscript && activity.transcript && (
        <div className="mt-4 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-medium text-gray-800 mb-2">Transcript:</h3>
          <p className="text-gray-600">{activity.transcript}</p>
        </div>
      )}
    </div>
  );
};

const FlashcardActivity = ({ activity }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [completedCards, setCompletedCards] = useState([]);

  const currentCard = activity.cards[currentCardIndex];

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentCardIndex < activity.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const markComplete = () => {
    if (!completedCards.includes(currentCardIndex)) {
      setCompletedCards([...completedCards, currentCardIndex]);
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Card {currentCardIndex + 1} of {activity.cards.length}
        </span>
        <span>{completedCards.length} cards completed</span>
      </div>

      <div
        className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-105"
        style={{ height: "250px" }}
        onClick={flipCard}
      >
        <div className="relative w-full h-full">
          <div
            className={`absolute w-full h-full flex items-center justify-center p-6 backface-hidden transition-all duration-500 ${
              isFlipped ? "opacity-0 rotate-y-180" : "opacity-100"
            }`}
          >
            <h3 className="text-xl font-medium text-gray-800 text-center">
              {currentCard.front}
            </h3>
          </div>

          <div
            className={`absolute w-full h-full flex items-center justify-center p-6 backface-hidden transition-all duration-500 ${
              isFlipped ? "opacity-100" : "opacity-0 rotate-y-180"
            }`}
          >
            <div className="space-y-4 text-center">
              <p className="text-xl font-medium text-gray-800">
                {currentCard.back}
              </p>

              {currentCard.example && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Example:</p>
                  <p className="text-gray-600 italic">{currentCard.example}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-500">
        {isFlipped ? "Click to see front" : "Click to flip"}
      </div>

      {currentCard.hint && !isFlipped && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-sm text-yellow-700">
            <span className="font-medium">Hint:</span> {currentCard.hint}
          </p>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <button
          onClick={prevCard}
          disabled={currentCardIndex === 0}
          className={`px-4 py-2 rounded-md ${
            currentCardIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          Previous
        </button>

        <div className="flex space-x-2">
          <button
            onClick={markComplete}
            className={`px-4 py-2 rounded-md ${
              completedCards.includes(currentCardIndex)
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {completedCards.includes(currentCardIndex)
              ? "Completed"
              : "Mark as Complete"}
          </button>

          <button
            onClick={flipCard}
            className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-md hover:bg-indigo-200"
          >
            Flip
          </button>
        </div>

        <button
          onClick={nextCard}
          disabled={currentCardIndex === activity.cards.length - 1}
          className={`px-4 py-2 rounded-md ${
            currentCardIndex === activity.cards.length - 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

const QuizActivity = ({ activity }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState(
    activity.completionCriteria?.attemptsAllowed || 3
  );

  const currentQuestion = activity.questions[currentQuestionIndex];

  const handleAnswerSelect = (answer) => {
    if (showResults) return;

    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: answer,
    });
  };

  const getScore = () => {
    let correctCount = 0;

    activity.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        correctCount++;
      }
    });

    return {
      score: correctCount,
      total: activity.questions.length,
      percentage: Math.round((correctCount / activity.questions.length) * 100),
    };
  };

  const isAnswerSelected = (answer) => {
    return selectedAnswers[currentQuestionIndex] === answer;
  };

  const isAnswerCorrect = (answer) => {
    return answer === currentQuestion.correctAnswer;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < activity.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (
      Object.keys(selectedAnswers).length === activity.questions.length
    ) {
      setShowResults(true);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
    setRemainingAttempts((prevAttempts) => prevAttempts - 1);
  };

  const isPassed = () => {
    const scoreData = getScore();
    return (
      scoreData.percentage >= (activity.completionCriteria?.passingScore || 70)
    );
  };

  if (showResults) {
    const scoreData = getScore();

    return (
      <div className="flex flex-col space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold mb-2">
            {isPassed() ? "Congratulations!" : "Quiz Results"}
          </h3>

          <div className="mb-4">
            <div className="inline-block p-4 rounded-full bg-indigo-100 mb-2">
              <span className="text-3xl font-bold text-indigo-600">
                {scoreData.percentage}%
              </span>
            </div>
            <p className="text-gray-600">
              You got {scoreData.score} out of {scoreData.total} questions
              correct
            </p>
          </div>

          {isPassed() ? (
            <div className="bg-green-100 text-green-700 p-4 rounded-lg">
              <p className="font-medium">
                You passed! You can now continue to the next activity.
              </p>
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-700 p-4 rounded-lg">
              <p className="font-medium">
                You need {activity.completionCriteria?.passingScore || 70}% to
                pass.
                {remainingAttempts > 0
                  ? ` You have ${remainingAttempts} attempts remaining.`
                  : " No more attempts remaining."}
              </p>
            </div>
          )}
        </div>

        {!isPassed() && remainingAttempts > 0 && (
          <button
            onClick={resetQuiz}
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex justify-between items-center text-sm text-gray-600">
        <span>
          Question {currentQuestionIndex + 1} of {activity.questions.length}
        </span>
        <span>Remaining attempts: {remainingAttempts}</span>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-medium text-gray-800 mb-4">
          {currentQuestion.question}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => handleAnswerSelect(option)}
              className={`p-4 border rounded-lg cursor-pointer transition-all ${
                isAnswerSelected(option)
                  ? showResults
                    ? isAnswerCorrect(option)
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-indigo-500 bg-indigo-50"
                  : showResults && isAnswerCorrect(option)
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-indigo-200 hover:bg-indigo-50"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-6 h-6 flex-shrink-0 rounded-full border ${
                    isAnswerSelected(option)
                      ? "border-indigo-500 bg-indigo-500"
                      : "border-gray-300"
                  } mr-3`}
                >
                  {isAnswerSelected(option) && (
                    <svg
                      className="w-6 h-6 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  )}
                </div>
                <span className="text-gray-700">{option}</span>
              </div>
            </div>
          ))}
        </div>

        {showResults && currentQuestion.explanation && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-700">
              <span className="font-medium">Explanation:</span>{" "}
              {currentQuestion.explanation}
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`px-4 py-2 rounded-md ${
            currentQuestionIndex === 0
              ? "text-gray-400 cursor-not-allowed"
              : "text-indigo-600 hover:bg-indigo-50"
          }`}
        >
          Previous
        </button>

        <button
          onClick={nextQuestion}
          disabled={!selectedAnswers[currentQuestionIndex]}
          className={`px-6 py-2 rounded-md ${
            !selectedAnswers[currentQuestionIndex]
              ? "bg-gray-200 text-gray-500 cursor-not-allowed"
              : currentQuestionIndex === activity.questions.length - 1
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
        >
          {currentQuestionIndex === activity.questions.length - 1 &&
          Object.keys(selectedAnswers).length === activity.questions.length
            ? "Finish Quiz"
            : "Next"}
        </button>
      </div>
    </div>
  );
};

export { AudioActivity, FlashcardActivity, QuizActivity };
