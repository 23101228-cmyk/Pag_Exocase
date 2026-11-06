import { createServer } from 'node:http'
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, readdir, rm, writeFile, mkdir, stat } from 'node:fs/promises'
import { dirname, join, basename } from 'node:path'
import { tmpdir } from 'node:os'
import { inflateRawSync } from 'node:zlib'

const PORT = Number(process.env.SLICER_PORT || 8787)
const MAX_BYTES = 100 * 1024 * 1024
const EXE = process.env.BAMBUSTUDIO_PATH || 'C:\\Program Files\\Bambu Studio\\bambu-studio.exe'
const RESOURCE_ROOT = process.env.BAMBUSTUDIO_PROFILES || join(dirname(EXE), 'resources', 'profiles', 'BBL')
const ALLOWED_ORIGINS = new Set((process.env.CORS_ORIGINS || 'http://localhost:5173,http://127.0.0.1:5173').split(',').map(x => x.trim()))
const PROFILE_FILES = {
  machine: join(RESOURCE_ROOT, 'machine', 'Bambu Lab A1 0.4 nozzle.json'),
  process: join(RESOURCE_ROOT, 'process', '0.28mm Extra Draft @BBL A1.json'),
  filament: join(RESOURCE_ROOT, 'filament', 'Bambu PLA Basic @BBL A1.json'),
}
const overrideSettings = [
  '--layer-height=0.28',
  '--wall-loops=2',
  '--sparse-infill-density=15%',
  '--sparse-infill-pattern=gyroid',
  '--enable-support=1',
  '--support-type=tree(auto)',
  '--support-style=default',
  '--support-threshold-angle=40',
]
let presetCache

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
  res.end(JSON.stringify(body))
}
function applyCors(req, res) {
  const origin = req.headers.origin
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin)
    res.setHeader('Vary', 'Origin')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Model-Name, X-Scale-Factor')
  }
}

async function getPresetFiles() {
  if (presetCache) return presetCache
  const files = []
  for (const family of ['machine', 'process', 'filament']) {
    for (const name of await readdir(join(RESOURCE_ROOT, family))) if (name.toLowerCase().endsWith('.json')) files.push(join(RESOURCE_ROOT, family, name))
  }
  const records = new Map()
  for (const file of files) {
    try {
      const data = JSON.parse(await readFile(file, 'utf8'))
      if (data.name) records.set(data.name, { data, file })
    } catch { /* Ignore non-profile JSON files. */ }
  }
  const resolving = new Set()
  const resolved = new Map()
  function resolve(name) {
    if (resolved.has(name)) return resolved.get(name)
    const entry = records.get(name)
    if (!entry) throw new Error(`No se encontró el preset heredado de Bambu: ${name}`)
    if (resolving.has(name)) throw new Error(`Herencia circular en el perfil de Bambu: ${name}`)
    resolving.add(name)
    const parent = entry.data.inherits ? resolve(entry.data.inherits) : {}
    const current = { ...parent, ...entry.data }
    delete current.inherits
    resolving.delete(name)
    resolved.set(name, current)
    return current
  }
  const output = {}
  for (const [kind, file] of Object.entries(PROFILE_FILES)) {
    await stat(file)
    const source = JSON.parse(await readFile(file, 'utf8'))
    output[kind] = resolve(source.name)
  }
  presetCache = output
  return output
}

