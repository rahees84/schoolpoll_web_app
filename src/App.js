import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Candidates from './pages/Candidates';
import ProtectedRoute from './components/ProtectedRoute';

const Home = () => (
  <div className="container mt-5 text-center">
    <h1>Welcome to School Poll System 🎓</h1>
    <p className="lead">Cast your vote with fairness and transparency.</p>
  </div>
);

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path='/candidates' element={
          <ProtectedRoute>
            <Candidates />
          </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
