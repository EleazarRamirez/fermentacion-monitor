const router  = require('express').Router()
const db      = require('../db')

// GET /fermentaciones — listar todos los lotes
router.get('/', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM fermentaciones ORDER BY created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /fermentaciones/:id — detalle de un lote
router.get('/:id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM fermentaciones WHERE id = $1',
      [req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// POST /fermentaciones — crear nuevo lote
router.post('/', async (req, res) => {
  const { nombre, estilo, descripcion } = req.body
  if (!nombre) return res.status(400).json({ error: 'El campo nombre es requerido' })
  try {
    const { rows } = await db.query(
      `INSERT INTO fermentaciones (nombre, estilo, descripcion)
       VALUES ($1, $2, $3) RETURNING *`,
      [nombre, estilo, descripcion]
    )
    // Crear configuración de alertas por defecto
    await db.query(
      'INSERT INTO alertas_config (fermentacion_id) VALUES ($1)',
      [rows[0].id]
    )
    res.status(201).json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /fermentaciones/:id — actualizar (nombre, activa, etc.)
router.patch('/:id', async (req, res) => {
  const { nombre, estilo, descripcion, activa } = req.body
  try {
    const { rows } = await db.query(
      `UPDATE fermentaciones
       SET nombre      = COALESCE($1, nombre),
           estilo      = COALESCE($2, estilo),
           descripcion = COALESCE($3, descripcion),
           activa      = COALESCE($4, activa),
           updated_at  = NOW()
       WHERE id = $5 RETURNING *`,
      [nombre, estilo, descripcion, activa, req.params.id]
    )
    if (!rows.length) return res.status(404).json({ error: 'No encontrado' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// DELETE /fermentaciones/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM fermentaciones WHERE id = $1', [req.params.id])
    res.status(204).end()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router