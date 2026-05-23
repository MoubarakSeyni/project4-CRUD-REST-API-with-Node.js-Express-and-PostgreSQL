import pg from 'pg'

const { Pool } = pg
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'favlinks',
  password: 'password',
  port: 5432,
})

const getLinks = async (request, response) => {
  try {
    const results = await pool.query('SELECT * FROM links ORDER BY id ASC')
    response.status(200).json(results.rows)
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
}

const createLink = async (request, response) => {
  const { name, URL, url } = request.body
  const linkUrl = (url ?? URL ?? '').trim()

  if (!name?.trim() || !linkUrl) {
    return response.status(400).json({ error: 'Name and URL are required' })
  }

  try {
    const results = await pool.query(
      'INSERT INTO links (name, url) VALUES ($1, $2) RETURNING *',
      [name.trim(), linkUrl]
    )
    response.status(201).json(results.rows[0])
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
}

const deleteLink = async (request, response) => {
  const id = parseInt(request.params.id, 10)

  try {
    await pool.query('DELETE FROM links WHERE id = $1', [id])
    response.status(200).json({ id })
  } catch (error) {
    response.status(500).json({ error: error.message })
  }
}

export { getLinks, createLink, deleteLink }
