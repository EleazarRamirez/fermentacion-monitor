-- ─────────────────────────────────────────
-- Schema: Sistema de Monitoreo de Fermentación
-- ─────────────────────────────────────────

CREATE TABLE IF NOT EXISTS fermentaciones (
    id          SERIAL PRIMARY KEY,
    nombre      VARCHAR(100) NOT NULL,
    estilo      VARCHAR(100),
    descripcion TEXT,
    activa      BOOLEAN DEFAULT TRUE,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS lecturas (
    id                  SERIAL PRIMARY KEY,
    fermentacion_id     INTEGER REFERENCES fermentaciones(id) ON DELETE CASCADE,
    temperatura_mosto   NUMERIC(5,2),   -- °C  DS18B20
    burbujas_por_minuto INTEGER,        -- LED IR + fotodiodo
    ph                  NUMERIC(4,2),   -- Módulo pH
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS alertas_config (
    id                      SERIAL PRIMARY KEY,
    fermentacion_id         INTEGER REFERENCES fermentaciones(id) ON DELETE CASCADE,
    temp_min                NUMERIC(5,2) DEFAULT 16.0,
    temp_max                NUMERIC(5,2) DEFAULT 24.0,
    burbujas_inactivo_min   INTEGER      DEFAULT 15,  -- minutos sin burbujas = estancado
    ph_min                  NUMERIC(4,2) DEFAULT 3.8,
    ph_max                  NUMERIC(4,2) DEFAULT 5.5
);

CREATE TABLE IF NOT EXISTS alertas_log (
    id              SERIAL PRIMARY KEY,
    fermentacion_id INTEGER REFERENCES fermentaciones(id) ON DELETE CASCADE,
    tipo            VARCHAR(50) NOT NULL, -- 'temp_alta','temp_baja','estancado','ph_bajo','ph_alto'
    mensaje         TEXT,
    valor           NUMERIC(7,2),
    enviada         BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para acelerar consultas de historial por fermentación y fecha
CREATE INDEX IF NOT EXISTS idx_lecturas_fermentacion_fecha
    ON lecturas(fermentacion_id, created_at DESC);

-- Fermentación de ejemplo para desarrollo
INSERT INTO fermentaciones (nombre, estilo, descripcion)
VALUES ('Lote 01 - Prueba', 'Ale', 'Fermentación inicial de prueba del sistema')
ON CONFLICT DO NOTHING;

INSERT INTO alertas_config (fermentacion_id)
VALUES (1)
ON CONFLICT DO NOTHING;