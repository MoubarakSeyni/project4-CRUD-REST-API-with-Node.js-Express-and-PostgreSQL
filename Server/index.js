import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import * as db from './queries.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const port = 3000
const clientDist = path.resolve(__dirname, '../Client/dist')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Allow Vite dev server (port 5173) to call the API
app.use((request, response, next) => {
  response.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (request.method === 'OPTIONS') {
    return response.sendStatus(204)
  }
  next()
})

app.get('/links', db.getLinks)
app.post('/links', db.createLink)
app.delete('/links/:id', db.deleteLink)

app.use(express.static(clientDist))

app.get('/', (request, response) => {
  response.sendFile(path.join(clientDist, 'index.html'))
})

app.listen(port, () => {
  console.log(`API: http://localhost:${port}/links`)
  console.log(`App: http://localhost:${port}`)
})
