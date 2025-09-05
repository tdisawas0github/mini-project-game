import { useState, useEffect } from 'react';
import styled from 'styled-components';
import type { GameState } from '../types/game';

const SaveLoadContainer = styled.div`
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
  color: #e0e0e0;
  padding: 2rem;
  min-height: 100vh;
  overflow-y: auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  
  h1 {
    color: #64b5f6;
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    text-shadow: 0 0 10px rgba(100, 181, 246, 0.3);
  }
  
  p {
    color: #b0b0b0;
    font-size: 1.1rem;
  }
`;

const SaveLoadTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Tab = styled.button<{ $active: boolean }>`
  background: ${props => props.$active 
    ? 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)'
    : 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)'
  };
  border: 2px solid ${props => props.$active ? '#64b5f6' : '#444'};
  color: ${props => props.$active ? 'white' : '#e0e0e0'};
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #64b5f6;
    transform: translateY(-1px);
  }
`;

const SaveSlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const SaveSlot = styled.div<{ $isEmpty: boolean }>`
  background: ${props => props.$isEmpty 
    ? 'linear-gradient(135deg, #1a1a1a 0%, #0f0f1a 100%)'
    : 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)'
  };
  border: 2px solid ${props => props.$isEmpty ? '#333' : '#444'};
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  cursor: ${props => props.$isEmpty ? 'default' : 'pointer'};
  
  &:hover {
    ${props => !props.$isEmpty && `
      border-color: #64b5f6;
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0,0,0,0.3);
    `}
  }
  
  .slot-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    .slot-number {
      color: #64b5f6;
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    .save-date {
      color: #888;
      font-size: 0.9rem;
    }
  }
  
  .save-preview {
    margin-bottom: 1rem;
    
    .player-name {
      color: #ffa726;
      font-size: 1.1rem;
      font-weight: bold;
      margin-bottom: 0.5rem;
    }
    
    .current-scene {
      color: #c0c0c0;
      margin-bottom: 0.5rem;
    }
    
    .progress-info {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
      font-size: 0.9rem;
      color: #888;
      
      .info-item {
        .label {
          color: #b0b0b0;
        }
        .value {
          color: #64b5f6;
          font-weight: bold;
        }
      }
    }
  }
  
  .empty-slot {
    text-align: center;
    color: #666;
    font-style: italic;
    padding: 2rem 0;
  }
  
  .slot-actions {
    display: flex;
    gap: 0.5rem;
    
    button {
      flex: 1;
      padding: 0.6rem;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
      
      &.save-btn {
        background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
        color: white;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
        }
      }
      
      &.load-btn {
        background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
        color: white;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
        }
      }
      
      &.delete-btn {
        background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
        color: white;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
        }
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }
    }
  }
`;

const QuickSaveSection = styled.div`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 2px solid #ffa726;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  
  h3 {
    color: #ffa726;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .quick-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    
    button {
      padding: 0.8rem 1.2rem;
      border: none;
      border-radius: 8px;
      cursor: pointer;
      font-size: 1rem;
      font-weight: bold;
      transition: all 0.2s ease;
      
      &.quick-save {
        background: linear-gradient(135deg, #ffa726 0%, #f57c00 100%);
        color: white;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(255, 167, 38, 0.3);
        }
      }
      
      &.quick-load {
        background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
        color: white;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(100, 181, 246, 0.3);
        }
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
      }
    }
  }
`;

const ReturnButton = styled.button`
  position: fixed;
  top: 2rem;
  right: 2rem;
  background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
  border: none;
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s ease;
  z-index: 100;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(100, 181, 246, 0.3);
  }
`;

interface SaveData {
  id: number;
  gameState: GameState;
  saveDate: string;
  sceneName: string;
}

interface SaveLoadSystemProps {
  onReturn: () => void;
  currentGameState: GameState;
  onLoadGame: (gameState: GameState) => void;
}

