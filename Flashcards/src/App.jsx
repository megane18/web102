import React, { useState, useEffect } from 'react';
import { useSpring, animated } from 'react-spring';
import './Flashcard.css';

const cardData = [
  { 
    /* Add Haitian Creole flashcard component with animations*/
    question: "Bonjou!", 
    answer: "Bonjou!", 
    translation: "Hello! (used in the morning)"
  },
  { 
    question: "Bonswa!", 
    answer: "Bonswa!", 
    translation: "Good evening! / Hello! (used in the afternoon and evening)"
  },
  { 
    question: "Koman ou ye?", 
    answer: "Mwen byen, mèsi. E ou menm?", 
    translation: "How are you? | I'm well, thank you. And you?"
  },
  { 
    question: "Kijan ou rele?", 
    answer: "Mwen rele ....", 
    translation: "What's your name? | My name is ...."
  },
  { 
    question: "Mwen kontan rankontre ou!", 
    answer: "Mwen kontan rankontre ou tou!", 
    translation: "Nice to meet you! | Nice to meet you too!"
  },
  { 
    question: "Orevwa!", 
    answer: "Orevwa! N a wè pita!", 
    translation: "Goodbye! | Goodbye! See you later!"
  },
  { 
    question: "Mèsi anpil!", 
    answer: "Pa gen pwoblèm!", 
    translation: "Thank you very much! | You're welcome! (No problem!)"
  }
];

const colors = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];

const Flashcard = () => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [colorIndex, setColorIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentColor = colors[colorIndex];
  const currentCard = cardData[currentCardIndex];

  useEffect(() => {
    const timer = setTimeout(() => setShowAnswer(true), 300);
    return () => clearTimeout(timer);
  }, [isFlipped]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setShowAnswer(false);
  };

  const changeCard = (direction) => {
    const newIndex = (currentCardIndex + direction + cardData.length) % cardData.length;
    setCurrentCardIndex(newIndex);
    setColorIndex((colorIndex + 1) % colors.length);
    setIsFlipped(false);
    setShowAnswer(false);
  };

  const getContrastColor = (hexColor) => {
    const r = parseInt(hexColor.substr(1, 2), 16);
    const g = parseInt(hexColor.substr(3, 2), 16);
    const b = parseInt(hexColor.substr(5, 2), 16);
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return (yiq >= 128) ? '#000000' : '#FFFFFF';
  };

  const contrastColor = getContrastColor(currentColor);

  // Animation properties for the header and subheader
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

  return (
    <div className="container" style={{backgroundColor: `${currentColor}22`, color: contrastColor}}>
      <animated.h1 style={headerProps} className="text-4xl font-bold text-white mb-4 text-center">
        Haitian Creole Flashcards
      </animated.h1>
      <animated.h2 style={subheaderProps} className="text-2xl text-yellow-300 font-semibold text-center">
        Learn Basic Greetings in Creole 😁
        <span className="inline-block animate-bounce ml-2">👋</span>
      </animated.h2>
      
      <div className="card-container">
        <div className={`card ${isFlipped ? 'flipped' : ''}`} onClick={handleFlip}>
          <div className="card-face card-front" style={{backgroundColor: currentColor, color: contrastColor}}>
            {currentCard.question}
          </div>
          <div className="card-face card-back" style={{backgroundColor: contrastColor, color: currentColor}}>
            {showAnswer && (
              <>
                <div className="answer">{currentCard.answer}</div>
                <div className="translation-container">
                  <div className="translation">{currentCard.translation}</div>
                </div>
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
          onClick={() => changeCard(1)}
        >
          Next
        </button>
      </div>

      <div className="progress-container">
        <div 
          className="progress-bar" 
          style={{
            backgroundColor: currentColor,
            width: `${((currentCardIndex + 1) / cardData.length) * 100}%`
          }}
        ></div>
      </div>
    </div>
  );
};

export default Flashcard;
