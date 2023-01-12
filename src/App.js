import Game from "./game";
import "./App.css";
import { useState } from "react";

function App() {
  const [playGame, setPlayGame] = useState(false);
  const highScores = JSON.parse(localStorage.getItem("players"));

  return (
    <div className="container">
      <div id="home">
        <h1>Quick Sport Quiz</h1>
        {playGame ? (
          <>
            <button
              onClick={() => {
                setPlayGame(!playGame);
              }}
              className="btn-stop"
            >
              Stop
            </button>
            <Game />
          </>
        ) : (
          <>
            <button
              onClick={() => {
                setPlayGame(!playGame);
              }}
              className="btn"
            >
              Play
            </button>
            <div id="highScores">
              <div className="wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Name</th>
                      <th>Point</th>
                    </tr>
                  </thead>
                  <tbody>
                    {highScores === null ? (
                      <tr>
                        <td colSpan={3} style={{ textAlign: "center" }}>
                          No Data Players
                        </td>
                      </tr>
                    ) : (
                      highScores.map((e, id) => {
                        return (
                          <tr key={id}>
                            <td className="rank">
                              {highScores.indexOf(e) + 1}
                            </td>
                            <td className="team">{e.name}</td>
                            <td className="points">{e.score}</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
