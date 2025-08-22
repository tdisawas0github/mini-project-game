import { useGame } from '../hooks/useGame';

interface MemoryDiveProps {
  onClose: () => void;
}

export default function MemoryDive({ onClose }: MemoryDiveProps) {
  const { state, dispatch } = useGame();

  const handleMemoryInteraction = (memoryId: string) => {
    const memory = state.memories[memoryId];
    if (!memory) return;

    if (memory.locked) {
      return; // Show locked message handled in UI
    }

    dispatch({ type: 'ADD_CONSEQUENCE', payload: { key: memoryId, value: 'inspected' } });
  };

  const handleGlyphTranslation = () => {
    if (state.knownLanguages.length > 1) {
      dispatch({ type: 'UNLOCK_MEMORY', payload: 'm_intro' });
      dispatch({ type: 'ADD_CONSEQUENCE', payload: { key: 'translation', value: 'successful' } });
    }
  };

  return (
    <div className="memory-dive">
      <div className="memory-dive-header">
        <h2>Memory-Dive Chamber</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="chamber-description">
        <p>You activate a Memory-Dive Chamber. The dreamscape shimmers around you. Choose a tether to probe...</p>
      </div>

      <div className="memory-options">
        {Object.values(state.memories).map(memory => (
          <div key={memory.id} className="memory-option">
            <button 
              className={`memory-button ${memory.locked ? 'locked' : 'unlocked'}`}
              onClick={() => handleMemoryInteraction(memory.id)}
            >
              <div className="memory-title">{memory.title}</div>
              <div className="memory-id">({memory.id})</div>
            </button>
            
            {memory.locked ? (
              <div className="memory-status locked">
                <span>🔒</span> The glyph resists — it needs more semantic context to open.
              </div>
            ) : (
              <div className="memory-status unlocked">
                <span>✨</span> {memory.content}
              </div>
            )}
          </div>
        ))}
        
        <div className="translation-option">
          <button 
            className="translation-button"
            onClick={handleGlyphTranslation}
          >
            Attempt to translate a glyph
          </button>
          <div className="translation-info">
            You try to render the glyph through your current languages...
            {state.knownLanguages.length > 1 ? (
              <div className="success-hint">✓ Multiple languages detected - translation may succeed</div>
            ) : (
              <div className="failure-hint">⚠ Not enough interpretative context. Try learning another language.</div>
            )}
          </div>
        </div>
      </div>

      <div className="chamber-footer">
        <button onClick={onClose} className="return-button">Return to Hub</button>
      </div>
    </div>
  );
}
