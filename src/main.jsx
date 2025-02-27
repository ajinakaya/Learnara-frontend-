import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'
import { LanguageProvider } from "./private/context/languagecontext";
import { AuthProvider } from "./private/context/authcontext";
import {GoalProvider} from "./private/context/goalcontext";


createRoot(document.getElementById('root')).render(

    <Router>
    <AuthProvider>
    <GoalProvider>
    <LanguageProvider>
    <App />
    </LanguageProvider>
    </GoalProvider>
    </AuthProvider>
    </Router>
    
)
