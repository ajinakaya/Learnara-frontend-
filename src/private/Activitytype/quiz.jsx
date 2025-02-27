import React, { useState, useEffect } from 'react';
import { Check, X, HelpCircle, ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

const QuizActivity = ({ activity }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });
  
  const currentQuestion = activity.questions[currentQuestionIndex];
  const totalQuestions = activity.questions.length;
  
  // Calculate score percentage
  const scorePercentage = quizCompleted 
    ? Math.round((score.correct / score.total) * 100) 
    : 0;
    
  const isPassing = scorePercentage >= activity.completionCriteria.passingScore;
  
  const handleOptionSelect = (option) => {
    if (!selectedAnswer) {
      setSelectedAnswer(option);
      
      // Save the answer
      const isCorrect = option === currentQuestion.correctAnswer;
      const newAnswers = [...answers];
      newAnswers[currentQuestionIndex] = {
        questionIndex: currentQuestionIndex,
        selectedOption: option,
        isCorrect
      };
      setAnswers(newAnswers);
    }
  };
  
  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      resetQuestionState();
    } else if (!quizCompleted) {
      // Calculate final score
      const correctCount = answers.filter(answer => answer && answer.isCorrect).length;
      setScore({ correct: correctCount, total: totalQuestions });
      setQuizCompleted(true);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      resetQuestionState();
    }
  };
  
  const resetQuestionState = () => {
    // Restore any previous answer for this question
    const previousAnswer = answers[currentQuestionIndex];
    if (previousAnswer) {
      setSelectedAnswer(previousAnswer.selectedOption);
    } else {
      setSelectedAnswer('');
    }
    setShowExplanation(false);
  };
  
  // Set previous answer when changing questions
  useEffect(() => {
    resetQuestionState();
  }, [currentQuestionIndex]);
  
  // Results view
  if (quizCompleted) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4">
        <h3 className="text-lg font-semibold mb-4">{activity.title} - Results</h3>
        
        <div className="text-center py-4">
          <div className={`text-2xl font-bold mb-2 ${isPassing ? 'text-green-500' : 'text-red-500'}`}>
            {isPassing ? 'Quiz Passed!' : 'Quiz Failed'}
          </div>
          
          <div className="text-3xl font-bold mb-4">
            {score.correct}/{score.total} Correct
          </div>
          
          <div className="w-full max-w-md mx-auto mb-6">
            <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full ${isPassing ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
            <div className="text-sm text-gray-500 mt-1">
              {scorePercentage}% (Passing: {activity.completionCriteria.passingScore}%)
            </div>
          </div>
          
          <button
            onClick={() => {
              setCurrentQuestionIndex(0);
              setSelectedAnswer('');
              setShowExplanation(false);
              setQuizCompleted(false);
              setAnswers([]);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
        
        {/* List all questions with answers */}
        <div className="mt-8">
          <h4 className="font-medium mb-4">Review your answers:</h4>
          <div className="space-y-4">
            {activity.questions.map((question, index) => {
              const answer = answers[index];
              const isCorrect = answer?.isCorrect || false;
              
              return (
                <div key={index} className="p-3 border rounded-md">
                  <div className="flex items-start">
                    <span className={`flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full mr-2 ${
                      isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {isCorrect ? <Check size={14} /> : <X size={14} />}
                    </span>
                    <div>
                      <p className="font-medium">{question.question}</p>
                      <div className="mt-2 text-sm">
                        <div className="text-gray-600">Your answer: {answer?.selectedOption || 'Not answered'}</div>
                        <div className="text-green-600">Correct answer: {question.correctAnswer}</div>
                        {question.explanation && (
                          <div className="mt-1 text-gray-500">{question.explanation}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{activity.title}</h3>
        <span className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {totalQuestions}</span>
      </div>
      
      {/* Progress bar */}
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-6">
        <div 
          className="h-full bg-blue-500 transition-all"
          style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
        />
      </div>
      
      {/* Question */}
      <div className="mb-6">
        <p className="text-lg font-medium mb-4">{currentQuestion?.question}</p>
        
        {/* Options */}
        <div className="space-y-2">
          {currentQuestion?.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const isCorrect = selectedAnswer && option === currentQuestion.correctAnswer;
            const isWrong = isSelected && selectedAnswer !== currentQuestion.correctAnswer;
            
            let optionClassName = "block w-full text-left p-3 border rounded-md transition";
            
            if (isSelected) {
              if (isCorrect) {
                optionClassName += " bg-green-50 border-green-300";
              } else if (isWrong) {
                optionClassName += " bg-red-50 border-red-300";
              } else {
                optionClassName += " bg-blue-50 border-blue-300";
              }
            } else {
              optionClassName += " hover:bg-gray-50";
              
              // Show correct answer if another option was selected
              if (selectedAnswer && option === currentQuestion.correctAnswer) {
                optionClassName += " bg-green-50 border-green-300";
              }
            }
            
            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(option)}
                disabled={!!selectedAnswer}
                className={optionClassName}
              >
                <div className="flex items-center">
                  <span className="mr-3 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center">
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span>{option}</span>
                  
                  {isSelected && (
                    <span className="ml-auto">
                      {isCorrect ? 
                        <Check size={20} className="text-green-500" /> : 
                        <X size={20} className="text-red-500" />
                      }
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      
      {/* Explanation */}
      {selectedAnswer && currentQuestion?.explanation && (
        <div className="mb-6">
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="flex items-center text-blue-500 hover:text-blue-700"
          >
            <HelpCircle size={16} className="mr-1" />
            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          </button>
          
          {showExplanation && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-100 rounded-md">
              <p className="text-sm">{currentQuestion.explanation}</p>
            </div>
          )}
        </div>
      )}
      
      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={prevQuestion}
          disabled={currentQuestionIndex === 0}
          className={`flex items-center py-2 px-4 rounded-md ${
            currentQuestionIndex === 0 ? 'text-gray-300' : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          <ChevronLeft size={20} className="mr-1" />
          Previous
        </button>
        
        <button
          onClick={nextQuestion}
          disabled={!selectedAnswer}
          className={`flex items-center py-2 px-4 rounded-md ${
            !selectedAnswer 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {currentQuestionIndex < totalQuestions - 1 ? (
            <>Next <ChevronRight size={20} className="ml-1" /></>
          ) : (
            <>Finish <CheckCircle size={20} className="ml-1" /></>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizActivity;