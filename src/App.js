import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Candidates from './pages/Candidates';
import ProtectedRoute from './components/ProtectedRoute';
import Voters from './pages/Voters';
import PollingPanel from './pages/PollingPanel';
import VotingMachine from './pages/VotingMachine';
import ResultPage from './pages/ResultPage';

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

          <Route path='/voters' element={
          <ProtectedRoute>
            <Voters />
          </ProtectedRoute>} />




          <Route path='/poll' element={
          <ProtectedRoute>
            <PollingPanel />
          </ProtectedRoute>} />
          


          <Route path='/voting-machine' element={
          <ProtectedRoute>
            <VotingMachine />
          </ProtectedRoute>} />
          


          <Route path='/result' element={
          <ProtectedRoute>
            <ResultPage />
          </ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
