import React, { useState, useEffect, useRef, useMemo } from 'react';
import questionsData from './data/questions.json';
import { soundManager } from './utils/sound';
import { cuteConfetti } from './utils/confetti';
import './styles/App.css';

const MODULE_METADATA = [
  { week: 1, title: 'Intro to Conservation & Ecology', icon: '🌿', count: 10 },
  { week: 2, title: 'Earth Systems & Volcanism', icon: '🌋', count: 10 },
  { week: 3, title: 'Minerals, Rocks & Weathering', icon: '🪨', count: 10 },
  { week: 4, title: 'Atmosphere, Climate & Weather', icon: '⛅', count: 10 },
  { week: 5, title: 'Oceanography & Marine Systems', icon: '🌊', count: 10 },
  { week: 6, title: 'Fluvial Landforms & Drainage', icon: '🏞️', count: 10 },
  { week: 7, title: 'Soils, Horizons & Ecosystems', icon: '🌾', count: 10 },
  { week: 8, title: 'Wildlife & Biodiversity Conservation', icon: '🐾', count: 10 },
  { week: 9, title: 'Population Geography & Dynamics', icon: '👥', count: 10 },
  { week: 10, title: 'Natural Resources & Management', icon: '⚡', count: 10 },
  { week: 11, title: 'Economic Geography & Transport', icon: '🚂', count: 10 },
  { week: 12, title: 'Remote Sensing, GIS & Hazards', icon: '🛰️', count: 10 },
];

