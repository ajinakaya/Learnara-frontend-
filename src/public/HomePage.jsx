import { Award, ChevronLeft, ChevronRight, BookOpen, Target, Star, Globe2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const HomePage = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch languages
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get("/preferred-language/preferredlanguages");
        setLanguages(response.data);
      } catch (error) {
        console.error("Error fetching languages:", error.message);
      }
    };

    fetchLanguages();
  }, []);

  // Handle language selection
  const handleLanguageSelect = async (language) => {
    setSelectedLanguage(language);
    try {
      await axios.post("/language/language", { languageId: language._id });
      console.log("Language selection saved successfully");
    } catch (error) {
      console.error("Error saving selected language:", error.message);
    }
  };

    // Navigation functions
    const handleNext = () => {
      setCurrentIndex((prevIndex) => 
        Math.min(prevIndex + 1, languages.length - 5)
      );
    };
  
    const handlePrev = () => {
      setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };
  
    // Get visible languages
    const visibleLanguages = languages.slice(currentIndex, currentIndex + 5);
  

  // Navigation logo component
  const Logo = () => (
    <div className="flex items-center">
      <img src="src/assets/logo-Photoroom.png" 
        alt="Logo" 
        className="w-12 h-12 mr-0" />
      <span className={`text-2xl font-bold ${isScrolled ? 'text-blue-600' : 'text-white'}`}>Learnara</span>
    </div>
  );

  const features = [
    {
      icon: <BookOpen className="w-12 h-12 text-blue-600 font-poppins" />,
      title: "Expert-Crafted Lessons",
      description: "Learn with structured courses designed by language experts and native speakers."
    },
    {
      icon: <Target className="w-12 h-12 text-blue-600 font-poppins" />, 
      title: "Goal",
      description: "Achieve fluency with structured lessons and engaging exercises designed for your success."
    },
    {
      icon: <Star className="w-12 h-12 text-blue-600 font-poppins" />,
      title: "Personalized Learning",
      description: "Adaptive technology that adjusts to your learning pace and style."
    },
    {
      icon: <Globe2 className="w-12 h-12 text-blue-600 font-poppins" />,
      title: "Cultural Immersion",
      description: "Gain cultural insights while learning the language for a more authentic experience."
    }
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Navigation */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white border-b border-gray-200' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="flex items-center gap-4">
            <Link to="/languagepage">
              <button className={`px-6 py-2 font-medium rounded-full ${isScrolled ? 'text-blue-600 hover:bg-blue-50' : 'text-white hover:bg-white/10'}`}>
                Learn for free
              </button>
              </Link>
              <Link to="/auth/login">
              <button className={`px-6 py-2 font-medium rounded-full ${isScrolled ? 'text-blue-600 border border-blue-600 hover:bg-blue-50' : 'text-white border  hover:bg-white/10'}`}>
                Log in   
              </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-purple-600 pt-24 pb-20 font-poppins">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Left Column - Text Content */}
            <div className="md:w-1/2 text-white max-w-lg">
              <h1 className="text-4xl font-bold leading-tight mb-6">
                New language, new opportunities, new you
              </h1>
              <p className="text-lg mb-8">
                Master languages quickly with expert-designed lessons and practical tools that make learning fun and effective.
              </p>
              <Link to="/languagepage">
              <button className="px-8 py-4 bg-emerald-400 text-white rounded-full font-medium hover:bg-emerald-500 transition-colors">
                Learn for free
              </button>
              </Link>
            </div>

            {/* Right Column - Interactive Image */}
            <div className="md:w-1/2 relative">
              <div className="relative z-10">
                <img 
                  src="src/assets/busuu-header-hello.png" 
                  alt="Language Learning"
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

         {/* Language Selection */}
         <div className="py-16 bg-gray-50 font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-4xl font-bold text-center mb-14 font-poppins">Which language do you want to learn?</h2>
          <div className="relative">
            <button 
              className={`absolute left-40 top-1/2 -translate-y-1/2 p-2 bg-white shadow-lg rounded-full ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              onClick={handlePrev}
              disabled={currentIndex === 0}
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex justify-center gap-20 overflow-hidden py-4">
              {visibleLanguages.map((language) => (
                <div 
                  key={language._id} 
                  className="flex flex-col items-center cursor-pointer group transition-transform duration-300"
                  onClick={() => setSelectedLanguage(language)}
                >
                  <div className="w-25 h-25 flex items-center justify-center bg-white shadow-lg rounded-full mb-2 group-hover:bg-gray-200">
                    <img 
                     src={`http://localhost:3001/${language.languageImage}`}
                      alt={language.languageName} 
                      className="w-16 h-16 rounded-full "
                    />
                  </div>
                  <span className="text-gray-600 font-poppins">{language.languageName}</span>
                </div>
              ))}
            </div>
            <button 
              className={`absolute right-40 top-1/2 -translate-y-1/2 p-2 bg-white shadow-lg rounded-full ${currentIndex >= languages.length - 5 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
              onClick={handleNext}
              disabled={currentIndex >= languages.length - 5}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Features Section */}
      <div className="py-6 bg-gray-50 font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-bold text-center mb-9 font-poppins6">Why learn a language with Learnara?</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Features Section */}
      <div className="py-20 bg-gray-50 font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* <h2 className="text-3xl font-bold text-center mb-16">Why learn a language with Learnara?</h2> */}
          
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Column - Interactive Cards */}
            <div className="relative">
              {/* Notification Card */}
              <div className="bg-white rounded-xl shadow-lg p-4 max-w-sm mb-4 transform -rotate-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src="src\assets\homepage.jpeg" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-medium">Use flashcards to memorize new vocabulary faster!</p>
                  </div>
                </div>
              </div>

              {/* Chat Card */}
              <div className="bg-white rounded-xl shadow-lg p-4 max-w-sm ml-8 transform rotate-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden">
                    <img src="src\assets\homepage.jpeg" alt="User" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">Kenjiro</span>
                      <span className="text-sm text-gray-500">Japan</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <p className="text-gray-800 mb-1">ビールはいますか。</p>
                      <p className="text-gray-800">ビールはありますか。</p>
                      <p className="text-green-500 mt-2">Well done!</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            

            {/* Right Column - Text Content */}
            <div>
              <div className="mb-4 font-poppins">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                  AN INTERACTIVE COMMUNITY
                </span>
                <h2 className="text-3xl font-bold mt-2">Learn more together</h2>
              </div>
              
              <p className="text-2xl text-gray-500 leading-relaxed">
              Go beyond the textbook. Explore interactive lessons, practice with real-world scenarios, and gain confidence in your language skills with our expertly designed courses.
              </p>
            </div>
            
          </div>
          
        </div>
      </div>
          {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 ">About Learnara</h3>
              <p className="text-gray-400">Empowering people to connect across languages and cultures through effective, engaging language learning.</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Popular Languages</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Learn English</li>
                <li>Learn Spanish</li>
                <li>Learn Japanese</li>
                <li>Learn Korean</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Help & Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Contact Us</li>
                <li>FAQs</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">Community</h3>
              <ul className="space-y-2 text-gray-400">
                <li>Blog</li>
                <li>Success Stories</li>
                <li>Language Exchange</li>
                <li>Teaching Resources</li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Learnara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>

  );
};

export default HomePage;
