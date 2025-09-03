import React from 'react';
import './LanguageSelectionScreen.css';

interface LanguageSelectionScreenProps {
  onLanguageSelect: (language: string) => void;
  onSave?: () => void;
  onBack?: () => void;
  onExit?: () => void;
}

const LanguageSelectionScreen: React.FC<LanguageSelectionScreenProps> = ({
  onLanguageSelect,
  onSave,
  onBack,
  onExit,
}) => {
  return (
    <div className="language-selection-screen">
      <div className="language-selection-container">
        <div className="header-section">
          <h1 className="screen-title">Selection of Languages</h1>
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
          <div className="language-options">
            <button 
              className="language-button" 
              onClick={() => onLanguageSelect('english')}
            >
              English
            </button>
            <button 
              className="language-button" 
              onClick={() => onLanguageSelect('dutch')}
            >
              Dutch
            </button>
            <button 
              className="language-button" 
              onClick={() => onLanguageSelect('latin')}
            >
              Latin
            </button>
            <button 
              className="language-button" 
              onClick={() => onLanguageSelect('greek')}
            >
              Greek
            </button>
          </div>

          <div className="narrator-section">
            <button className="narrator-button">
              Narrator
            </button>
          </div>

          <div className="instruction-area">
            <p>Select your Language</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionScreen;