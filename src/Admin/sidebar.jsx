import {
  AudioLines, BookOpen, BookText,ChevronDown,ChevronRight,ClipboardList,FileText,GoalIcon,GraduationCap,HelpCircle,Languages,LayoutDashboard,LogOut,SquareStack,Users,Video,
} from "lucide-react";
import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../private/context/authcontext";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isActivitiesOpen, setIsActivitiesOpen] = useState(false);

  const activitiesSubItems = [
    {
      name: "Flashcard",
      icon: SquareStack,
      path: "/admin/activities/flashcard",
    },
    { name: "Audio", icon: AudioLines, path: "/admin/activities/audio" },
    { name: "Video", icon: Video, path: "/admin/activities/video" },
    { name: "Quiz", icon: ClipboardList, path: "/admin/activities/quiz" },
  ];

  const mainSidebarItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Courses", path: "/admin/courses", icon: GraduationCap },
    { name: "Chapter", path: "/admin/chapter", icon: BookText },
    { name: "Goals", path: "/admin/goals", icon: GoalIcon },
    { name: "Lesson", path: "/admin/Lesson", icon: BookOpen },
    { name: "Users", path: "/admin/user", icon: Users },
    { name: "Languages", path: "/admin/Languages", icon: Languages },
  ];

  const isActivityPath = location.pathname.includes("/admin/activities");

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div
      className={`
        ${isSidebarOpen ? "w-64" : "w-20"} 
        bg-white shadow-md transition-all duration-300 ease-in-out relative min-h-screen
        flex flex-col
      `}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {isSidebarOpen && (
          <h1 className="text-xl font-bold text-blue-600">Admin Panel</h1>
        )}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-gray-600 hover:text-blue-600"
        >
          {isSidebarOpen ? "◀" : "▶"}
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1">
        <div className="mt-4">
          {mainSidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center p-3 
                ${
                  location.pathname === item.path
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }
                transition-colors duration-200
              `}
            >
              <item.icon className="mr-3" />
              {isSidebarOpen && <span>{item.name}</span>}
            </Link>
          ))}

          {/* Activities Section */}
          <div>
            <div
              className={`
                flex items-center p-3 cursor-pointer
                ${
                  isActivityPath
                    ? "bg-blue-100 text-blue-600"
                    : "hover:bg-gray-100"
                }
                transition-colors duration-200
              `}
              onClick={() => setIsActivitiesOpen(!isActivitiesOpen)}
            >
              <FileText className="mr-3" />
              {isSidebarOpen && (
                <div className="flex items-center justify-between flex-1">
                  <span>Activities</span>
                  {isActivitiesOpen ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              )}
            </div>

            {/* Activities Dropdown */}
            <div
              className={`
                overflow-hidden transition-all duration-200 ease-in-out bg-gray-50
                ${isActivitiesOpen && isSidebarOpen ? "max-h-48" : "max-h-0"}
              `}
            >
              {activitiesSubItems.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`
                    flex items-center p-2.5 pl-11
                    ${
                      location.pathname === subItem.path
                        ? "bg-blue-50 text-blue-600"
                        : "hover:bg-gray-100"
                    }
                    transition-colors duration-200 text-gray-700
                  `}
                >
                  <subItem.icon className="mr-2 w-4 h-4" />
                  <span className="text-sm">{subItem.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Logout Link */}
          <button
            onClick={handleLogout}
            className={`${"hover:bg-gray-100"} flex items-center p-3 transition-colors duration-200 w-full text-left`}
          >
            <LogOut className="mr-3" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </nav>

      {/* Help & Support Footer */}
      {isSidebarOpen && (
        <div className="p-4 border-t">
          <Link
            to="/admin/help"
            className="flex items-center text-gray-600 hover:text-blue-600"
          >
            <HelpCircle className="mr-3" />
            Help & Support
          </Link>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
