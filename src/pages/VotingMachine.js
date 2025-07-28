import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { API, BASE_URL } from "../constants/appConstants";

const socket = io(BASE_URL);

const VotingMachine = () => {
  const [candidates, setCandidates] = useState([]);
  const [voterId, setVoterId] = useState(null);
  const [votingAllowed, setVotingAllowed] = useState(false);
  const [voted, setVoted] = useState(false);
  const [voterName, setVoterName] = useState("");
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    // Loading candidates on mount
    axios
      .get(API.CANDIDATES, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setCandidates(res.data))
      .catch((err) => console.error("Error loading candidates", err));

    // Socket events
    socket.on("voter-granted", (data) => {
      console.log("✅ Voter granted via socket:", data);
      setVoterId(data.voter_id);
      setVoterName(data.name);
      setVotingAllowed(true);
      setVoted(false);
    });

    socket.on("voter-cancelled", () => {
      setVoterId(null);
      setVoterName("");
      setVotingAllowed(false);
      setVoted(false);
    });

    return () => {
      socket.off("voter-granted");
      socket.off("voter-cancelled");
    };
  }, []);

  const castVote = async (candidateId) => {
    if (!voterId) {
      alert("Voter not authorized");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(
        API.VOTE,
        {
          voter_id: voterId,
          candidate_id: candidateId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Success – vote cast
      //alert(res.data.message || "Vote cast successfully");
      setVoted(true);
      setVotingAllowed(false);
      socket.emit("vote-cast", { voter_id: voterId });
    } catch (err) {
      console.error("Error casting vote:", err);

      if (err.response?.data?.error) {
        alert("Vote failed: " + err.response.data.error);
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!votingAllowed && !voted) {
    return (
      <div className="container text-center mt-5">
        <h3 className="text-muted">Waiting for Voter Authorization...</h3>
      </div>
    );
  }

  if (voted) {
    return (
      <div className="container text-center mt-5">
        <h3 className="text-success">
          <i className="fas fa-check-circle me-2"></i>Vote Submitted
        </h3>
        <p>Thank you for voting!</p>
      </div>
    );
  }

  return (
    <div className="container text-center mt-5">
      <h4>Welcome {voterName || "Voter"}</h4>
      <p className="text-muted">Tap your candidate. Double-click to confirm.</p>
      <div className="mt-4 d-flex flex-column align-items-center gap-3">
        {loading && (
          <>
            <p>Loading...</p>
          </>
        )}
        {candidates.map((c) => (
          <div
            key={c._id}
            className="card shadow-sm px-4 py-3 w-100"
            style={{ maxWidth: "400px", cursor: "pointer" }}
            onDoubleClick={() => {
              if (!loading) {
                castVote(c._id);
              }
            }}
          >
            <div className="d-flex align-items-center">
              <div
                className="rounded-circle bg-primary text-white d-flex justify-content-center align-items-center"
                style={{ width: "60px", height: "60px", fontSize: "1.8rem" }}
              >
                {c.symbol || "🔘"}
              </div>
              <div className="ms-4">
                <h5 className="mb-0">{c.name}</h5>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VotingMachine;
