import React, { useEffect, useState } from "react";
import axios from "axios";
import { API } from "../constants/appConstants";
import socket from "../utils/socket";

const VotingResult = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    fetchResults();

    // Listen for vote-cast event to update live
    socket.on("vote-cast", () => {
      fetchResults(); // Refresh results on every vote
    });

    socket.on("votes-cleared", () => {
      fetchResults();
    });

    return () => {
      socket.off("vote-cast");
      socket.off("votes-cleared");
    };
  }, []);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API.VOTE}/count`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResults(res.data);
    } catch (err) {
      alert("Failed to fetch results: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h4>
        <i className="fas fa-chart-bar me-2"></i>Live Voting Result
      </h4>

      {loading ? (
        <div className="text-muted">Loading results...</div>
      ) : results.length === 0 ? (
        <div className="alert alert-info">No votes recorded yet.</div>
      ) : (
        <div className="row">
          {results.map((candidate) => (
            <div className="col-md-4 mb-3" key={candidate.candidate_id}>
              <div className="card shadow-sm">
                <div className="card-body text-center">
                  {candidate.symbol_pic && (
                    <img
                      src={candidate.symbol_pic}
                      alt={candidate.symbol_name}
                      style={{ height: "60px", marginBottom: "10px" }}
                    />
                  )}
                  <h5>{candidate.name}</h5>
                  {candidate.class_division && (
                    <p className="mb-1 text-muted">
                      {candidate.class_division}
                    </p>
                  )}
                  <span className="badge bg-success fs-5">
                    {candidate.vote_count}{" "}
                    <i className="fas fa-vote-yea ms-1"></i>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VotingResult;
