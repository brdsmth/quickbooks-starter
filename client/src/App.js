import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Connect from './pages/Connect';
import Auth from './pages/Auth';
import Transactions from './pages/Transactions';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Auth />} />
        <Route exact path="/connect" element={<Connect />} />
        <Route exact path="/transactions" element={<Transactions />} />
      </Routes>
    </Router>
  );
}

export default App;

