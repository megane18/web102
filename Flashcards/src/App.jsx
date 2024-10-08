import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './Flashcard.css';

const cardData = [
  { 
    question: "Bonjou!", 
    acceptableAnswers: ["Hello", "Good morning"],
    answer: "Bonjou!", 
    translation: "Hello! (used in the morning)"
  },
  { 
    question: "Bonswa!", 
    acceptableAnswers: ["Hello", "Good evening", "Good afternoon"],
    answer: "Bonswa!", 
    translation: "Good evening! / Hello! (used in the afternoon and evening)"
  },
  { 
    question: "Koman ou ye?", 
    acceptableAnswers: ["How are you"],
    answer: "Mwen byen, mèsi. E ou menm?", 
    translation: "How are you? | I'm well, thank you. And you?"
  },
  { 
    question: "Kijan ou rele?", 
    acceptableAnswers: ["What is your name", "What's your name"],
    answer: "Mwen rele ....", 
    translation: "What's your name? | My name is ...."
  },
  { 
    question: "Mwen kontan rankontre ou!", 
    acceptableAnswers: ["Nice to meet you", "Pleased to meet you"],
    answer: "Mwen kontan rankontre ou tou!", 
    translation: "Nice to meet you! | Nice to meet you too!"
  },
  { 
    question: "Orevwa!", 
    acceptableAnswers: ["Goodbye", "Bye"],
    answer: "Orevwa! N a wè pita!", 
    translation: "Goodbye! | Goodbye! See you later!"
  },
  { 
    question: "Mèsi anpil!", 
    acceptableAnswers: ["Thank you", "Thank you very much", "Thanks"],
    answer: "Pa gen pwoblèm!", 
    translation: "Thank you very much! | You're welcome! (No problem!)"
  }
];

const colors = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];

