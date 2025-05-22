import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Splash from './Pages/Splash';
import Home from './Pages/Home';
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';

import Learning from './Pages/Learning';
import Game from './Pages/Game';

const App = () => {
  return (
    <BrowserRouter>

    <Routes>
      <Route path="/" element={<Splash />} />
      <Route path="/home" element={<Home />} />
      <Route path="/learning" element={<Learning />} />
      <Route path="/game" element={<Game />} />
      {/* Add more routes as needed */}

    </Routes>
      <ToastContainer />
      </BrowserRouter>
    );
};

export default App;
