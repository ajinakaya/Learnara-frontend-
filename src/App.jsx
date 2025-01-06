import React from 'react';
import {Routes, Route} from'react-router-dom';
import HomePage from './HomePage'; 
import SignUpPage from './SignUpPage';

const App = () => {
  return (
    <>
    <Routes>
      <Route path='/' element={<HomePage />}/> 
      <Route path='/register' element={<SignUpPage/>}/>
  
    </Routes>
    </>
  );
};

export default App;