const SaveLoadSystem = ({ onReturn, currentGameState, onLoadGame }: SaveLoadSystemProps) => {
  const [activeTab, setActiveTab] = useState<'save' | 'load'>('save');
  const [saveSlots, setSaveSlots] = useState<(SaveData | null)[]>(Array(6).fill(null));
  const [quickSaveData, setQuickSaveData] = useState<SaveData | null>(null);

  // Load save data from localStorage on component mount
  useEffect(() => {
    const savedSlots = [];
    for (let i = 0; i < 6; i++) {
      const slotData = localStorage.getItem(`echoes_save_slot_${i}`);
      if (slotData) {
        try {
          savedSlots[i] = JSON.parse(slotData);
        } catch (error) {
          console.error(`Error loading save slot ${i}:`, error);
          savedSlots[i] = null;
        }
      } else {
        savedSlots[i] = null;
      }
    }
    setSaveSlots(savedSlots);

    // Load quick save
    const quickSave = localStorage.getItem('echoes_quick_save');
    if (quickSave) {
      try {
        setQuickSaveData(JSON.parse(quickSave));
      } catch (error) {
        console.error('Error loading quick save:', error);
        setQuickSaveData(null);
      }
    }
  }, []);

  const getSceneName = (sceneId: string): string => {
    const sceneNames: Record<string, string> = {
      'prologue_start': 'Awakening in Valdaren',
      'hub_main': 'The Crossroads of Memory',
      'chapter1_start': 'First Steps into Mystery',
      'chapter2_start': 'Deeper into the Ruins',
      'memory_chamber_entry': 'Memory-Dive Chamber'
    };
    return sceneNames[sceneId] || 'Unknown Location';
  };

  const handleSave = (slotIndex: number) => {
    const saveData: SaveData = {
      id: slotIndex,
      gameState: currentGameState,
      saveDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      sceneName: getSceneName(currentGameState.currentScene)
    };

    try {
      localStorage.setItem(`echoes_save_slot_${slotIndex}`, JSON.stringify(saveData));
      const newSaveSlots = [...saveSlots];
      newSaveSlots[slotIndex] = saveData;
      setSaveSlots(newSaveSlots);
    } catch (error) {
      console.error('Error saving game:', error);
      alert('Failed to save game. Please try again.');
    }
  };

  const handleLoad = (slotIndex: number) => {
    const saveData = saveSlots[slotIndex];
    if (saveData && onLoadGame) {
      onLoadGame(saveData.gameState);
      alert('Game loaded successfully!');
    }
  };

  const handleDelete = (slotIndex: number) => {
    if (confirm('Are you sure you want to delete this save?')) {
      try {
        localStorage.removeItem(`echoes_save_slot_${slotIndex}`);
        const newSaveSlots = [...saveSlots];
        newSaveSlots[slotIndex] = null;
        setSaveSlots(newSaveSlots);
      } catch (error) {
        console.error('Error deleting save:', error);
      }
    }
  };

  const handleQuickSave = () => {
    const saveData: SaveData = {
      id: -1, // Quick save ID
      gameState: currentGameState,
      saveDate: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString(),
      sceneName: getSceneName(currentGameState.currentScene)
    };

    try {
      localStorage.setItem('echoes_quick_save', JSON.stringify(saveData));
      setQuickSaveData(saveData);
    } catch (error) {
      console.error('Error quick saving:', error);
      alert('Failed to quick save. Please try again.');
    }
  };

  const handleQuickLoad = () => {
    if (quickSaveData && onLoadGame) {
      onLoadGame(quickSaveData.gameState);
      alert('Quick save loaded successfully!');
    }
  };

  return (
    <SaveLoadContainer>
      <ReturnButton onClick={onReturn}>
        ← Return to Hub
      </ReturnButton>
      
      <Header>
        <h1>💾 Save & Load</h1>
        <p>Preserve your journey through the mysteries of Valdaren</p>
      </Header>

      <QuickSaveSection>
        <h3>⚡ Quick Save/Load</h3>
        <div className="quick-actions">
          <button className="quick-save" onClick={handleQuickSave}>
            💾 Quick Save
          </button>
          <button 
            className="quick-load" 
            onClick={handleQuickLoad}
            disabled={!quickSaveData}
          >
            ⚡ Quick Load
          </button>
        </div>
        {quickSaveData && (
          <div style={{ 
            marginTop: '1rem', 
            textAlign: 'center', 
            color: '#888', 
            fontSize: '0.9rem' 
          }}>
            Last quick save: {quickSaveData.saveDate} ({quickSaveData.sceneName})
          </div>
        )}
      </QuickSaveSection>

      <SaveLoadTabs>
        <Tab 
          $active={activeTab === 'save'} 
          onClick={() => setActiveTab('save')}
        >
          💾 Save Game
        </Tab>
        <Tab 
          $active={activeTab === 'load'} 
          onClick={() => setActiveTab('load')}
        >
          📂 Load Game
        </Tab>
      </SaveLoadTabs>

      <SaveSlotGrid>
        {saveSlots.map((saveData, index) => (
          <SaveSlot key={index} $isEmpty={!saveData}>
            <div className="slot-header">
              <div className="slot-number">Save Slot {index + 1}</div>
              {saveData && <div className="save-date">{saveData.saveDate}</div>}
            </div>
            
            {saveData ? (
              <>
                <div className="save-preview">
                  <div className="player-name">
                    {saveData.gameState.playerName || 'Unnamed Wanderer'}
                  </div>
                  <div className="current-scene">{saveData.sceneName}</div>
                  <div className="progress-info">
                    <div className="info-item">
                      <span className="label">Languages: </span>
                      <span className="value">{saveData.gameState.knownLanguages.length}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Glyphs: </span>
                      <span className="value">{saveData.gameState.unlockedGlyphs.length}</span>
                    </div>
                  </div>
                </div>
                
                <div className="slot-actions">
                  {activeTab === 'save' ? (
                    <>
                      <button className="save-btn" onClick={() => handleSave(index)}>
                        💾 Overwrite
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(index)}>
                        🗑️ Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="load-btn" onClick={() => handleLoad(index)}>
                        📂 Load
                      </button>
                      <button className="delete-btn" onClick={() => handleDelete(index)}>
                        🗑️ Delete
                      </button>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="empty-slot">Empty Slot</div>
                <div className="slot-actions">
                  <button 
                    className="save-btn" 
                    onClick={() => handleSave(index)}
                    disabled={activeTab !== 'save'}
                  >
                    💾 Save Here
                  </button>
                </div>
              </>
            )}
          </SaveSlot>
        ))}
      </SaveSlotGrid>
    </SaveLoadContainer>
  );
};

export default SaveLoadSystem;
