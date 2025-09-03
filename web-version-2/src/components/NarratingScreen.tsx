import React from 'react';
import './NarratingScreen.css';

interface NarratingScreenProps {
  onSave?: () => void;
  onBack?: () => void;
  onExit?: () => void;
  onNarratorAction?: () => void;
}

const NarratingScreen: React.FC<NarratingScreenProps> = ({
  onSave,
  onBack,
  onExit,
  onNarratorAction,
}) => {
  return (
    <div className="narrating-screen">
      <div className="narrating-container">
        <div className="header-section">
          <h1 className="screen-title">Narrating</h1>
          <div className="control-buttons">
            <button className="control-button" onClick={onSave}>
              Save
            </button>
            <button className="control-button" onClick={onBack}>
              Back
            </button>
            <button className="control-button" onClick={onExit}>
              Exit
            </button>
          </div>
        </div>

        <div className="content-section">
          <div className="narrator-section">
            <button className="narrator-button" onClick={onNarratorAction}>
              Narrator
            </button>
          </div>

          <div className="text-area">
            <p>Texts for the visual novel game.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NarratingScreen;