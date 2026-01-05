import { useState, useEffect, useCallback } from 'react';

// Expanded Dictionary
const WORDS = {
  easy: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "it", "for", "not", "on", "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could", "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think", "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even", "new", "want", "because", "any", "these", "give", "day", "most", "us"
  ],
  medium: [
    "The quick brown fox jumps over the lazy dog",
    "Nature provides us with everything we need to survive",
    "Technology is changing the way we live today",
    "Always believe that something wonderful is about to happen",
    "Creativity is intelligence having fun in the moment",
    "Success is not final failure is not fatal",
    "To be or not to be that is the question",
    "All that glitters is not gold",
    "A journey of a thousand miles begins with a single step",
    "Keep your face always toward the sunshine and shadows will fall behind you",
    "What you do today can improve all your tomorrows",
    "The only way to do great work is to love what you do",
    "Life is what happens when you are busy making other plans",
    "Get busy living or get busy dying",
    "You only live once but if you do it right once is enough",
    "In three words I can sum up everything I have learned about life it goes on"
  ],
  hard: [
    "Sphinx of black quartz, judge my vow",
    "The five boxing wizards jump quickly",
    "Pack my box with five dozen liquor jugs",
    "The algorithm's complexity exceeded logarithmic bounds",
    "Cryptographic hashes ensure data integrity protocols",
    "Asynchronous functions promise future execution contexts",
    "Quantum entanglement suggests instantaneous information transfer",
    "Polymorphism allows objects to be treated as instances of their parent class",
    "Neuroplasticity refers to the brain's ability to reorganize itself",
    "Photosynthesis converts light energy into chemical energy",
    "Mitochondria are the powerhouses of the cell",
    "Schrodinger's cat is a thought experiment in quantum mechanics",
    "Pneumonoultramicroscopicsilicovolcanoconiosis",
    "Pseudocode is an informal high-level description of the operating principle",
    "Recursion is a method of solving a problem where the solution depends on solutions to smaller instances"
  ]
};

export default function useTypingGame() {
  const [timeOption, setTimeOption] = useState(30); // 0 = Infinite
  const [difficulty, setDifficulty] = useState('medium');

  const [text, setText] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [elapsedTime, setElapsedTime] = useState(0); // Track time up for infinite mode
  const [gameState, setGameState] = useState("idle"); 
  const [userInput, setUserInput] = useState("");
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [errors, setErrors] = useState(0);
  const [totalTyped, setTotalTyped] = useState(0);

  const generateText = useCallback(() => {
    const list = WORDS[difficulty];
    
    if (difficulty === 'easy') {
      // Generate random 20 words sequence
      const shuffled = [...list].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 20).join(' ');
    } else {
      // Pick random sentence
      return list[Math.floor(Math.random() * list.length)];
    }
  }, [difficulty]);

  const resetGame = useCallback(() => {
    setText(generateText());
    setTimeLeft(timeOption);
    setElapsedTime(0);
    setGameState("idle");
    setUserInput("");
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setTotalTyped(0);
  }, [timeOption, difficulty, generateText]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  const handleKeyPress = useCallback((e) => {
    if (gameState === 'end') return;

    if (e.key === 'Escape') {
      resetGame();
      return;
    }

    if (gameState === 'idle') {
      setGameState('run');
    }

    const typedChar = e.key;

    if (typedChar === 'Backspace') {
      setUserInput((prev) => prev.slice(0, -1));
      return;
    }

    if (typedChar.length > 1) return;

    setTotalTyped((prev) => prev + 1);

    setUserInput((prev) => {
      const currentText = text;
      const currentIndex = prev.length;
      
      if (typedChar !== currentText[currentIndex]) {
        setErrors((prevErr) => prevErr + 1);
      }
      
      const newInput = prev + typedChar;
      if (newInput.length === currentText.length) {
        setGameState('end');
      }
      return newInput;
    });

  }, [gameState, text, resetGame]);

  // Accuracy
  useEffect(() => {
    if (totalTyped > 0) {
      const calculatedAccuracy = ((totalTyped - errors) / totalTyped) * 100;
      setAccuracy(Math.max(0, Math.round(calculatedAccuracy)));
    }
  }, [totalTyped, errors]);

  // Timer Logic (Handles both Countdown and Infinite)
  useEffect(() => {
    let interval;
    if (gameState === "run") {
      interval = setInterval(() => {
        if (timeOption > 0) {
          // Countdown Mode
          setTimeLeft((prev) => {
            if (prev <= 1) {
              setGameState("end");
              return 0;
            }
            return prev - 1;
          });
        } else {
          // Infinite Mode (Count Up)
          setElapsedTime((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameState, timeOption]);

  // WPM Calculation
  useEffect(() => {
    if (gameState === "run" || gameState === "end") {
      const words = userInput.length / 5;
      
      // Calculate time spent based on mode
      const timeSpent = timeOption > 0 ? (timeOption - timeLeft) : elapsedTime;
      const minutes = timeSpent / 60;
      
      if (minutes > 0) {
        setWpm(Math.round(words / minutes));
      }
    }
  }, [userInput, timeLeft, elapsedTime, gameState, timeOption]);

  return {
    text,
    timeLeft,
    elapsedTime, // Export this
    gameState,
    userInput,
    wpm,
    accuracy,
    timeOption,
    setTimeOption,
    difficulty,
    setDifficulty,
    resetGame,
    handleKeyPress
  };
}