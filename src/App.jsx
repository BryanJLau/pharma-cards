import { useState } from "react";

import logo from "./logo.svg";
import "./App.css";

import top400 from "./top400.json";
const top400Brands = Object.keys(top400);
const top400Generics = Object.values(top400);

// import drugs from "./data.json";
// const generics = Object.keys(drugs);
// const brands = Object.values(drugs).flat();

const randomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

function App() {
  const [sources, setSources] = useState(0);
  const [question, setQuestion] = useState("");
  const [answers, setAnswers] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [streak, setStreak] = useState(0);
  const [showingCorrectAnswer, setShowingCorrectAnswer] = useState(false);
  const [correct, setCorrect] = useState(null);
  const [nextQuestionTimer, setNextQuestionTimer] = useState(null);

  // Given a brand, find the correct generic
  const generateQuestion = () => {
    // Top 400
    const brand = randomElement(top400Brands);
    const generic = top400[brand];
    const potentialAnswers = [generic];
    setCorrectAnswer(generic);
    while (potentialAnswers.length < 4) {
      const potentialAnswer = randomElement(top400Generics);
      if (!potentialAnswers.includes(potentialAnswer)) {
        potentialAnswers.push(potentialAnswer);
      }
    }

    // Manual PDF version
    // Find a drug
    // const generic = randomElement(generics);
    // const brand = randomElement(drugs[generic]);
    // // Set the answer (generic)
    // const potentialAnswers = [generic];
    // setCorrectAnswer(generic);
    // // Fill in the rest of the answers
    // while (potentialAnswers.length < 4) {
    //   const potentialAnswer = randomElement(generics);
    //   if (!potentialAnswers.includes(potentialAnswer)) {
    //     potentialAnswers.push(potentialAnswer);
    //   }
    // }
    // Shuffle array
    potentialAnswers.sort(() => 0.5 - Math.random());

    setQuestion(brand);
    setAnswers(potentialAnswers);
  };

  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      <button
        onClick={() => {
          generateQuestion();
          setShowingCorrectAnswer(false);
          setCorrect(null);
          clearTimeout(nextQuestionTimer);
        }}
      >
        New Question
      </button>
      <button
        onClick={() => {
          setShowingCorrectAnswer(true);
          setNextQuestionTimer(
            setTimeout(() => {
              generateQuestion();
              setShowingCorrectAnswer(false);
              setCorrect(null);
            }, 3000)
          );
        }}
        disabled={correct !== null || showingCorrectAnswer}
      >
        Show Answer
      </button>
      <p>Current streak: {streak}</p>
      <p>
        Brand: <strong>{question}</strong>
      </p>
      {showingCorrectAnswer && <p>The correct answer is: {correctAnswer}</p>}
      {correct === true && (
        <p style={{ color: "green" }}>Correct! The answer is {correctAnswer}</p>
      )}
      {correct === false && (
        <p style={{ color: "red" }}>
          Sorry! The correct answer is {correctAnswer}
        </p>
      )}
      {answers.map((a) => (
        <p>
          <button
            onClick={() => {
              if (a === correctAnswer) {
                setStreak(streak + 1);
                setCorrect(true);
              } else {
                setStreak(0);
                setCorrect(false);
              }
              setNextQuestionTimer(
                setTimeout(() => {
                  generateQuestion();
                  setShowingCorrectAnswer(false);
                  setCorrect(null);
                }, 3000)
              );
            }}
            disabled={correct !== null || showingCorrectAnswer}
          >
            {a}
          </button>
        </p>
      ))}
    </div>
  );
}

export default App;
