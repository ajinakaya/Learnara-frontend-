import React from 'react';
import { Globe, Book, Users, ArrowRight } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] mix-blend-overlay opacity-10" />
        </div> 
        
        {/* Navigation */}
        <nav className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <span className="text-2xl font-bold text-white tracking-tight">Learnara</span>
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="text-gray-100 hover:text-white transition duration-300">Features</a>
                <a href="#about" className="text-gray-100 hover:text-white transition duration-300">About</a>
                <a href="#contact" className="text-gray-100 hover:text-white transition duration-300">Contact</a>
                <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-opacity-90 transition duration-300">
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-32 pb-40">
          <div className="text-center transform transition duration-500">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Discover the Joy of<br />Language Learning
            </h1>
            <p className="mt-6 text-xl text-gray-100 max-w-2xl mx-auto">
              Learn anytime, anywhere with our interactive lessons and engaging tools.
              Join millions of learners today!
            </p>
            <div className="mt-10">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                Get Started Free
                <ArrowRight className="inline-block ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Why Choose Learnara?
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to master a new language
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-2 transition duration-300">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Interactive Lessons</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Engage with dynamic content tailored to your learning style and pace.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-2 transition duration-300">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <Book className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Smart Flashcards</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Reinforce your learning with AI-powered spaced repetition system.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-2 transition duration-300">
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center mb-6">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">Community Practice</h3>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Connect with native speakers and fellow learners for real conversation practice.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              About Learnara
            </h2>
            <p className="mt-6 text-xl text-gray-600 leading-relaxed">
              Learnara is a platform dedicated to making language learning fun, effective, and
              accessible for all. We combine cutting-edge technology with proven teaching methods
              to help you achieve your goals.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-bold mb-4">Learnara</h3>
              <p className="text-sm">Making language learning accessible to everyone.</p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition duration-300">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition duration-300">Pricing</a></li>
                <li><a href="#about" className="hover:text-white transition duration-300">About</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#help" className="hover:text-white transition duration-300">Help Center</a></li>
                <li><a href="#contact" className="hover:text-white transition duration-300">Contact</a></li>
                <li><a href="#privacy" className="hover:text-white transition duration-300">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#twitter" className="hover:text-white transition duration-300">Twitter</a></li>
                <li><a href="#facebook" className="hover:text-white transition duration-300">Facebook</a></li>
                <li><a href="#instagram" className="hover:text-white transition duration-300">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-center">
            <p>&copy; 2024 Learnara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;