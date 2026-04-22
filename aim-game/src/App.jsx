import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState([]);
  const [time, setTime] = useState(30);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState("medium");

  const difficultySpeed = {
    easy: 900,
    medium: 600,
    hard: 400,
  };

  // crear enemigo
  const createTarget = () => ({
    id: Math.random(),
    x: Math.random() * 90,
    y: Math.random() * 90,
  });

  // iniciar juego
  useEffect(() => {
    if (started) {
      setTargets([createTarget()]);
    }
  }, [started]);

  // tiempo
  useEffect(() => {
    if (!started || gameOver) return;

    if (time <= 0) {
      setGameOver(true);
      return;
    }

    const timer = setTimeout(() => setTime((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [time, started, gameOver]);

  // movimiento enemigos
  useEffect(() => {
    if (!started || gameOver) return;

    const baseSpeed = difficultySpeed[difficulty];
    const speed = baseSpeed - level * 60;

    const interval = setInterval(() => {
      setTargets((prev) =>
        prev.map((t) => ({
          ...t,
          x: Math.random() * 90,
          y: Math.random() * 90,
        }))
      );
    }, speed > 120 ? speed : 120);

    return () => clearInterval(interval);
  }, [level, difficulty, started, gameOver]);

  // disparo
  const shoot = (id) => {
    if (gameOver) return;

    const newScore = score + 10;
    setScore(newScore);

    setTargets((prev) => prev.filter((t) => t.id !== id));
    setTargets((prev) => [...prev, createTarget()]);

    if (newScore % 50 === 0) {
      setLevel((l) => l + 1);
      setTargets((prev) => [...prev, createTarget()]);
    }
  };

  const restart = () => {
    setScore(0);
    setTime(30);
    setLevel(1);
    setGameOver(false);
    setTargets([createTarget()]);
  };

  // 🎮 MENÚ
  if (!started) {
    return (
      <div className="menu">
        <h1>🎯 Shooter Pro Max</h1>
        <h2>Selecciona dificultad</h2>

        <div className="buttons">
          <button onClick={() => setDifficulty("easy")}>Fácil</button>
          <button onClick={() => setDifficulty("medium")}>Media</button>
          <button onClick={() => setDifficulty("hard")}>Difícil</button>
        </div>

        <button className="start" onClick={() => setStarted(true)}>
          Iniciar Juego
        </button>
      </div>
    );
  }

  return (
    <div
      className="game-container"
      onMouseMove={(e) => {
        const cursor = document.querySelector(".crosshair");
        if (cursor) {
          cursor.style.left = e.clientX + "px";
          cursor.style.top = e.clientY + "px";
        }
      }}
    >
      <h1>🔥 Shooter Pro Max</h1>

      <div className="game-area">
        {/* 🎯 MIRA */}
        <div className="crosshair"></div>

        {/* 🔫 ARMA */}
        <div className="gun"></div>

        {!gameOver &&
          targets.map((t) => (
            <div
              key={t.id}
              className="target"
              style={{ top: `${t.y}%`, left: `${t.x}%` }}
              onClick={() => shoot(t.id)}
            ></div>
          ))}

        {gameOver && (
          <div className="game-over">
            <h2>💀 Game Over</h2>
            <p>Puntaje: {score}</p>
            <p>Nivel alcanzado: {level}</p>
            <button onClick={restart}>Reiniciar</button>
          </div>
        )}
      </div>

      <div className="info">
        <p>Score: {score}</p>
        <p>Tiempo: {time}s</p>
        <p>Nivel: {level}</p>
      </div>
    </div>
  );
}

export default App;