function formatTime(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function formatTimeLong(totalSeconds) {
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  if (mins === 0) return `${secs}s`;
  return `${mins}m ${secs}s`;
}

function shuffleArray(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  // Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('quiz_theme') || 'dark');
  const [muted, setMuted] = useState(() => soundManager.muted);

  // Dashboard state
  const [selectedWeeks, setSelectedWeeks] = useState(() => new Set([1, 2, 3]));
  const [isRandomized, setIsRandomized] = useState(true);

  // App view
  const [view, setView] = useState('dashboard'); // 'dashboard' | 'quiz' | 'results'

  // Quiz session state
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [mascotMood, setMascotMood] = useState('neutral');

  // Results review filter
  const [reviewFilter, setReviewFilter] = useState('all');

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('quiz_theme', theme);
  }, [theme]);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (view === 'quiz') {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [view]);

  // Keyboard navigation for Quiz
  useEffect(() => {
    if (view !== 'quiz') return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        handleNextOrFinish();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (['1', '2', '3', '4'].includes(e.key)) {
        const optIdx = parseInt(e.key, 10) - 1;
        handleOptionSelect(optIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [view, currentIndex, quizQuestions, userAnswers]);

  // Handlers for Theme & Audio
  const toggleTheme = () => {
    soundManager.playClick();
    setTheme(t => (t === 'dark' ? 'light' : 'dark'));
  };

  const toggleSound = () => {
    const isMuted = soundManager.toggleMute();
    setMuted(isMuted);
  };

  // Preset Handlers
  const handleSelectAll = () => {
    soundManager.playPop(580);
    setSelectedWeeks(new Set([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]));
  };

  const handleSelectFirstHalf = () => {
    soundManager.playPop(580);
    setSelectedWeeks(new Set([1, 2, 3, 4, 5, 6]));
  };

  const handleSelectSecondHalf = () => {
    soundManager.playPop(580);
    setSelectedWeeks(new Set([7, 8, 9, 10, 11, 12]));
  };

  const handleClear = () => {
    soundManager.playPop(400);
    setSelectedWeeks(new Set());
  };

  const toggleWeek = (weekNum) => {
    soundManager.playTile();
    setSelectedWeeks(prev => {
      const next = new Set(prev);
      if (next.has(weekNum)) {
        next.delete(weekNum);
      } else {
        next.add(weekNum);
      }
      return next;
    });
  };

  // Launch Quiz
  const handleStartQuiz = () => {
    if (selectedWeeks.size === 0) return;
    soundManager.playPop(880, 0.12);

    let filtered = questionsData.filter(q => selectedWeeks.has(q.week));
    if (isRandomized) {
      filtered = shuffleArray(filtered);
    }

    setQuizQuestions(filtered);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimerSeconds(0);
    setMascotMood('neutral');
    setView('quiz');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Current Question Object
  const currentQ = quizQuestions[currentIndex];
  const totalQuestions = quizQuestions.length;

  // Handle Option Click
  const handleOptionSelect = (optIdx, e) => {
    if (!currentQ || userAnswers[currentIndex]) return; // Already answered

    const isCorrect = optIdx === currentQ.answerIndex;
    const answerObj = {
      selectedIndex: optIdx,
      isCorrect,
      letter: ['a', 'b', 'c', 'd'][optIdx],
    };

    setUserAnswers(prev => ({ ...prev, [currentIndex]: answerObj }));

    if (isCorrect) {
      soundManager.playCorrect();
      setMascotMood('correct');
      const clickX = e ? e.clientX : window.innerWidth / 2;
      const clickY = e ? e.clientY : window.innerHeight / 2;
      cuteConfetti.sparkle(clickX, clickY, 22);
    } else {
      soundManager.playWrong();
      setMascotMood('wrong');
    }
  };

  // Quiz Navigation
  const handlePrev = () => {
    if (currentIndex > 0) {
      soundManager.playClick();
      setCurrentIndex(i => i - 1);
      setMascotMood('neutral');
    }
  };

  const handleNextOrFinish = () => {
    soundManager.playClick();
    if (currentIndex === totalQuestions - 1) {
      // Finish Quiz
      soundManager.playVictory();
      cuteConfetti.burst(window.innerWidth / 2, window.innerHeight * 0.35, 120);
      setView('results');
      setReviewFilter('all');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setCurrentIndex(i => i + 1);
      setMascotMood('neutral');
    }
  };

  const handleBackToDashboard = () => {
    soundManager.playPop(480);
    if (Object.keys(userAnswers).length > 0) {
      const confirmExit = window.confirm('Leave this quiz? Your current session progress will be lost.');
      if (!confirmExit) return;
    }
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Calculate Results
  const { correctCount, wrongCount, accuracy } = useMemo(() => {
    let correct = 0;
    let wrong = 0;
    quizQuestions.forEach((q, idx) => {
      const ans = userAnswers[idx];
      if (ans && ans.isCorrect) {
        correct++;
      } else {
        wrong++;
      }
    });
    const acc = totalQuestions > 0 ? Math.round((correct / totalQuestions) * 100) : 0;
    return { correctCount: correct, wrongCount: wrong, accuracy: acc };
  }, [quizQuestions, userAnswers, totalQuestions]);

  // Preset Active Calculations
  const isAllSelected = selectedWeeks.size === 12;
  const isFirstHalfSelected = selectedWeeks.size === 6 && [1, 2, 3, 4, 5, 6].every(w => selectedWeeks.has(w));
  const isSecondHalfSelected = selectedWeeks.size === 6 && [7, 8, 9, 10, 11, 12].every(w => selectedWeeks.has(w));

  return (
    <div className="app-wrapper">
      {/* Ambient Floating Aurora Background */}
      <div className="aurora-container" aria-hidden="true">
        <div className="aurora-orb orb-1"></div>
        <div className="aurora-orb orb-2"></div>
        <div className="aurora-orb orb-3"></div>
      </div>

      <div className="app-container">
        {/* Top Navbar */}
        <header className="app-header glass-panel">
          <div className="brand-section">
            <div className="brand-icon">🌏</div>
            <div>
              <h1 className="brand-title">GeoQuiz</h1>
              <p className="brand-subtitle">NPTEL Conservation Geography (Weeks 1–12)</p>
            </div>
          </div>

          <div className="header-actions">
            <button
              className="icon-btn"
              onClick={toggleSound}
              title={muted ? 'Unmute Sound' : 'Mute Sound'}
              aria-label="Toggle Sound"
            >
              {muted ? '🔇' : '🔊'}
            </button>
            <button
              className="icon-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        {/* ========================================================
             VIEW 1: DASHBOARD
        ======================================================== */}
        {view === 'dashboard' && (
          <main className="dashboard-view">
            <section className="dashboard-hero">
              <div className="hero-pill">✨ 120 Comprehensive Assignment Questions</div>
              <h2 className="hero-title">Weekly Quizzing Platform</h2>
              <p className="hero-subtitle">
                Select modules, randomize across weeks, and test your knowledge with cute visual and audio feedback!
              </p>
            </section>

            {/* Presets & Settings Bar */}
            <section className="settings-bar glass-panel">
              <div className="presets-group">
                <button
                  type="button"
                  className={`preset-chip ${isAllSelected ? 'active' : ''}`}
                  onClick={handleSelectAll}
                >
                  <span>🌟</span> All Modules (1–12)
                </button>
                <button
                  type="button"
                  className={`preset-chip ${isFirstHalfSelected ? 'active' : ''}`}
                  onClick={handleSelectFirstHalf}
                >
                  <span>🌓</span> First Half (1–6)
                </button>
                <button
                  type="button"
                  className={`preset-chip ${isSecondHalfSelected ? 'active' : ''}`}
                  onClick={handleSelectSecondHalf}
                >
                  <span>🌔</span> Second Half (7–12)
                </button>
                <button
                  type="button"
                  className="preset-chip"
                  onClick={handleClear}
                >
                  <span>🔄</span> Clear
                </button>
              </div>

              <div className="options-group">
                <button
                  type="button"
                  className={`randomize-btn ${isRandomized ? 'active' : ''}`}
                  onClick={() => {
                    soundManager.playPop(700);
                    setIsRandomized(r => !r);
                  }}
                  title="Shuffles all questions across selected modules completely"
                >
                  <span className="dice-icon">🎲</span>
                  <span>Randomize All</span>
                </button>
              </div>
            </section>

            {/* Module Grid */}
            <section className="modules-section">
              <div className="section-header">
                <div className="section-title">
                  <span>📚 Choose Modules</span>
                </div>
                <div className="selection-badge">
                  {selectedWeeks.size} module{selectedWeeks.size === 1 ? '' : 's'} ({selectedWeeks.size * 10} questions)
                </div>
              </div>

              <div className="modules-grid">
                {MODULE_METADATA.map(mod => {
                  const isSelected = selectedWeeks.has(mod.week);
                  return (
                    <div
                      key={mod.week}
                      className={`module-tile ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleWeek(mod.week)}
                    >
                      <div className="module-tile-top">
                        <span className="module-tag">Week {mod.week}</span>
                        <div className="module-check">✓</div>
                      </div>
                      <div className="module-title">{mod.icon} {mod.title}</div>
                      <div className="module-meta">
                        <span>10 questions</span>
                        <span>•</span>
                        <span>Conservation Geo</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Start Button */}
            <div className="dashboard-footer">
              <button
                type="button"
                className="start-btn"
                disabled={selectedWeeks.size === 0}
                onClick={handleStartQuiz}
              >
                {selectedWeeks.size === 0 ? (
                  <span>Select at least 1 module to start! 👆</span>
                ) : (
                  <>
                    <span>Start Quiz ({selectedWeeks.size * 10} Questions)</span>
                    <span style={{ fontSize: '1.25rem' }}>✨</span>
                  </>
                )}
              </button>
            </div>
          </main>
        )}

        {/* ========================================================
             VIEW 2: ACTIVE QUIZ
        ======================================================== */}
        {view === 'quiz' && currentQ && (
          <main className="quiz-view">
            {/* Quiz Top Navigation Bar */}
            <nav className="quiz-top-bar glass-panel">
              <button
                type="button"
                className="back-btn"
                onClick={handleBackToDashboard}
              >
                <span>←</span>
                <span>Dashboard</span>
              </button>

              <div className="quiz-progress-section">
                <div className="progress-text">
                  Question <strong>{currentIndex + 1}</strong> of {totalQuestions}
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${((currentIndex + (userAnswers[currentIndex] ? 1 : 0)) / totalQuestions) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* Elapsed Timer */}
              <div className="quiz-timer">
                <span className="timer-icon">⏱️</span>
                <span>{formatTime(timerSeconds)}</span>
              </div>
            </nav>

            {/* Question Card */}
            <article className="question-card glass-panel">
              <div className="question-meta-row">
                <span className="question-pill">
                  Week {currentQ.week} • Q{currentQ.q_num}
                </span>

                <div className="mascot-widget">
                  <span
                    className={`mascot-avatar ${
                      mascotMood === 'correct' ? 'cheer' : mascotMood === 'wrong' ? 'oops' : ''
                    }`}
                  >
                    {mascotMood === 'correct' ? '🌟' : mascotMood === 'wrong' ? '🥺' : '🦊'}
                  </span>
                  <span>
                    {mascotMood === 'correct'
                      ? 'Super cute! Correct!'
                      : mascotMood === 'wrong'
                      ? 'Almost! Keep going!'
                      : 'You got this!'}
                  </span>
                </div>
              </div>

              <h2 className="question-title">{currentQ.question}</h2>

              {/* Options */}
              <div className="options-list">
                {currentQ.options.map((optText, optIdx) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const existingAnswer = userAnswers[currentIndex];
                  const isAnswered = !!existingAnswer;
                  const isCorrectAnswer = optIdx === currentQ.answerIndex;
                  const isUserSelection = existingAnswer && existingAnswer.selectedIndex === optIdx;

                  let itemClass = 'option-item';
                  if (isAnswered) {
                    itemClass += ' disabled';
                    if (isCorrectAnswer) {
                      itemClass += ' correct';
                    } else if (isUserSelection && !existingAnswer.isCorrect) {
                      itemClass += ' wrong';
                    }
                  }

                  return (
                    <div
                      key={optIdx}
                      className={itemClass}
                      onClick={(e) => handleOptionSelect(optIdx, e)}
                    >
                      <div className="option-letter">{letters[optIdx]}</div>
                      <div className="option-text">{optText}</div>
                      <div className="option-status-icon">
                        {isAnswered && (isCorrectAnswer ? '✓' : isUserSelection ? '✗' : '')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            {/* Bottom Actions */}
            <footer className="quiz-bottom-bar glass-panel">
              <button
                type="button"
                className="secondary-btn"
                disabled={currentIndex === 0}
                onClick={handlePrev}
              >
                <span>←</span>
                <span>Previous</span>
              </button>

              <button
                type="button"
                className="primary-btn"
                onClick={handleNextOrFinish}
              >
                <span>{currentIndex === totalQuestions - 1 ? 'Finish Quiz' : 'Next'}</span>
                <span>{currentIndex === totalQuestions - 1 ? '✨' : '→'}</span>
              </button>
            </footer>
          </main>
        )}

        {/* ========================================================
             VIEW 3: RESULTS & REVIEW
        ======================================================== */}
        {view === 'results' && (
          <main className="results-view">
            <section className="celebration-card glass-panel">
              <div className="celebration-mascot">
                {accuracy >= 80 ? '🥳' : accuracy >= 50 ? '🌱' : '🐣'}
              </div>
              <h2 className="celebration-title">
                {accuracy >= 80
                  ? 'Outstanding Work!'
                  : accuracy >= 50
                  ? 'Great Effort!'
                  : 'Good Practice Run!'}
              </h2>
              <p className="celebration-subtitle">
                {accuracy >= 80
                  ? 'You really mastered these conservation concepts!'
                  : accuracy >= 50
                  ? 'Solid progress! Review your mistakes below to level up!'
                  : 'Every mistake is a chance to learn! Check the solutions below!'}
              </p>
            </section>

            {/* Stats Cards */}
            <section className="stats-grid">
              <div className="stat-card glass-panel correct-stat">
                <div className="stat-icon">🎯</div>
                <div className="stat-value">{correctCount} / {totalQuestions}</div>
                <div className="stat-label">Correct Answers</div>
              </div>

              <div className="stat-card glass-panel wrong-stat">
                <div className="stat-icon">💡</div>
                <div className="stat-value">{wrongCount}</div>
                <div className="stat-label">Incorrect Answers</div>
              </div>

              <div className="stat-card glass-panel time-stat">
                <div className="stat-icon">⏱️</div>
                <div className="stat-value">{formatTimeLong(timerSeconds)}</div>
                <div className="stat-label">Time Taken</div>
              </div>

              <div className="stat-card glass-panel accuracy-stat">
                <div className="stat-icon">⭐</div>
                <div className="stat-value">{accuracy}%</div>
                <div className="stat-label">Accuracy</div>
              </div>
            </section>

            {/* Actions */}
            <div className="results-actions">
              <button
                type="button"
                className="primary-btn proceed-btn"
                onClick={() => {
                  soundManager.playPop(520);
                  setView('dashboard');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
              >
                <span>Proceed to Dashboard</span>
                <span>🏠</span>
              </button>

              <button
                type="button"
                className="secondary-btn proceed-btn"
                onClick={handleStartQuiz}
              >
                <span>🔄 Retry Same Quiz</span>
              </button>
            </div>

            {/* Question Review List */}
            <section className="review-section glass-panel">
              <div className="review-header">
                <h3 className="review-title">
                  <span>📝 Detailed Review</span>
                </h3>

                <div className="filter-pills">
                  <button
                    type="button"
                    className={`filter-pill ${reviewFilter === 'all' ? 'active' : ''}`}
                    onClick={() => {
                      soundManager.playClick();
                      setReviewFilter('all');
                    }}
                  >
                    All Questions ({totalQuestions})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${reviewFilter === 'wrong' ? 'active' : ''}`}
                    onClick={() => {
                      soundManager.playClick();
                      setReviewFilter('wrong');
                    }}
                  >
                    Mistakes Only ({wrongCount})
                  </button>
                  <button
                    type="button"
                    className={`filter-pill ${reviewFilter === 'correct' ? 'active' : ''}`}
                    onClick={() => {
                      soundManager.playClick();
                      setReviewFilter('correct');
                    }}
                  >
                    Correct Only ({correctCount})
                  </button>
                </div>
              </div>

              <div className="review-list">
                {quizQuestions
                  .map((q, idx) => {
                    const ans = userAnswers[idx];
                    const isCorrect = ans && ans.isCorrect;
                    if (reviewFilter === 'correct' && !isCorrect) return null;
                    if (reviewFilter === 'wrong' && isCorrect) return null;

                    const userChoiceText = ans ? q.options[ans.selectedIndex] : 'Not answered';
                    const userChoiceLetter = ans ? ans.letter.toUpperCase() : '-';
                    const correctText = q.options[q.answerIndex];
                    const correctLetter = q.answerLetter.toUpperCase();

                    return (
                      <div key={q.id} className="review-item">
                        <div className="review-item-header">
                          <span style={{ color: 'var(--primary)' }}>
                            Week {q.week} • Q{q.q_num}
                          </span>
                          <span
                            style={{
                              color: isCorrect ? 'var(--correct)' : 'var(--wrong)',
                              fontWeight: 700,
                            }}
                          >
                            {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                          </span>
                        </div>
                        <div className="review-item-q">{q.question}</div>
                        <div className="review-ans-box">
                          <div className={`user-ans-row ${isCorrect ? '' : 'wrong-flag'}`}>
                            <strong>Your answer:</strong> ({userChoiceLetter}) {userChoiceText}
                          </div>
                          {!isCorrect && (
                            <div className="correct-ans-row">
                              <strong>Correct answer:</strong> ({correctLetter}) {correctText}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                  .filter(Boolean)}
              </div>
            </section>
          </main>
        )}
      </div>
    </div>
  );
}
