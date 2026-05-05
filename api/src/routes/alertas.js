const router = require('express').Router()
const db     = require('../db')

// GET /alertas/config/:fermentacion_id — leer umbrales configurados
router.get('/config/:fermentacion_id', async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM alertas_config WHERE fermentacion_id = $1',
      [req.params.fermentacion_id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Sin configuración' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// PATCH /alertas/config/:fermentacion_id — actualizar umbrales
router.patch('/config/:fermentacion_id', async (req, res) => {
  const { temp_min, temp_max, burbujas_inactivo_min, ph_min, ph_max } = req.body
  try {
    const { rows } = await db.query(
      `UPDATE alertas_config
       SET temp_min              = COALESCE($1, temp_min),
           temp_max              = COALESCE($2, temp_max),
           burbujas_inactivo_min = COALESCE($3, burbujas_inactivo_min),
           ph_min                = COALESCE($4, ph_min),
           ph_max                = COALESCE($5, ph_max)
       WHERE fermentacion_id = $6 RETURNING *`,
      [temp_min, temp_max, burbujas_inactivo_min, ph_min, ph_max, req.params.fermentacion_id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Sin configuración' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /alertas/log/:fermentacion_id — historial de alertas disparadas
router.get('/log/:fermentacion_id', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM alertas_log
       WHERE fermentacion_id = $1
       ORDER BY created_at DESC LIMIT 50`,
      [req.params.fermentacion_id]
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router