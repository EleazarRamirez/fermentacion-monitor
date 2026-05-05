const express    = require('express')
const http       = require('http')
const { Server } = require('socket.io')
const cors       = require('cors')

const fermentacionesRouter = require('./routes/fermentaciones')
const lecturasRouter       = require('./routes/lecturas')
const alertasRouter        = require('./routes/alertas')

const app    = express()
const server = http.createServer(app)
const io     = new Server(server, {
  cors: { origin: '*' }
})

// ── Middleware ─────────────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Inyectar io en el router de lecturas ──────────────────────────
lecturasRouter.setIo(io)

// ── Rutas ──────────────────────────────────────────────────────────
app.use('/fermentaciones', fermentacionesRouter)
app.use('/lecturas',       lecturasRouter)
app.use('/alertas',        alertasRouter)

// Health check — útil para Docker y monitoreo
app.get('/health', (req, res) => res.json({ status: 'ok' }))

// ── WebSocket ──────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`)
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`)
  })
})

// ── Arrancar servidor ──────────────────────────────────────────────
const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`API corriendo en puerto ${PORT}`)
})