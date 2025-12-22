import React, { useState } from "react";
import "./VotingModal.css";

const VotingModal = ({ proposal, onVote, onClose, voteCostCalculator }) => {
  const [votes, setVotes] = useState(1);
  const [choice, setChoice] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const voteCost = voteCostCalculator(votes);

  const handleVote = async () => {
    if (!votes || votes < 1) {
      setMessage("Please enter number of votes");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const result = await onVote(proposal.id, votes, choice);
      if (result && result.success) {
        setMessage(`✅ ${result.message || 'Vote cast successfully!'}`);
        // Modal will auto-close from parent component
      } else if (result && result.error) {
        setMessage(`❌ ${result.error}`);
      } else {
        setMessage(`❌ Vote failed. Please try again.`);
      }
    } catch (error) {
      console.error("Vote error:", error);
      setMessage(`❌ Error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const choiceNames = {
    1: "Yes",
    2: "No",
    3: "Abstain"
  };

  return (
    <div className="voting-modal-overlay">
      <div className="voting-modal">
        <button className="voting-modal-close" onClick={onClose}>×</button>
        
        <h2 className="voting-modal-title">Cast Your Vote</h2>
        <p className="voting-modal-subtitle">{proposal.title}</p>

        {/* Vote Choice */}
        <div className="voting-choice-section">
          <label className="voting-label">Your Vote:</label>
          <div className="voting-choice-buttons">
            <button
              className={`choice-btn ${choice === 1 ? "active yes" : ""}`}
              onClick={() => setChoice(1)}
            >
              👍 Yes
            </button>
            <button
              className={`choice-btn ${choice === 2 ? "active no" : ""}`}
              onClick={() => setChoice(2)}
            >
              👎 No
            </button>
            <button
              className={`choice-btn ${choice === 3 ? "active abstain" : ""}`}
              onClick={() => setChoice(3)}
            >
              🤷 Abstain
            </button>
          </div>
        </div>

        {/* Vote Count */}
        <div className="voting-count-section">
          <label className="voting-label">Number of Votes:</label>
          <div className="voting-count-input">
            <button className="count-btn" onClick={() => setVotes(Math.max(1, votes - 1))}>−</button>
            <input
              type="number"
              value={votes}
              onChange={(e) => setVotes(Math.max(1, Math.min(100, parseInt(e.target.value) || 1)))}
              min="1"
              max="100"
            />
            <button className="count-btn" onClick={() => setVotes(Math.min(100, votes + 1))}>+</button>
          </div>
          <small className="voting-info">(Max: 100 votes)</small>
        </div>

        {/* Quadratic Cost Display */}
        <div className="voting-cost-section">
          <div className="cost-info">
            <span className="cost-label">Cost (Quadratic Voting):</span>
            <span className="cost-value">{voteCost} ARC</span>
          </div>
          <p className="cost-explanation">
            📐 With quadratic voting, the cost is: <strong>{votes}² = {voteCost}</strong>
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className={`voting-message ${message.includes("❌") ? "error" : "success"}`}>
            {message}
          </div>
        )}

        {/* Vote Button */}
        <button
          className="voting-submit-btn"
          onClick={handleVote}
          disabled={loading}
        >
          {loading ? "⏳ Processing..." : `Vote ${choiceNames[choice]}`}
        </button>
      </div>
    </div>
  );
};

export default VotingModal;
