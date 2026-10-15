require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 10001;

// Middlewares
app.use(cors());
app.use(express.json());

// --- RUTAS API ---

// 1. Obtener todas las actividades educativas (RF-07)
app.get("/api/actividades", async (req, res) => {
  try {
    const [filas] = await pool.query("SELECT * FROM actividades");
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Registrar un nuevo estudiante (RF-01)
app.post("/api/estudiantes", async (req, res) => {
  const { nombre, edad } = req.body;
  if (!nombre || !edad) {
    return res
      .status(400)
      .json({ error: "El nombre y la edad son obligatorios." });
  }

  try {
    const [resultado] = await pool.query(
      "INSERT INTO estudiantes (nombre, edad) VALUES (?, ?)",
      [nombre, edad],
    );
    res.status(201).json({ id: resultado.insertId, nombre, edad });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Registrar puntaje/progreso de un juego (RF-05)
app.post("/api/progresos", async (req, res) => {
  const { estudiante_id, actividad_id, puntaje } = req.body;
  if (!estudiante_id || !actividad_id || puntaje === undefined) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para registrar el progreso." });
  }

  try {
    const [resultado] = await pool.query(
      "INSERT INTO progresos (estudiante_id, actividad_id, puntaje) VALUES (?, ?, ?)",
      [estudiante_id, actividad_id, puntaje],
    );
    res
      .status(201)
      .json({ id: resultado.insertId, estudiante_id, actividad_id, puntaje });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Consultar reporte de progresos (RF-06, RF-08)
app.get("/api/progresos", async (req, res) => {
  const { estudiante_id } = req.query;
  try {
    let query = `
      SELECT p.id, e.nombre AS estudiante, e.edad, a.titulo AS actividad, a.nivel, p.puntaje, p.fecha_ejecucion
      FROM progresos p
      JOIN estudiantes e ON p.estudiante_id = e.id
      JOIN actividades a ON p.actividad_id = a.id
    `;
    const params = [];

    if (estudiante_id) {
      query += " WHERE p.estudiante_id = ?";
      params.push(estudiante_id);
    }

    query += " ORDER BY p.fecha_ejecucion DESC";

    const [filas] = await pool.query(query, params);
    res.json(filas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor Backend corriendo en http://localhost:${PORT}`);
});
