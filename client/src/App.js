import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import './style.css'
import shuriken from './components/images/shuriken.png'
//* Pages
import { Menu, NotFound, Leaderboard, Dashboard, Lobby, Game } from './pages';


function App() {
  return (
    <div className="App">
      {/* <div className="circlesContainer">
          {
            Array(10).fill().map((i, index) => (<img key={index} className="circles" src={shuriken} alt="pokeball"></img>))
          }
        </div> */}
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game" element={<Game />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
