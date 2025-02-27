import axios from "axios";
import {
  Bell,
  BookText,
  ChartNoAxesCombined,
  ChevronDown,
  Goal,
  GraduationCap,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import { useLanguage } from "../context/languagecontext";

const Navbar = () => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [languages, setLanguages] = useState([]);
  const languageMenuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const { logout, user, authToken, loading } = useAuth();
  const token = authToken || localStorage.getItem("authToken");
  const navigate = useNavigate();
  const {
    selectedLanguage,
    selectLanguage,
    userLanguages,
    getLanguagePreferences,
  } = useLanguage();

  const fetchLanguages = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/preferred-language/preferredlanguages"
      );
      setLanguages(response.data);
    } catch (error) {
      console.error("Error fetching languages:", error.message);
    }
  };

  useEffect(() => {
    getLanguagePreferences();
    fetchLanguages();
  }, []);

  console.log(user);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/notifications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Fetched Notifications:", response.data);
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [token]);

  const markAsRead = async (id) => {
    try {
      await axios.patch(
        `http://localhost:3001/notifications/${id}`,
        { read: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // Function to close all dropdowns
  const closeAllMenus = () => {
    setShowProfileMenu(false);
    setShowNotifications(false);
    setShowLanguageMenu(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target) &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target)
      ) {
        closeAllMenus();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleLanguageSelect = async (language) => {
    try {
      await axios.post(
        "http://localhost:3001/language/language",
        { languageId: language._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      selectLanguage(language);
      setShowLanguageMenu(false);
    } catch (error) {
      console.error("Error selecting language:", error.message);
    }
  };

  const LanguageSelect = (language) => {
    selectLanguage(language);
    setShowLanguageMenu(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-md font-poppins">
      <div className="max-w-8xl mx-auto px-4 sm:px-7">
        <div className="flex justify-between items-center h-16">
          {/* Left section with logo */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-1">
              <img
                src="src/assets/logo-Photoroom.png"
                alt="Learnara Logo"
                className="w-10 h-10"
              />
              <span className="text-2xl font-bold text-blue-600">Learnara</span>
            </div>

            {/* Main navigation links */}
            <div className="hidden md:flex items-center space-x-6">
              <a
                href="/learn"
                className={`flex items-center ${
                  location.pathname === "/learn"
                    ? "text-blue-600 font-bold"
                    : "text-gray-700"
                } hover:text-blue-600`}
              >
                <BookText className="w-5 h-5 mr-1" />
                Learn
              </a>
              <a
                href="/progress"
                className={`flex items-center ${
                  location.pathname === "/progress"
                    ? "text-blue-600 font-bold"
                    : "text-gray-700"
                } hover:text-blue-600`}
              >
                <ChartNoAxesCombined className="w-5 h-5 mr-1" />
                Progress
              </a>
              <a
                href="/coursepage"
                className={`flex items-center ${
                  location.pathname === "/coursepage"
                    ? "text-blue-600 font-bold"
                    : "text-gray-700"
                } hover:text-blue-600`}
              >
                <GraduationCap className="w-5 h-5 mr-1" />
                Course
              </a>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Language selector */}
            <div className="relative" ref={languageMenuRef}>
              <button
                className="flex items-center space-x-2 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => {
                  closeAllMenus();
                  setShowLanguageMenu(!showLanguageMenu);
                }}
              >
                {selectedLanguage && (
                  <>
                    <img
                      src={`http://localhost:3001/${selectedLanguage.languageImage}`}
                      alt={`${selectedLanguage.languageName} flag`}
                      className="w-5 h-5 rounded-sm"
                    />
                    <span className="text-sm text-gray-700">
                      {selectedLanguage.languageName}
                    </span>
                  </>
                )}
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {/* Language Dropdown */}
              {showLanguageMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  {/* Upper Part - User Languages */}
                  {userLanguages.length > 0 && (
                    <div className="px-4 py-2">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        {" "}
                        Selected Languages
                      </div>
                      {userLanguages.map((language) => (
                        <button
                          key={language._id}
                          onClick={() => LanguageSelect(language)}
                          className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                        >
                          <img
                            src={`http://localhost:3001/${language.languageImage}`}
                            alt={`${language.languageName} flag`}
                            className="w-5 h-5 rounded-sm"
                          />
                          <span>{language.languageName}</span>
                        </button>
                      ))}
                      <div className="my-2 border-t border-gray-200" />
                    </div>
                  )}

                  {/* Lower Part - Available Languages */}
                  {languages.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500"></div>
                  ) : (
                    languages.map((language) => (
                      <button
                        key={language._id}
                        onClick={() => handleLanguageSelect(language)}
                        className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                      >
                        <img
                          src={`http://localhost:3001/${language.languageImage}`}
                          alt={`${language.languageName} flag`}
                          className="w-5 h-5 rounded-sm"
                        />
                        <span>{language.languageName}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full">
              <a
                href="/goals"
                className={`flex items-center ${
                  location.pathname === "/goals"
                    ? "text-blue-600 font-bold"
                    : "text-gray-700"
                } hover:text-blue-600`}
              >
                <Goal className="w-5 h-5" />
              </a>
            </button>

            {/* Notification dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-100 rounded-full"
              >
                <Bell className="w-5 h-5" />

                {/* Show red dot if there are unread notifications */}
                {notifications.some((notification) => !notification.read) && (
                  <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full"></span>
                )}
              </button>

              {/* Notifications dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 border border-gray-200 max-h-80 overflow-auto">
                  {/* Notification Heading */}
                  <div className="px-4 py-2 text-gray-700 font-medium flex items-center">
                    <Bell className="w-5 h-5 mr-2 text-blue-600" />
                    <span>Notifications</span>
                  </div>
                  <div className="border-t border-gray-200" />{" "}
                  {/* Divider between heading and notifications */}
                  {/* Notifications List */}
                  {notifications.length === 0 ? (
                    <div className="px-4 py-2 text-gray-500">
                      No notifications.
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        className={`px-4 py-2 text-sm text-gray-700 cursor-pointer ${
                          notification.read ? "bg-gray-100" : "bg-gray-50"
                        }`}
                        onClick={() => markAsRead(notification._id)}
                      >
                        <span>
                          {notification.message
                            ? notification.message
                            : "No message available"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Profile menu */}
            <div className="relative" ref={profileMenuRef}>
              <button
                className="flex items-center space-x-2"
                onClick={() => {
                  closeAllMenus();
                  setShowProfileMenu(!showProfileMenu);
                }}
              >
                {/* Check if user exists before attempting to display image */}
                {user && user.image ? (
                  <img
                    src={`http://localhost:3001/${user.image}`}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div> // Fallback for no image
                )}
              </button>

              {/* Profile Dropdown */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 border border-gray-200">
                  <a
                    href="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
