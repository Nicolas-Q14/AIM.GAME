import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [score, setScore] = useState(0);
  const [targets, setTargets] = useState([]);
  const [time, setTime] = useState(30);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  // Crear enemigo
  const createTarget = () => ({
    id: Math.random(),
    x: Math.random() * 90,
    y: Math.random() * 90,
  });

  // Inicializar
  useEffect(() => {
    setTargets([createTarget()]);
  }, []);

  // Timer
  useEffect(() => {
    if (time <= 0) {
      setGameOver(true);
      return;
    }
    const timer = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(timer);
  }, [time]);

  // Movimiento con velocidad dinámica
  useEffect(() => {
    if (gameOver) return;

    const speed = 600 - level * 80; // más nivel = más rápido

    const interval = setInterval(() => {
      setTargets((prev) =>
        prev.map((t) => ({
          ...t,
          x: Math.random() * 90,
          y: Math.random() * 90,
        }))
      );
    }, speed > 100 ? speed : 100);

    return () => clearInterval(interval);
  }, [level, gameOver]);

  // Disparo
  const shoot = (id) => {
    if (gameOver) return;

    setScore((s) => s + 10);

    // eliminar target golpeado
    setTargets((prev) => prev.filter((t) => t.id !== id));

    // agregar nuevo
    setTargets((prev) => [...prev, createTarget()]);

    // subir nivel cada 50 puntos
    if ((score + 10) % 50 === 0) {
      setLevel((l) => l + 1);
      setTargets((prev) => [...prev, createTarget()]); // más enemigos
    }
  };

  const restart = () => {
    setScore(0);
    setTime(30);
    setLevel(1);
    setGameOver(false);
    setTargets([createTarget()]);
  };

  return (
    <div className="game-container">
      <h1>🔥 Shooter Pro Max</h1>

      <div className="game-area">
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