const Flashcard = () => {
  const [cards, setCards] = useState(cardData);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [userGuess, setUserGuess] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [masteredCards, setMasteredCards] = useState([]);
  const [showMasteredCards, setShowMasteredCards] = useState(false);

  const currentColor = colors[colorIndex];
  const currentCard = cards[currentCardIndex];

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  };

  const contrastColor = getContrastColor(currentColor);

  useEffect(() => {
    const timer = setTimeout(() => setShowAnswer(true), 300);
    return () => clearTimeout(timer);
  }, [isFlipped]);

  const checkAnswer = () => {
    const userAnswer = userGuess.trim().toLowerCase();
    const acceptableAnswers = currentCard.acceptableAnswers.map(answer => 
      answer.toLowerCase()
    );
    
    const isCorrect = acceptableAnswers.some(answer => 
      userAnswer === answer || 
      answer.includes(userAnswer) || 
      userAnswer.includes(answer)
    );

    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setStreak(streak + 1);
      setLongestStreak(Math.max(longestStreak, streak + 1));
    } else {
      setStreak(0);
    }
    
    setIsFlipped(true);
    setShowAnswer(false);
    setTimeout(() => setShowAnswer(true), 300);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !isFlipped) {
      checkAnswer();
    }
  };

  const changeCard = (direction) => {
    const newIndex = (currentCardIndex + direction + cards.length) % cards.length;
    setCurrentCardIndex(newIndex);
    setColorIndex((colorIndex + 1) % colors.length);
    setIsFlipped(false);
    setShowAnswer(false);
    setUserGuess('');
    setFeedback(null);
  };

  const shuffleCards = () => {
    const shuffledCards = [...cards].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setShowAnswer(false);
    setUserGuess('');
    setFeedback(null);
  };

  const markAsMastered = () => {
    const newMasteredCards = [...masteredCards, currentCard];
    setMasteredCards(newMasteredCards);
    
    const remainingCards = cards.filter((_, index) => index !== currentCardIndex);
    if (remainingCards.length === 0) {
      setCards(cardData);
    } else {
      setCards(remainingCards);
      setCurrentCardIndex(currentCardIndex % remainingCards.length);
    }
    
    setIsFlipped(false);
    setShowAnswer(false);
    setUserGuess('');
    setFeedback(null);
  };

  const toggleMasteredCards = () => {
    setShowMasteredCards(!showMasteredCards);
  };

  // Animation properties
  const headerProps = useSpring({
    from: { opacity: 0, transform: 'translateY(-50px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
    config: { tension: 300, friction: 10 },
  });

  const subheaderProps = useSpring({
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 1, transform: 'scale(1)' },
    delay: 500,
    config: { tension: 300, friction: 10 },
  });

  const statsProps = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    delay: 1000,
  });

  return (
    <div className="container" style={{backgroundColor: `${currentColor}22`, color: contrastColor}}>
      <animated.h1 style={headerProps} className="header">
        Haitian Creole Flashcards
      </animated.h1>
      <animated.h2 style={subheaderProps} className="subheader">
        Learn Basic Greetings in Creole 😁
        <span className="inline-block animate-bounce ml-2">👋</span>
      </animated.h2>
      
      <animated.div style={statsProps} className="stats-container">
        <div className="stat">Streak: {streak}</div>
        <div className="stat">Best: {longestStreak}</div>
      </animated.div>
      
      <div className="card-container">
        <div className={`card ${isFlipped ? 'flipped' : ''}`}>
          <div className="card-face card-front" style={{backgroundColor: currentColor, color: contrastColor}}>
            <div className="question">{currentCard.question}</div>
            {!isFlipped && (
              <div className="input-container">
                <input
                  type="text"
                  value={userGuess}
                  onChange={(e) => setUserGuess(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your answer..."
                  className="answer-input"
                  style={{color: currentColor}}
                />
                <button 
                  onClick={checkAnswer}
                  className="submit-button"
                  style={{backgroundColor: contrastColor, color: currentColor}}
                >
                  Check
                </button>
              </div>
            )}
          </div>
          <div className="card-face card-back" style={{backgroundColor: contrastColor, color: currentColor}}>
            {showAnswer && (
              <>
                <div className={`feedback ${feedback}`}>
                  {feedback === 'correct' ? '✅' : feedback === 'incorrect' ? '❌' : ''}
                </div>
                <div className="answer">{currentCard.answer}</div>
                <div className="translation">{currentCard.translation}</div>
                <button 
                  onClick={markAsMastered}
                  className="master-button"
                  style={{backgroundColor: currentColor, color: contrastColor}}
                >
                  Mark as Mastered
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="button-container">
        <button 
          className="nav-button"
          style={{backgroundColor: currentColor, color: contrastColor}}
          onClick={() => changeCard(-1)}
        >
          Previous
        </button>
        <button 
          className="nav-button"
          style={{backgroundColor: currentColor, color: contrastColor}}
          onClick={shuffleCards}
        >
          Shuffle
        </button>
        <button 
          className="nav-button"
          style={{backgroundColor: currentColor, color: contrastColor}}
          onClick={() => changeCard(1)}
        >
          Next
        </button>
      </div>

      <div className="progress-container">
        <div className="progress-label">
          Mastered: {masteredCards.length} / {cardData.length}
        </div>
        <div 
          className="progress-bar" 
          style={{
            backgroundColor: currentColor,
            width: `${(masteredCards.length / cardData.length) * 100}%`
          }}
        ></div>
      </div>

      <button 
        className="toggle-mastered-button"
        style={{backgroundColor: currentColor, color: contrastColor, marginTop: '1rem'}}
        onClick={toggleMasteredCards}
      >
        {showMasteredCards ? 'Hide Mastered Cards' : 'Show Mastered Cards'}
      </button>

      {showMasteredCards && (
        <div className="mastered-cards-container" style={{color: contrastColor}}>
          <h3>Mastered Cards:</h3>
          <ul>
            {masteredCards.map((card, index) => (
              <li key={index}>
                <strong>{card.question}</strong> - {card.answer}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Flashcard;