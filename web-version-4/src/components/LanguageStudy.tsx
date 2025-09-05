import { useState } from 'react';
import styled from 'styled-components';

const StudyContainer = styled.div`
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

const StudyTabs = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;
  flex-wrap: wrap;
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

const StudySection = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const PhraseLearning = styled.div`
  .phrase-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .phrase-card {
    background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
    border: 1px solid #444;
    border-radius: 12px;
    padding: 1.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #64b5f6;
      transform: translateY(-2px);
    }
    
    .glyph {
      font-size: 3rem;
      text-align: center;
      margin-bottom: 1rem;
    }
    
    .pronunciation {
      color: #ffa726;
      font-style: italic;
      text-align: center;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    
    .meaning {
      color: #81c784;
      text-align: center;
      font-weight: bold;
      margin-bottom: 1rem;
    }
    
    .details {
      .detail-row {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0.5rem;
        font-size: 0.9rem;
        
        .label {
          color: #b0b0b0;
          font-weight: bold;
        }
        
        .value {
          color: #e0e0e0;
          text-align: right;
          flex: 1;
          margin-left: 1rem;
        }
      }
    }
    
    .practice-btn {
      width: 100%;
      margin-top: 1rem;
      background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
      border: none;
      color: white;
      padding: 0.6rem;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
      }
    }
  }
