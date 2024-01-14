// import Image from 'next/image'
// import styles from './page.module.css'

// export default function Home() {
//   return (
//     <main >
//       <h1>Hello</h1>
//     </main>
//   )
// }

// pages/index.tsx
"use client";
import { useState, useEffect } from 'react';

const HangmanGame = () => {
  const wordBank = ['elephant', 'pineapple', 'sunflower', 'mountain', 'ocean', 'giraffe', 'watermelon'];
  const [word, setWord] = useState<string>('');
  const [guessedWord, setGuessedWord] = useState<string[]>([]);
  const [clue, setClue] = useState<string>(''); // Added clue state
  const [incorrectGuesses, setIncorrectGuesses] = useState<number>(0);
  const [round, setRound] = useState<number>(1);

  useEffect(() => {
    initializeGame();
  }, [round]);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * wordBank.length);
    return wordBank[randomIndex].toLowerCase();
  };

  const generateClue = (word: string) => {
    // Display one-third of the word as a clue
    const thirdIndex = Math.ceil(word.length / 3);
    return word.substring(0, thirdIndex) + Array(word.length - thirdIndex).fill('_').join('');
  };

  const initializeGame = () => {
    const newWord = getRandomWord();
    setWord(newWord);
    setClue(generateClue(newWord));
    setGuessedWord(Array(newWord.length).fill('_'));
    setIncorrectGuesses(0);
  };

  const displayWord = () => {
    return guessedWord.map((letter, index) => <span key={index}>{letter} </span>);
  };

  const displayHangman = () => {
    const hangmanStages = [
      `
        ------
        |    |
        |
        |
        |
        |
      `,
      `
        ------
        |    |
        |    O
        |
        |
        |
      `,
      `
        ------
        |    |
        |    O
        |    |
        |
        |
      `,
      `
        ------
        |    |
        |    O
        |   /|
        |
        |
      `,
      `
        ------
        |    |
        |    O
        |   /|\\
        |
        |
      `,
      `
        ------
        |    |
        |    O
        |   /|\\
        |   /
        |
      `,
      `
        ------
        |    |
        |    O
        |   /|\\
        |   / \\
        |
      `,
    ];

    return <pre>{hangmanStages[incorrectGuesses]}</pre>;
  };

  const makeGuess = (letter: string) => {
    let newGuessedWord = [...guessedWord];
    let letterIndex = word.indexOf(letter);

    if (letterIndex !== -1) {
      while (letterIndex !== -1) {
        newGuessedWord[letterIndex] = letter;
        letterIndex = word.indexOf(letter, letterIndex + 1);
      }
      setGuessedWord(newGuessedWord);
    } else {
      setIncorrectGuesses((prev) => prev + 1);
    }
  };

  const handleGuess = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const guess = event.key.toLowerCase();

    if (guess.length === 1 && guess.match(/[a-z]/i)) {
      if (!guessedWord.includes(guess)) {
        makeGuess(guess);
      }
    }
  };

  const isGameOver = !guessedWord.includes('_') || incorrectGuesses === 6;

  return (
    <div>
      <h1>Welcome to Hangman! Try to guess the word.</h1>
      <p>Round {round}</p>
      <p>Clue: {clue}</p>
      {!isGameOver && (
        <>
          <div>{displayWord()}</div>
          <div>{displayHangman()}</div>
          <input
            type="text"
            maxLength={1}
            style={{ textTransform: 'lowercase' }}
            onKeyPress={handleGuess}
          />
        </>
      )}
      {isGameOver && (
        <div>
          <h2>
            {incorrectGuesses === 6
              ? `Sorry, you ran out of guesses. The correct word was: ${word}`
              : `Congratulations! You guessed the word: ${word}`}
          </h2>
          <button onClick={() => setRound((prevRound) => prevRound + 1)}>Next Round</button>
        </div>
      )}
    </div>
  );
};

export default HangmanGame;
