import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle } from 'lucide-react';

const AudioActivity = ({ activity }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [completed, setCompleted] = useState(false);
  const audioRef = useRef(null);
  
  // Update progress while playing
  useEffect(() => {
    const updateProgress = () => {
      if (audioRef.current) {
        const duration = audioRef.current.duration || 1;
        const currentTime = audioRef.current.currentTime;
        setCurrentTime(currentTime);
        setProgress((currentTime / duration) * 100);
        
        // Check for completion
        if (progress >= activity.completionCriteria.listenPercentage) {
          setCompleted(true);
        }
      }
    };
    
    const interval = setInterval(updateProgress, 1000);
    return () => clearInterval(interval);
  }, [progress, activity.completionCriteria.listenPercentage]);
  
  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };
  
  const resetAudio = () => {
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
    setProgress(0);
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Calculate total duration in MM:SS format
  const totalDuration = formatTime(activity.duration);
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{activity.title}</h3>
        {completed && (
          <span className="flex items-center text-green-500">
            <CheckCircle size={16} className="mr-1" />
            Completed
          </span>
        )}
      </div>
      
      <p className="text-gray-600 mb-4">{activity.description}</p>
      
      <div className="space-y-3">
        <audio ref={audioRef} src={`http://localhost:3001/${activity.audio}`} onEnded={() => setIsPlaying(false)} className="hidden" />
        
        <div className="flex items-center space-x-4">
          <button 
            onClick={togglePlay}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          
          <button 
            onClick={resetAudio}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
          >
            <RotateCcw size={16} />
          </button>
          
          <div className="flex-1">
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          <span className="text-sm text-gray-500">
            {formatTime(currentTime)} / {totalDuration}
          </span>
        </div>
        
        {activity.transcript && (
          <div className="p-3 bg-gray-50 rounded-md mt-4 text-gray-700">
            <h4 className="font-medium mb-2">Transcript:</h4>
            <p>{activity.transcript}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AudioActivity;