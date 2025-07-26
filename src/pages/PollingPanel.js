import React, { useState, useEffect } from 'react';
import axios from 'axios';
import socket from '../utils/socket'; // ✅ import socket instance
import { API } from '../constants/appConstants';

const PollingPanel = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [voters, setVoters] = useState([]);
  const [classDivisions, setClassDivisions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pendingVoter, setPendingVoter] = useState(null);
  const [loadingAllowToVote, setLoadingAllowToVote] = useState(false);


  const token = JSON.parse(localStorage.getItem('token'));

  useEffect(() => {
    const fetchClassDivisions = async () => {
      try {
        const res = await axios.get(`${API.VOTERS}/used-cd`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setClassDivisions(res.data);
      } catch (err) {
        alert("Failed to load class list: " + err.message);
      }
    };

    fetchClassDivisions();
  }, []);


  useEffect(() => {
  // Listen for real-time vote update
  socket.on('vote-cast', ({ voter_id }) => {
    setVoters((prev) =>
      prev.map((v) =>
        v._id === voter_id ? { ...v, hasVoted: true } : v
      )
    );

    // Optional: auto-clear if the pending voter just voted
    if (pendingVoter && pendingVoter._id === voter_id) {
      setPendingVoter(null);
    }
  });

  return () => {
    socket.off('vote-cast');
  };
}, [pendingVoter]);


  const fetchVoters = async (classDiv) => {
    try {
      setLoading(true);
      const res = await axios.get(`${API.VOTERS}/cd/${classDiv}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVoters(res.data);
    } catch (err) {
      alert("Failed to load voters: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClassChange = (e) => {
    const classDiv = e.target.value;
    setSelectedClass(classDiv);
    if (classDiv) fetchVoters(classDiv);
  };

  const handleVoterClick = async (index) => {
  const voter = voters[index];

  setLoadingAllowToVote(true);
  try {
    // Step 1: Save to DB (pending vote)
    await axios.post(API.PENDING_VOTE, { voter_id: voter._id }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Step 2: Notify voting machine via socket
    socket.emit('grant-vote', {
      voter_id: voter._id,
      name: voter.name,
      roll_number: voter.roll_number,
      class_division: voter.class_division,
    });

    setPendingVoter(voter);
    //alert(`Voter ${voter.name} is allowed to vote now.`);
  } catch (err) {
    // Show server error message if available
    if (err.response && err.response.data && err.response.data.error) {
      alert("Error: " + err.response.data.error);
    } else {
      alert("Unexpected error: " + err.message);
    }
  }
  finally{
    setLoadingAllowToVote(false);
  }
};


const handleClearVotes = async () => {
  const confirm = window.confirm(
    "Are you sure you want to clear all votes?\nThis action cannot be undone!"
  );
  if (!confirm) return;

  try {
    await axios.delete(API.VOTE, {
      headers: { Authorization: `Bearer ${token}` },
    });

    socket.emit('votes-cleared');

    //alert("All votes have been cleared.");
    fetchVoters(selectedClass);
  } catch (err) {
    alert("Failed to clear votes: " + err.message);
  }
};



const handleCancelVote = async () => {
  if (!pendingVoter) return;

  try {
    // Delete all pending votes (only one allowed anyway)
    await axios.delete(API.PENDING_VOTE, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Notify voting machine
    socket.emit('cancel-vote', { voter_id: pendingVoter._id });

    //alert(`Voting cancelled for ${pendingVoter.name}`);
    setPendingVoter(null);
  } catch (err) {
    alert("Error cancelling vote: " + (err.response?.data?.error || err.message));
  }
};





  return (
    <div className="container mt-4">
      


<div className="d-flex justify-content-between align-items-center mt-3 mb-3">
  <h4><i className="fas fa-poll me-2"></i>Polling Panel</h4>
  <button
    className="btn btn-outline-danger btn-sm"
    onClick={handleClearVotes}
  >
    <i className="fas fa-trash-alt me-1"></i> Clear All Votes
  </button>
</div>



      <div className="mb-3">
        <label>Select Class</label>
        <select className="form-select" value={selectedClass} onChange={handleClassChange}>
          <option value="">-- Select Class --</option>
          {classDivisions.map((cd, idx) => (
            <option key={idx} value={cd}>{cd}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div>Loading voters...</div>
      ) : (
        <>
        <div className="voter-grid d-flex flex-wrap gap-2">
          {voters.map((v, index) => (
            <button
              key={v._id}
              className={`btn btn-sm ${v.hasVoted ? 'btn-secondary' : 'btn-outline-primary'}`}
              onClick={() => handleVoterClick(index)}
              disabled={v.hasVoted || loadingAllowToVote}
              style={{ width: '80px', height: '60px', fontSize: '12px' }}

            >
              <strong>{v.roll_number}</strong><br />
              {v.name}
              {loadingAllowToVote ?? (<>Loading...</>)}
            </button>
          ))}
        </div>


          {pendingVoter && (
            <div className="mt-3">
                <div className="alert alert-warning">
                <strong>{pendingVoter.name}</strong> ({pendingVoter.roll_number}) is currently authorized to vote.
                </div>
                <button className="btn btn-danger" onClick={handleCancelVote}>
                <i className="fas fa-times me-1"></i>Cancel Vote
                </button>
            </div>
            )}


</>
      )}
    </div>
  );
};

export default PollingPanel;
