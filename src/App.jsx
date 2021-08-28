import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Typography,
  Chip,
  Divider,
  Grid,
} from "@material-ui/core";
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Header from "./components/Header";
import Snackbar from "./components/Snackbar";

import top400 from "./data/top400.json";
import book from "./data/book.json";

const darkTheme = createTheme({
  palette: {
    type: "dark",
  },
});

const top400Brands = Object.keys(top400);
const top400Generics = Object.values(top400);
const bookBrands = Object.keys(book);
const bookGenerics = Object.values(book);

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

  // Leitner system buckets
  const [newBucket, setNewBucket] = useState([]);
  const [familiarBucket, setFamiliarBucket] = useState([]);
  const [masteredBucket, setMasteredBucket] = useState([]);

  // Given a brand, find the correct generic
  const generateQuestion = () => {
    // Default to random question
    let pool;
    // 5% goes to mastered bucket, 20% goes to familiar bucket
    const chance = Math.random() * 100;
    if (chance < 5 && masteredBucket.length) {
      pool = masteredBucket;
    } else if (chance < 20 && familiarBucket.length) {
      pool = familiarBucket;
    } else {
      pool =
        newBucket && newBucket.length
          ? newBucket
          : [...top400Brands, ...bookBrands];
    }
    const brand = randomElement(pool);
    const generic = top400[brand] || book[brand];
    const potentialAnswers = [generic];
    setCorrectAnswer(generic);
    while (potentialAnswers.length < 4) {
      const potentialAnswer = randomElement([
        ...top400Generics,
        ...bookGenerics,
      ]);
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

  useEffect(() => {
    // Instantly generate a question
    generateQuestion();
    // Load statistics from localStorage
    const storedCorrect = localStorage.getItem("numCorrect");
    const storedIncorrect = localStorage.getItem("numIncorrect");
    const storedStreak = localStorage.getItem("streak");
    if (storedCorrect && !isNaN(storedCorrect)) {
      setNumCorrect(parseInt(storedCorrect, 10));
    }
    if (storedIncorrect && !isNaN(storedIncorrect)) {
      setNumIncorrect(storedIncorrect);
    }
    if (storedStreak && !isNaN(storedStreak)) {
      setStreak(storedStreak);
    }
    // Load buckets from storage
    const storedFamiliarBucket = localStorage.getItem("familiarBucket");
    const storedMasteredBucket = localStorage.getItem("masteredBucket");
    try {
      const potentialFamiliarBucket = JSON.parse(storedFamiliarBucket);
      if (Array.isArray(potentialFamiliarBucket)) {
        setFamiliarBucket(potentialFamiliarBucket);
      }
      const potentialMasteredBucket = JSON.parse(storedMasteredBucket);
      if (Array.isArray(potentialMasteredBucket)) {
        setMasteredBucket(potentialMasteredBucket);
      }
      setNewBucket(
        [...top400Brands, ...bookBrands].filter(
          (brand) =>
            !(potentialFamiliarBucket || []).includes(brand) &&
            !(potentialMasteredBucket || []).includes(brand)
        )
      );
    } finally {
    }
  }, []);

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
        <Grid container justifyContent="space-around">
          <Chip label={`New: ${newBucket.length}`} variant="outlined" />
          <Divider orientation="vertical" flexItem />
          <Chip
            label={`Familiar: ${familiarBucket.length}`}
            variant="outlined"
          />
          <Divider orientation="vertical" flexItem />
          <Chip
            label={`Mastered: ${masteredBucket.length}`}
            variant="outlined"
          />
        </Grid>
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
                  // Update scores
                  setStreak(streak + 1);
                  localStorage.setItem("streak", streak + 1);
                  setCorrect(true);
                  setNumCorrect(numCorrect + 1);
                  localStorage.setItem("numCorrect", numCorrect + 1);

                  // Update buckets
                  if (newBucket.find((b) => b === question)) {
                    setNewBucket(newBucket.filter((b) => b !== question));
                    setFamiliarBucket([...familiarBucket, question]);
                  } else if (familiarBucket.find((b) => b === question)) {
                    setFamiliarBucket(
                      familiarBucket.filter((b) => b !== question)
                    );
                    setMasteredBucket([...masteredBucket, question]);
                  }
                } else {
                  // Update scores
                  setStreak(0);
                  localStorage.setItem("streak", 0);
                  setCorrect(false);
                  setNumIncorrect(numIncorrect + 1);
                  localStorage.setItem("numIncorrect", numIncorrect + 1);

                  // Update buckets
                  if (masteredBucket.find((b) => b === question)) {
                    setMasteredBucket(
                      masteredBucket.filter((b) => b !== question)
                    );
                    setFamiliarBucket([...familiarBucket, question]);
                  } else if (familiarBucket.find((b) => b === question)) {
                    setFamiliarBucket(
                      familiarBucket.filter((b) => b !== question)
                    );
                    newBucket([...newBucket, question]);
                  }
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
