import { useGame } from '../hooks/useGame';

interface LexiconSidebarProps {
  onClose: () => void;
}

export default function LexiconSidebar({ onClose }: LexiconSidebarProps) {
  const { state } = useGame();
  
  const unlockedMemories = Object.values(state.memories).filter(memory => !memory.locked);
  const lockedMemories = Object.values(state.memories).filter(memory => memory.locked);
  
  return (
    <div className="lexicon-sidebar">
      <div className="lexicon-header">
        <h2>Lexicon</h2>
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      
      <div className="lexicon-content">
        <section className="languages-section">
          <h3>Known Languages</h3>
          <ul className="language-list">
            {state.knownLanguages.map(lang => (
              <li key={lang} className="language-item">
                <span className="language-name">{lang}</span>
                {state.languageFlags[lang] && (
                  <span className="language-active">✓</span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section className="memories-section">
          <h3>Unlocked Glyphs</h3>
          {unlockedMemories.length > 0 ? (
            <ul className="memory-list">
              {unlockedMemories.map(memory => (
                <li key={memory.id} className="memory-item unlocked">
                  <div className="memory-title">{memory.title}</div>
                  <div className="memory-content">{memory.content}</div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-memories">No glyphs unlocked yet.</p>
          )}
          
          <h3>Locked Glyphs</h3>
          <ul className="memory-list">
            {lockedMemories.map(memory => (
              <li key={memory.id} className="memory-item locked">
                <div className="memory-title">{memory.title}</div>
                <div className="memory-hint">Requires linguistic context to unlock</div>
              </li>
            ))}
          </ul>
        </section>

        <section className="consequences-section">
          <h3>Consequence Log</h3>
          {Object.keys(state.consequenceMap).length > 0 ? (
            <ul className="consequence-list">
              {Object.entries(state.consequenceMap).map(([key, values]) => (
                <li key={key} className="consequence-item">
                  <strong>{key}:</strong> {values.join(', ')}
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-consequences">No consequences recorded yet.</p>
          )}
        </section>
      </div>
    </div>
  );
}