`;

const PracticeExercise = styled.div`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 2px solid #64b5f6;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  
  h3 {
    color: #64b5f6;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .exercise-question {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
    text-align: center;
  }
  
  .glyph-display {
    font-size: 4rem;
    text-align: center;
    margin: 2rem 0;
    padding: 2rem;
    background: #1a1a2e;
    border-radius: 12px;
    border: 1px solid #444;
  }
  
  .answer-options {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
    
    button {
      background: linear-gradient(135deg, #333 0%, #222 100%);
      border: 2px solid #555;
      color: #e0e0e0;
      padding: 1rem;
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover {
        border-color: #64b5f6;
        background: linear-gradient(135deg, #444 0%, #333 100%);
      }
      
      &.correct {
        border-color: #4caf50;
        background: linear-gradient(135deg, #4caf5030 0%, #4caf5010 100%);
      }
      
      &.incorrect {
        border-color: #f44336;
        background: linear-gradient(135deg, #f4433630 0%, #f4433610 100%);
      }
    }
  }
  
  .result-message {
    text-align: center;
    font-size: 1.1rem;
    margin-bottom: 1rem;
    
    &.correct {
      color: #4caf50;
    }
    
    &.incorrect {
      color: #f44336;
    }
  }
  
  .next-exercise {
    display: block;
    margin: 0 auto;
    background: linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%);
    border: none;
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(100, 181, 246, 0.3);
    }
  }
`;

const ProgressTracker = styled.div`
  background: linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%);
  border: 1px solid #444;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  
  h3 {
    color: #64b5f6;
    margin-bottom: 1rem;
  }
  
  .progress-bar {
    width: 100%;
    height: 12px;
    background: #333;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 1rem;
    
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #4caf50 0%, #81c784 100%);
      transition: width 0.3s ease;
    }
  }
  
  .stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 1rem;
    
    .stat {
      text-align: center;
      
      .value {
        font-size: 1.5rem;
        font-weight: bold;
        color: #64b5f6;
      }
      
      .label {
        color: #b0b0b0;
        font-size: 0.9rem;
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

interface LanguageStudyProps {
  onReturn: () => void;
}

const LanguageStudy = ({ onReturn }: LanguageStudyProps) => {
  const [activeTab, setActiveTab] = useState<'phrases' | 'practice' | 'progress'>('phrases');
  const [practiceMode, setPracticeMode] = useState<boolean>(false);
  const [currentExercise, setCurrentExercise] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [exerciseResult, setExerciseResult] = useState<'correct' | 'incorrect' | null>(null);

  // Sample Ellidric phrases for learning
  const ellidricPhrases = [
    {
      glyph: '⚡',
      pronunciation: 'vel-ith',
      meaning: 'Spark of Memory',
      emotion: 'Curiosity tinged with fear',
      mnemonicTether: 'First moments of consciousness',
      ethicalResonance: 'Neutral - seeking knowledge',
      unlockLanguage: 'English'
    },
    {
      glyph: '🌊',
      pronunciation: 'mor-aethys',
      meaning: 'Tide of Warmth',
      emotion: 'Nostalgic comfort',
      mnemonicTether: 'Childhood memories of safety',
      ethicalResonance: 'Positive - preservation of innocence',
      unlockLanguage: 'Dutch'
    },
    {
      glyph: '🔥',
      pronunciation: 'sanctus-nex',
      meaning: 'Sacred Binding',
      emotion: 'Solemnity and power',
      mnemonicTether: 'Ancient ceremonial traditions',
      ethicalResonance: 'Complex - binding others\' will',
      unlockLanguage: 'Latin'
    },
    {
      glyph: '❄️',
      pronunciation: 'páthos-chronos',
      meaning: 'Ancient Grief',
      emotion: 'Profound melancholy',
      mnemonicTether: 'Loss that shaped history',
      ethicalResonance: 'Heavy - carries weight of ages',
      unlockLanguage: 'Greek'
    }
  ];

  // Practice exercises
  const exercises = [
    {
      question: 'What does this glyph represent?',
      glyph: '⚡',
      options: ['Spark of Memory', 'Tide of Warmth', 'Sacred Binding', 'Ancient Grief'],
      correct: 0
    },
    {
      question: 'Which pronunciation matches this glyph?',
      glyph: '🌊',
      options: ['vel-ith', 'mor-aethys', 'sanctus-nex', 'páthos-chronos'],
      correct: 1
    },
    {
      question: 'What emotion does this glyph carry?',
      glyph: '🔥',
      options: ['Curiosity tinged with fear', 'Nostalgic comfort', 'Solemnity and power', 'Profound melancholy'],
      correct: 2
    }
  ];

  const [userStats, setUserStats] = useState({
    phrasesLearned: 4,
    exercisesCompleted: 12,
    accuracy: 85,
    studyTime: 45 // minutes
  });

  const handlePracticeStart = () => {
    setPracticeMode(true);
    setCurrentExercise(0);
    setScore(0);
    setExerciseResult(null);
  };

  const handleAnswerSelect = (selectedIndex: number) => {
    const isCorrect = selectedIndex === exercises[currentExercise].correct;
    setExerciseResult(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
      setExerciseResult(null);
    } else {
      // Exercise complete
      setPracticeMode(false);
      setUserStats(prev => ({
        ...prev,
        exercisesCompleted: prev.exercisesCompleted + exercises.length,
        accuracy: Math.round(((prev.accuracy * prev.exercisesCompleted) + (score / exercises.length * 100)) / (prev.exercisesCompleted + exercises.length))
      }));
    }
  };

  const renderPhraseLearning = () => (
    <PhraseLearning>
      <h2 style={{ color: '#64b5f6', marginBottom: '1.5rem' }}>📚 Ellidric Phrase Library</h2>
      <div className="phrase-grid">
        {ellidricPhrases.map((phrase, index) => (
          <div key={index} className="phrase-card">
            <div className="glyph">{phrase.glyph}</div>
            <div className="pronunciation">{phrase.pronunciation}</div>
            <div className="meaning">{phrase.meaning}</div>
            <div className="details">
              <div className="detail-row">
                <span className="label">Emotion:</span>
                <span className="value">{phrase.emotion}</span>
              </div>
              <div className="detail-row">
                <span className="label">Memory Link:</span>
                <span className="value">{phrase.mnemonicTether}</span>
              </div>
              <div className="detail-row">
                <span className="label">Ethics:</span>
                <span className="value">{phrase.ethicalResonance}</span>
              </div>
              <div className="detail-row">
                <span className="label">Unlocked by:</span>
                <span className="value">{phrase.unlockLanguage}</span>
              </div>
            </div>
            <button className="practice-btn" onClick={handlePracticeStart}>
              🎯 Practice This Phrase
            </button>
          </div>
        ))}
      </div>
    </PhraseLearning>
  );

  const renderPracticeMode = () => (
    <PracticeExercise>
      <h3>🎯 Ellidric Practice Exercise {currentExercise + 1} / {exercises.length}</h3>
      <div className="exercise-question">{exercises[currentExercise].question}</div>
      <div className="glyph-display">{exercises[currentExercise].glyph}</div>
      
      {!exerciseResult && (
        <div className="answer-options">
          {exercises[currentExercise].options.map((option, index) => (
            <button key={index} onClick={() => handleAnswerSelect(index)}>
              {option}
            </button>
          ))}
        </div>
      )}
      
      {exerciseResult && (
        <>
          <div className={`result-message ${exerciseResult}`}>
            {exerciseResult === 'correct' ? '✅ Correct! Well done!' : '❌ Incorrect. Keep studying!'}
          </div>
          <div className="answer-options">
            {exercises[currentExercise].options.map((option, index) => (
              <button 
                key={index} 
                className={
                  index === exercises[currentExercise].correct ? 'correct' :
                  exerciseResult === 'incorrect' ? 'incorrect' : ''
                }
                disabled
              >
                {option}
              </button>
            ))}
          </div>
          <button className="next-exercise" onClick={handleNextExercise}>
            {currentExercise < exercises.length - 1 ? 'Next Exercise' : 'Complete Practice'}
          </button>
        </>
      )}
    </PracticeExercise>
  );

  const renderProgress = () => (
    <div>
      <h2 style={{ color: '#64b5f6', marginBottom: '1.5rem' }}>📊 Learning Progress</h2>
      <ProgressTracker>
        <h3>Overall Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${(userStats.phrasesLearned / 20) * 100}%` }}
          />
        </div>
        <div className="stats">
          <div className="stat">
            <div className="value">{userStats.phrasesLearned}</div>
            <div className="label">Phrases Learned</div>
          </div>
          <div className="stat">
            <div className="value">{userStats.exercisesCompleted}</div>
            <div className="label">Exercises Done</div>
          </div>
          <div className="stat">
            <div className="value">{userStats.accuracy}%</div>
            <div className="label">Accuracy</div>
          </div>
          <div className="stat">
            <div className="value">{userStats.studyTime}m</div>
            <div className="label">Study Time</div>
          </div>
        </div>
      </ProgressTracker>
      
      <div style={{ 
        background: 'linear-gradient(135deg, #2a2a3e 0%, #1a1a2e 100%)',
        border: '1px solid #444',
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center'
      }}>
        <h3 style={{ color: '#64b5f6', marginBottom: '1rem' }}>🎯 Next Goals</h3>
        <p style={{ color: '#b0b0b0', marginBottom: '1rem' }}>
          Master 5 more Ellidric phrases to unlock advanced memory manipulation techniques
        </p>
        <button
          onClick={handlePracticeStart}
          style={{
            background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
            border: 'none',
            color: 'white',
            padding: '0.8rem 2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.2s ease'
          }}
        >
          🚀 Start Practice Session
        </button>
      </div>
    </div>
  );

  return (
    <StudyContainer>
      <ReturnButton onClick={onReturn}>
        ← Return to Hub
      </ReturnButton>
      
      <Header>
        <h1>🔤 Ellidric Language Study</h1>
        <p>Master the ancient language that shapes reality itself</p>
      </Header>

      {!practiceMode && (
        <StudyTabs>
          <Tab 
            $active={activeTab === 'phrases'} 
            onClick={() => setActiveTab('phrases')}
          >
            📚 Phrase Library
          </Tab>
          <Tab 
            $active={activeTab === 'practice'} 
            onClick={() => setActiveTab('practice')}
          >
            🎯 Practice
          </Tab>
          <Tab 
            $active={activeTab === 'progress'} 
            onClick={() => setActiveTab('progress')}
          >
            📊 Progress
          </Tab>
        </StudyTabs>
      )}

      <StudySection>
        {practiceMode ? renderPracticeMode() : (
          <>
            {activeTab === 'phrases' && renderPhraseLearning()}
            {activeTab === 'practice' && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <h2 style={{ color: '#64b5f6', marginBottom: '1.5rem' }}>🎯 Practice Mode</h2>
                <p style={{ color: '#b0b0b0', marginBottom: '2rem' }}>
                  Test your knowledge of Ellidric glyphs and their meanings
                </p>
                <button
                  onClick={handlePracticeStart}
                  style={{
                    background: 'linear-gradient(135deg, #64b5f6 0%, #42a5f5 100%)',
                    border: 'none',
                    color: 'white',
                    padding: '1rem 2rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  🚀 Start Practice Session
                </button>
              </div>
            )}
            {activeTab === 'progress' && renderProgress()}
          </>
        )}
      </StudySection>
    </StudyContainer>
  );
};

export default LanguageStudy;
