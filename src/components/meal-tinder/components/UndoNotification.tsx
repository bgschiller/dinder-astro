import React from "react";

interface UndoNotificationProps {
  show: boolean;
  onUndo: () => void;
}

export const UndoNotification: React.FC<UndoNotificationProps> = ({
  show,
  onUndo,
}) => {
  if (!show) return null;

  return (
    <div className="undo-clear-notification">
      <span>Meal plan cleared</span>
      <button onClick={onUndo} className="undo-btn">
        ↶ Undo
      </button>
    </div>
  );
};
