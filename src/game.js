import React, { useEffect, useState } from "react";
import "./game.css";
import axios from "axios";
import {
  NotificationManager,
  NotificationContainer,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const Game = () => {
  const [showFinalResults, setFinalResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [name, setName] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(
        "https://opentdb.com/api.php?amount=5&category=21&difficulty=easy&type=multiple"
      );
      let data = res.data.results;
      setQuestionsData(data);
      setIsLoading(false);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (questionsData.length === 0) {
      return setIsLoading(true);
    } else {
      const incorrectAnswers = questionsData[
        currentQuestion
      ].incorrect_answers.map((e) => {
        return { [e]: false };
      });

      const correctAnswer = {
        [questionsData[currentQuestion].correct_answer]: true,
      };

      const answer = [...incorrectAnswers, correctAnswer].sort(
        (a, b) => 0.5 - Math.random()
      );

      setAnswers(answer);
    }
  }, [questionsData, currentQuestion]);

  const optionClicked = (e) => {
    if (e[0] === true) {
      setScore(score + 10);
      NotificationManager.success("You get 10 points", "CORRECT", 1000);
    } else {
      NotificationManager.error("Please choose carefully!", "WRONG", 1000);
    }
    if (currentQuestion + 1 < questionsData.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinalResults(true);
    }
  };

  const restartGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setFinalResults(false);
  };

  const addPlayer = (e) => {
    const allPlayer = JSON.parse(localStorage.getItem("players")) || [];
    e.preventDefault();
    if (!name && name === null) {
      return alert("Please enter your name..");
    } else {
      const newPlayer = { name: name, score: score };
      allPlayer.push(newPlayer);
      allPlayer.sort((a, b) => b.score - a.score);
      localStorage.setItem("players", JSON.stringify(allPlayer));
      allPlayer.splice(5);
      window.location.reload();
    }
  };

  if (error) {
    return <h3>Something went wrong: {error}</h3>;
  }

  return (
    <div className="game-box">
      {isLoading && <h3>Loading ...</h3>}
      {!isLoading && questionsData.length > 0 && (
        <>
          <NotificationContainer />
          <h3 className="score">Current Score: {score}</h3>
          {showFinalResults ? (
            <div className="final-results">
              <h1>Final Results</h1>
              <h3>
                {score}/{questionsData.length * 10} points (
                {(score / questionsData.length) * 10}%)
              </h3>
              <form className="game-info" onSubmit={addPlayer}>
                <input
                  placeholder="Your name.."
                  type="text"
                  className="name"
                  onChange={(e) => setName(e.target.value)}
                />
                <button type="submit" value="submit" className="save">
                  Save your point
                </button>
              </form>
              <button className="restart" onClick={() => restartGame()}>
                Restart game
              </button>
            </div>
          ) : (
            <div className="questions-container">
              <h3>
                Question {currentQuestion + 1} / {questionsData.length} :
              </h3>
              <h2 id="question-text">
                {questionsData[currentQuestion].question}
              </h2>

              {answers.map((option, index) => {
                return (
                  <div className="question-card" key={index}>
                    <p
                      onClick={() => optionClicked(Object.values(option))}
                      className="question"
                    >
                      {Object.keys(option)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Game;
