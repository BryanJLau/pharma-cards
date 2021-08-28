import React, { useState, useEffect } from "react";
import { Container, Button, Typography } from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Header from "./components/Header";
import Snackbar from "./components/Snackbar";

import top400 from "./data/top400.json";

const darkTheme = createTheme({
  palette: {
    type: "dark",
  },
});

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
  // Snackbar state for message
  const [correct, setCorrect] = useState(undefined);
  // Timer to automatically go to the next question
  const [nextQuestionTimer, setNextQuestionTimer] = useState(null);
  // Disable skip question button to prevent double clicking
  const [skipDisabled, setSkipDisabled] = useState(false);

  // Scoring
  const [streak, setStreak] = useState(0);
  const [numCorrect, setNumCorrect] = useState(0);
  const [numIncorrect, setNumIncorrect] = useState(0);

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

  useEffect(() => generateQuestion(), []);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Header
        numCorrect={numCorrect}
        numIncorrect={numIncorrect}
        streak={streak}
      />
      <Snackbar correct={correct} correctAnswer={correctAnswer} />
      <Container maxWidth="sm" style={{ paddingTop: 10, textAlign: "center" }}>
        <Typography variant="h5">
          What is the generic for:
          <br />
          <strong>{question}</strong>
        </Typography>
        {answers.map((a) => (
          <p>
            <Button
              variant="contained"
              color={"primary"}
              onClick={() => {
                if (a === correctAnswer) {
                  setStreak(streak + 1);
                  setCorrect(true);
                  setNumCorrect(numCorrect + 1);
                } else {
                  setStreak(0);
                  setCorrect(false);
                  setNumIncorrect(numIncorrect + 1);
                }
                setNextQuestionTimer(
                  setTimeout(
                    () => {
                      generateQuestion();
                      setCorrect(undefined);
                    },
                    // If correct, only need 1 second confirmation
                    a === correctAnswer ? 1000 : 3000
                  )
                );
              }}
              disabled={correct !== undefined}
            >
              {a}
            </Button>
          </p>
        ))}
        <p>
          <Button
            variant="contained"
            color={"secondary"}
            onClick={() => {
              setCorrect(null);
              setNextQuestionTimer(
                setTimeout(() => {
                  generateQuestion();
                  setCorrect(undefined);
                }, 3000)
              );
            }}
            disabled={correct !== undefined}
          >
            I don't know
          </Button>
        </p>
        <p>
          <Button
            variant="contained"
            onClick={() => {
              setSkipDisabled(true);
              setCorrect(undefined);
              clearTimeout(nextQuestionTimer);
              generateQuestion();
              setTimeout(() => setSkipDisabled(false), 500);
            }}
            // Allow skipping to the next question unless debouncing
            disabled={skipDisabled}
          >
            Skip Question
          </Button>
        </p>
      </Container>
    </ThemeProvider>
  );
}

export default App;
