import React from "react";

interface EndCardProps {
  onReshuffle: () => void;
}

export const EndCard: React.FC<EndCardProps> = ({ onReshuffle }) => {
  return (
    <div className="tinder-card end-card">
      <div className="end-card-content">
        <h2>🎉 You've seen all the meals!</h2>
        <p>Click the button below to reshuffle and start over.</p>
        <button onClick={onReshuffle} className="reshuffle-btn">
          🔀 Reshuffle Deck
        </button>
      </div>
    </div>
  );
};
