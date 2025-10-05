import React from "react";

interface ActionButtonsProps {
  canSwipe: boolean;
  canGoBack: boolean;
  onDislike: () => void;
  onUndo: () => void;
  onLike: () => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({
  canSwipe,
  canGoBack,
  onDislike,
  onUndo,
  onLike,
}) => {
  return (
    <div className="action-buttons">
      <button
        onClick={onDislike}
        className="action-btn btn-dislike"
        disabled={!canSwipe}
      >
        ❌
      </button>
      <button
        onClick={onUndo}
        className={`action-btn btn-back ${!canGoBack ? "disabled" : ""}`}
        disabled={!canGoBack}
      >
        ↩
      </button>
      <button
        onClick={onLike}
        className="action-btn btn-like"
        disabled={!canSwipe}
      >
        🤍️
      </button>
    </div>
  );
};