function readRequest(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    let size = 0
    req.on('data', chunk => {
      size += chunk.length
      if (size > MAX_BYTES) {
        reject(Object.assign(new Error('El STL supera el límite de 100 MB.'), { status: 413 }))
        req.destroy()
        return
      }
      chunks.push(chunk)
    })
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

function runProcess(executable, args, cwd, timeoutMs = 8 * 60 * 1000) {
  return new Promise((resolve, reject) => {
    const child = spawn(executable, args, { cwd, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = '', stderr = '', timer
    child.stdout.on('data', chunk => { stdout = (stdout + chunk.toString()).slice(-12000) })
    child.stderr.on('data', chunk => { stderr = (stderr + chunk.toString()).slice(-12000) })
    child.once('error', error => { clearTimeout(timer); reject(error) })
    timer = setTimeout(() => { child.kill(); reject(Object.assign(new Error('Bambu Studio tardó demasiado en laminar el archivo.'), { status: 504 })) }, timeoutMs)
    child.once('close', code => {
      clearTimeout(timer)
      resolve({ exitCode: code, stdout, stderr })
    })
  })
}

function unzipEntry(zip, wanted) {
  let eocd = -1
  for (let i = zip.length - 22; i >= Math.max(0, zip.length - 65558); i--) if (zip.readUInt32LE(i) === 0x06054b50) { eocd = i; break }
  if (eocd < 0) throw new Error('Bambu Studio devolvió un archivo 3MF no válido.')
  const count = zip.readUInt16LE(eocd + 10), start = zip.readUInt32LE(eocd + 16)
  let offset = start
  for (let i = 0; i < count; i++) {
    if (zip.readUInt32LE(offset) !== 0x02014b50) break
    const method = zip.readUInt16LE(offset + 10), compressedSize = zip.readUInt32LE(offset + 20)
    const nameLen = zip.readUInt16LE(offset + 28), extraLen = zip.readUInt16LE(offset + 30), commentLen = zip.readUInt16LE(offset + 32)
    const localOffset = zip.readUInt32LE(offset + 42)
    const name = zip.toString('utf8', offset + 46, offset + 46 + nameLen)
    if (name === wanted) {
      const localName = zip.readUInt16LE(localOffset + 26), localExtra = zip.readUInt16LE(localOffset + 28)
      const dataStart = localOffset + 30 + localName + localExtra
      const compressed = zip.subarray(dataStart, dataStart + compressedSize)
      if (method === 0) return compressed.toString('utf8')
      if (method === 8) return inflateRawSync(compressed).toString('utf8')
      throw new Error('El formato comprimido del laminado no es compatible.')
    }
    offset += 46 + nameLen + extraLen + commentLen
  }
  return null
}

function parseDuration(text) {
  const normalized = text.replace(/,/g, ' ').trim()
  const hms = normalized.match(/(?:(\d+)\s*:\s*)?(\d+)\s*:\s*(\d+)/)
  if (hms) return (Number(hms[1] || 0) * 3600) + Number(hms[2]) * 60 + Number(hms[3])
  const h = Number(normalized.match(/(\d+(?:\.\d+)?)\s*h/i)?.[1] || 0)
  const m = Number(normalized.match(/(\d+(?:\.\d+)?)\s*m/i)?.[1] || 0)
  const s = Number(normalized.match(/(\d+(?:\.\d+)?)\s*s/i)?.[1] || 0)
  return h * 3600 + m * 60 + s
}
function parseSlicedMetrics(zip) {
  const gcode = unzipEntry(zip, 'Metadata/plate_1.gcode')
  const info = unzipEntry(zip, 'Metadata/slice_info.config') || ''
  if (!gcode) throw new Error('El laminado terminó, pero Bambu Studio no incluyó el G-code para leer sus resultados.')
  const timeText = gcode.match(/total estimated time\s*:\s*([^;\r\n]+)/i)?.[1]
    || gcode.match(/estimated printing time\s*\([^)]*\)\s*=\s*([^;\r\n]+)/i)?.[1]
  const timeSeconds = timeText ? parseDuration(timeText) : 0
  const weightText = gcode.match(/total filament weight\s*\[g\]\s*:\s*([\d.]+)/i)?.[1]
  const xmlWeights = [...info.matchAll(/used_g="([\d.]+)"/gi)].map(match => Number(match[1])).filter(value => value > 0)
  const directWeight = Number(weightText || 0) || xmlWeights.reduce((total, value) => total + value, 0)
  const filamentLengthMm = Number(gcode.match(/total filament length\s*\[mm\]\s*:\s*([\d.]+)/i)?.[1] || 0)
  const filamentDiameterMm = Number(gcode.match(/filament_diameter:\s*([\d.]+)/i)?.[1] || 1.75)
  const weightGrams = directWeight || (filamentLengthMm * Math.PI * Math.pow(filamentDiameterMm / 2, 2) / 1000 * 1.26)
  if (!timeSeconds) throw new Error('Bambu Studio laminó el archivo, pero no se pudo leer el tiempo estimado.')
  return { timeSeconds, weightGrams, sourceTime: timeText }
}

const server = createServer(async (req, res) => {
  applyCors(req, res)
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }
  const url = new URL(req.url || '/', 'http://localhost')
  if (req.method === 'GET' && url.pathname === '/api/status') {
    try {
      const profiles = await getPresetFiles()
      return send(res, 200, { ready: true, slicer: 'Bambu Studio', version: '02.07.01.62+', profile: 'A1 0.4 mm · 0.28 Extra Draft · 2 paredes · 15% Gyroid · soportes árbol/auto · PLA', resolved: Boolean(profiles.machine && profiles.process && profiles.filament) })
    } catch (error) { return send(res, 503, { ready: false, error: error.message }) }
  }
  if (req.method !== 'POST' || url.pathname !== '/api/slice') return send(res, 404, { error: 'Ruta no encontrada.' })
  let workdir
  try {
    const executableStat = await stat(EXE)
    if (!executableStat.isFile()) throw new Error('No se encontró bambu-studio.exe.')
    const profiles = await getPresetFiles()
    const filename = String(req.headers['x-model-name'] || 'modelo.stl')
    if (!filename.toLowerCase().endsWith('.stl')) return send(res, 415, { error: 'El cotizador acepta archivos .STL.' })
    const scaleFactor = Number(req.headers['x-scale-factor'] || '1')
    if (!Number.isFinite(scaleFactor) || scaleFactor <= 0 || scaleFactor > 10000) return send(res, 400, { error: 'La escala del modelo no es válida.' })
    const body = await readRequest(req)
    if (body.length < 84) return send(res, 400, { error: 'El archivo no parece contener un STL válido.' })
    workdir = await mkdtemp(join(tmpdir(), 'exocase-slicer-'))
    const inputPath = join(workdir, 'upload.stl'), outputPath = join(workdir, 'sliced.3mf'), dataPath = join(workdir, 'slicedata')
    await mkdir(dataPath)
    await writeFile(inputPath, body)
    const machinePath = join(workdir, 'machine.json'), processPath = join(workdir, 'process.json'), filamentPath = join(workdir, 'filament.json')
    await Promise.all([
      writeFile(machinePath, JSON.stringify(profiles.machine)),
      writeFile(processPath, JSON.stringify(profiles.process)),
      writeFile(filamentPath, JSON.stringify(profiles.filament)),
    ])
    const args = [
      '--orient', '1', '--arrange', '1', '--scale', String(scaleFactor),
      '--load-settings', `${machinePath};${processPath}`,
      '--load-filaments', filamentPath,
      ...overrideSettings,
      '--slice', '0', '--debug', '3', '--export-3mf', outputPath,
      inputPath,
    ]
    const cliResult = await runProcess(EXE, args, dirname(EXE))
    let result3mf
    try { result3mf = await readFile(outputPath) }
    catch { throw Object.assign(new Error(`Bambu Studio cerró con código ${cliResult.exitCode} y no generó el 3MF laminado. ${cliResult.stderr || cliResult.stdout}`.trim()), { status: 422 }) }
    const metrics = parseSlicedMetrics(result3mf)
    const hours = metrics.timeSeconds / 3600
    const hourlyRate = hours <= 10 ? 15 : 10
    return send(res, 200, {
      ...metrics,
      hours,
      hourlyRate,
      priceSoles: hours * hourlyRate,
      pricingRule: 'S/15 por hora hasta 10 h; S/10 por hora por encima de 10 h',
      profile: 'Bambu Lab A1 Combo · 0.4 mm · 0.28 mm Extra Draft · 2 paredes · 15% Gyroid · Tree/Auto 40° · Bambu PLA Basic',
      fileName: basename(filename),
    })
  } catch (error) {
    return send(res, error.status || 500, { error: error instanceof Error ? error.message : 'No se pudo laminar el STL.' })
  } finally {
    if (workdir) await rm(workdir, { recursive: true, force: true }).catch(() => {})
  }
})

server.listen(PORT, '127.0.0.1', () => console.log(`Servicio de laminado Exocase listo en http://127.0.0.1:${PORT}`))