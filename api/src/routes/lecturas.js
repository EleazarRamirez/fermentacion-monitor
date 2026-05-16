const router = require('express').Router()
const db     = require('../db')

// Se inyecta la instancia de Socket.io desde index.js
let io

router.setIo = (socketIo) => { io = socketIo }

// POST /lecturas — el ESP32 envía aquí sus lecturas
// Body esperado: { fermentacion_id, temperatura_mosto, burbujas_por_minuto, ph }
router.post('/', async (req, res) => {
  const { fermentacion_id, temperatura_mosto, burbujas_por_minuto, ph } = req.body

  if (!fermentacion_id) {
    return res.status(400).json({ error: 'fermentacion_id es requerido' })
  }

  try {
    const { rows } = await db.query(
      `INSERT INTO lecturas (fermentacion_id, temperatura_mosto, burbujas_por_minuto, ph)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [fermentacion_id, temperatura_mosto, burbujas_por_minuto, ph]
    )

    const lectura = rows[0]

    // Emitir en tiempo real a todos los clientes conectados al dashboard
    if (io) {
      io.emit('nueva_lectura', lectura)
    }

    // Verificar alertas
    await verificarAlertas(lectura)

    res.status(201).json(lectura)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /lecturas/:fermentacion_id — historial de lecturas de un lote
// Query params opcionales: ?limite=100&desde=2025-01-01
router.get('/:fermentacion_id', async (req, res) => {
  const { limite = 200, desde } = req.query
  try {
    let query = `
      SELECT * FROM lecturas
      WHERE fermentacion_id = $1
      ${desde ? 'AND created_at >= $3' : ''}
      ORDER BY created_at DESC
      LIMIT $2
    `
    const params = desde
      ? [req.params.fermentacion_id, limite, desde]
      : [req.params.fermentacion_id, limite]

    const { rows } = await db.query(query, params)
    // Invertir para que el frontend reciba cronológicamente
    res.json(rows.reverse())
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// GET /lecturas/:fermentacion_id/ultima — última lectura registrada
router.get('/:fermentacion_id/ultima', async (req, res) => {
  try {
    const { rows } = await db.query(
      `SELECT * FROM lecturas
       WHERE fermentacion_id = $1
       ORDER BY created_at DESC LIMIT 1`,
      [req.params.fermentacion_id]
    )
    if (!rows.length) return res.status(404).json({ error: 'Sin lecturas aún' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// ── Lógica de alertas ──────────────────────────────────────────────
async function verificarAlertas(lectura) {
  try {
    const { rows } = await db.query(
      'SELECT * FROM alertas_config WHERE fermentacion_id = $1',
      [lectura.fermentacion_id]
    )
    if (!rows.length) return

    const config = rows[0]
    const alertas = []

    if (lectura.temperatura_mosto !== null) {
      if (lectura.temperatura_mosto > config.temp_max) {
        alertas.push({
          tipo: 'temp_alta',
          mensaje: `Temperatura del mosto alta: ${lectura.temperatura_mosto}°C (máx ${config.temp_max}°C)`,
          valor: lectura.temperatura_mosto
        })
      }
      if (lectura.temperatura_mosto < config.temp_min) {
        alertas.push({
          tipo: 'temp_baja',
          mensaje: `Temperatura del mosto baja: ${lectura.temperatura_mosto}°C (mín ${config.temp_min}°C)`,
          valor: lectura.temperatura_mosto
        })
      }
    }

    if (lectura.ph !== null) {
      if (lectura.ph < config.ph_min) {
        alertas.push({
          tipo: 'ph_bajo',
          mensaje: `pH bajo: ${lectura.ph} (mín ${config.ph_min}) — posible contaminación`,
          valor: lectura.ph
        })
      }
      if (lectura.ph > config.ph_max) {
        alertas.push({
          tipo: 'ph_alto',
          mensaje: `pH alto: ${lectura.ph} (máx ${config.ph_max})`,
          valor: lectura.ph
        })
      }
    }

    for (const alerta of alertas) {
      await db.query(
        `INSERT INTO alertas_log (fermentacion_id, tipo, mensaje, valor)
         VALUES ($1, $2, $3, $4)`,
        [lectura.fermentacion_id, alerta.tipo, alerta.mensaje, alerta.valor]
      )
      // Emitir alerta al dashboard en tiempo real
      if (io) io.emit('nueva_alerta', { ...alerta, fermentacion_id: lectura.fermentacion_id })
    }
  } catch (err) {
    console.error('Error verificando alertas:', err.message)
  }
}

module.exports = router