import axios from "axios";
import {
  BarChart,
  Book,
  BookOpen,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Circle,
  Clock,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/navbar";

const ChapterPage = () => {
  const { id } = useParams();
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [completedLessons, setCompletedLessons] = useState({});
  const [viewedChapters, setViewedChapters] = useState({});

  useEffect(() => {
    const fetchChapters = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/course/course/${id}`
        );
        console.log(response.data);
        setChapters(response.data.chapters || []);
        setCourseTitle(response.data.title || "Course Content");

        if (response.data.chapters && response.data.chapters.length > 0) {
          setExpandedChapter(response.data.chapters[0]._id);
        }

        // Initialize completion status from localStorage
        const savedLessonCompletions = localStorage.getItem(
          `course_${id}_lesson_completions`
        );
        if (savedLessonCompletions) {
          setCompletedLessons(JSON.parse(savedLessonCompletions));
        }

        const savedViewedChapters = localStorage.getItem(
          `course_${id}_viewed_chapters`
        );
        if (savedViewedChapters) {
          setViewedChapters(JSON.parse(savedViewedChapters));
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChapters();
  }, [id]);

  const handleStart = (id, chapterId) => {
    navigate(`/sublesson/${id}`);
  };

  const toggleChapter = (chapterId) => {
    if (expandedChapter === chapterId) {
      setExpandedChapter(null);
    } else {
      setExpandedChapter(chapterId);

      // Mark chapter as viewed when expanded
      if (!viewedChapters[chapterId]) {
        const updatedViewedChapters = {
          ...viewedChapters,
          [chapterId]: true,
        };
        setViewedChapters(updatedViewedChapters);
        localStorage.setItem(
          `course_${id}_viewed_chapters`,
          JSON.stringify(updatedViewedChapters)
        );
      }
    }
  };

  // Mark a chapter as complete manually (for chapters without sublessons)
  const markChapterAsComplete = (chapterId, e) => {
    e.stopPropagation();

    const updatedViewedChapters = {
      ...viewedChapters,
      [chapterId]: true,
    };
    setViewedChapters(updatedViewedChapters);
    localStorage.setItem(
      `course_${id}_viewed_chapters`,
      JSON.stringify(updatedViewedChapters)
    );
  };

  // Check if a chapter is complete
  const isChapterComplete = (chapter) => {
    // If chapter has sublessons, check if all are completed
    if (chapter.subLessons && chapter.subLessons.length > 0) {
      return chapter.subLessons.every((sublesson) => {
        const lessonId =
          sublesson._id || `sublesson-${chapter.subLessons.indexOf(sublesson)}`;
        return completedLessons[`${chapter._id}_${lessonId}`] === true;
      });
    }
    // If chapter has no sublessons, check if it has been viewed
    else {
      return viewedChapters[chapter._id] === true;
    }
  };

  // Calculate course progress
  const calculateProgress = () => {
    if (!chapters.length) return 0;

    const completedChaptersCount = chapters.filter((chapter) =>
      isChapterComplete(chapter)
    ).length;
    return Math.floor((completedChaptersCount / chapters.length) * 100);
  };

  // Mark a lesson as completed
  const markLessonComplete = (chapterId, lessonId, e) => {
    e.stopPropagation();

    const updatedCompletions = {
      ...completedLessons,
      [`${chapterId}_${lessonId}`]: true,
    };
    setCompletedLessons(updatedCompletions);
    localStorage.setItem(
      `course_${id}_lesson_completions`,
      JSON.stringify(updatedCompletions)
    );
  };

  // Count completed lessons in a chapter
  const getCompletedLessonsCount = (chapter) => {
    if (!chapter.subLessons) return 0;

    return chapter.subLessons.filter((sublesson) => {
      const lessonId =
        sublesson._id || `sublesson-${chapter.subLessons.indexOf(sublesson)}`;
      return completedLessons[`${chapter._id}_${lessonId}`] === true;
    }).length;
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-red-500 text-xl mb-2">Error loading course</div>
        <div className="text-gray-600">{error}</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 font-poppins">
      <Navbar />
      <div className="max-w-5xl mx-auto py-10 px-6">
        {/* Course Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{courseTitle}</h1>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span className="text-gray-600">{chapters.length} Chapters</span>
              <span className="mx-2 text-gray-300">•</span>
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-gray-600">
                {chapters.reduce(
                  (total, chapter) => total + (chapter.estimatedDuration || 0),
                  0
                )}{" "}
                mins total
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart className="h-5 w-5 text-green-600" />
              <div className="flex items-center">
                <div className="w-48 h-2 bg-gray-200 rounded-full mr-2">
                  <div
                    className="h-2 bg-green-500 rounded-full"
                    style={{ width: `${calculateProgress()}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {calculateProgress()}% complete
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="space-y-4">
          {Array.isArray(chapters) && chapters.length > 0 ? (
            chapters.map((chapter, index) => {
              const chapterComplete = isChapterComplete(chapter);
              const hasSublessons =
                chapter.subLessons && chapter.subLessons.length > 0;
              const completedLessonsCount = getCompletedLessonsCount(chapter);
              const totalLessonsCount = hasSublessons
                ? chapter.subLessons.length
                : 0;

              return (
                <div
                  key={chapter._id || `chapter-${index}`}
                  className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300"
                >
                  <div
                    onClick={() => toggleChapter(chapter._id)}
                    className={`p-5 flex items-center gap-4 transition cursor-pointer ${
                      expandedChapter === chapter._id
                        ? "bg-blue-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                        chapterComplete
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400"
                      }`}
                    >
                      {chapterComplete ? (
                        <CheckCircle className="h-6 w-6" />
                      ) : (
                        <Circle className="h-6 w-6" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <div className="text-sm text-gray-500 font-medium">
                        Chapter {index + 1}
                      </div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {chapter.title}
                      </h2>
                      {hasSublessons && (
                        <div className="text-sm text-gray-500 mt-1">
                          {completedLessonsCount} of {totalLessonsCount} lessons
                          completed
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-500 mr-2">
                      <Clock className="h-5 w-5" />
                      <span>{chapter.estimatedDuration} mins</span>
                    </div>
                    <div
                      className={`rounded-full p-1 ${
                        expandedChapter === chapter._id
                          ? "bg-blue-100 text-blue-600"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {expandedChapter === chapter._id ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </div>
                  </div>

                  {expandedChapter === chapter._id && (
                    <div className="border-t border-gray-100 transition-all duration-300">
                      <div className="p-5 bg-white">
                        <div className="prose max-w-none text-gray-700">
                          <p className="leading-relaxed">
                            {chapter.description}
                          </p>
                        </div>

                        {/* Mark as Complete button for chapters without sublessons */}
                        {!hasSublessons && !chapterComplete && (
                          <div className="mt-4">
                            <button
                              className="px-4 py-2 bg-blue-100 text-blue-600 rounded-md font-medium hover:bg-blue-200 transition"
                              onClick={(e) =>
                                markChapterAsComplete(chapter._id, e)
                              }
                            >
                              Mark as Complete
                            </button>
                          </div>
                        )}
                      </div>

                      {chapter.learningObjectives?.length > 0 && (
                        <div className="p-5 border-t border-gray-100 bg-gray-50">
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800">
                            <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
                              <BarChart className="h-4 w-4" />
                            </div>
                            Learning Objectives
                          </h3>
                          <ul className="space-y-2 pl-8">
                            {chapter.learningObjectives.map((objective, i) => (
                              <li
                                key={`objective-${chapter._id}-${i}`}
                                className="relative pl-2 text-gray-700"
                              >
                                <div className="absolute left-0 top-0 -ml-8 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                                  {i + 1}
                                </div>
                                {objective}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {hasSublessons && (
                        <div className="p-5 border-t border-gray-100">
                          <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-gray-800">
                            <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
                              <Book className="h-4 w-4" />
                            </div>
                            Lessons
                          </h3>
                          <div className="space-y-2 mt-4">
                            {chapter.subLessons.map((sublesson, i) => {
                              const lessonId =
                                sublesson._id || `sublesson-${i}`;
                              const isLessonCompleted =
                                completedLessons[
                                  `${chapter._id}_${lessonId}`
                                ] === true;

                              return (
                                <div
                                  key={lessonId}
                                  className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-lg hover:border-blue-200 hover:bg-blue-50 transition cursor-pointer shadow-sm"
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                      isLessonCompleted
                                        ? "bg-green-100 text-green-600"
                                        : "bg-blue-100 text-blue-600"
                                    }`}
                                  >
                                    {isLessonCompleted ? (
                                      <CheckCircle className="h-4 w-4" />
                                    ) : (
                                      i + 1
                                    )}
                                  </div>
                                  <div className="flex-grow">
                                    <h4 className="font-medium text-gray-800">
                                      {sublesson.title}
                                    </h4>
                                  </div>
                                  <button
                                    className={`px-4 py-1 rounded-md font-medium ${
                                      isLessonCompleted
                                        ? "bg-green-100 text-green-600"
                                        : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                                    }`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      markLessonComplete(
                                        chapter._id,
                                        lessonId,
                                        e
                                      );
                                      handleStart(lessonId);
                                    }}
                                  >
                                    {isLessonCompleted ? "Completed" : "Start"}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center p-8 bg-white rounded-xl shadow-md">
              <div className="text-gray-400 text-lg mb-2">
                No chapters found
              </div>
              <p className="text-gray-500">
                This course doesn't have any content yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChapterPage;
