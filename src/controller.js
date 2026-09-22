const pool = require('./db');

/**
 * POST /leads
 * Creates a new lead.
 * Required body fields: name, email, phone
 * Optional body field: status (defaults to 'New' if omitted)
 */
async function createLead(req, res) {
  const { name, email, phone, status } = req.body;

  if (!name || !email || !phone || !status) {
    return res.status(400).json({
      error: 'name, email, phone and status are required fields.',
    });
  }

  try {
    const query = `
      INSERT INTO leads (name, email, phone, status)
      VALUES ($1, $2, $3, $4::lead_status)
      RETURNING id, name, email, phone, status, created_at;
    `;
    const values = [name, email, phone, status];

    const result = await pool.query(query, values);

    return res.status(201).json(result.rows[0]);
  } catch (err) {
    // Unique violation (duplicate email or phone)
    if (err.code === '23505') {
      return res.status(409).json({
        error: 'A lead with this email or phone already exists.',
      });
    }

    console.error('Error creating lead:', err);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}

module.exports = {
  createLead,
};