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

async function updateLeadStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!id || !status) {
    return res.status(400).json({
      error: 'id and status are required.',
    });
  }

  try {
    const query = `
      UPDATE leads
      SET status = $1::lead_status
      WHERE id = $2
      RETURNING id, name, email, phone, status, created_at;
    `;

    const values = [status, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Lead not found.',
      });
    }

    return res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updating lead status:', err);

    // Invalid enum value
    if (err.code === '22P02') {
      return res.status(400).json({
        error: 'Invalid status. Allowed values: NEW, CONTACTED, QUALIFIED, LOST.',
      });
    }

    return res.status(500).json({
      error: 'Internal server error.',
    });
  }
}

async function getLeads(req, res) {
  const { search, status } = req.query;

  try {
    const query = `
      SELECT id, name, email, phone, status, created_at
      FROM leads
      WHERE
        ($1 = '' OR
         name ILIKE '%' || $1 || '%' OR
         email ILIKE '%' || $1 || '%' OR
         phone ILIKE '%' || $1 || '%')
        AND
        ($2 = '' OR status = $2::lead_status)
      ORDER BY created_at DESC;
    `;

    const values = [
      search || '',
      status || '',
    ];

    const result = await pool.query(query, values);

    return res.status(200).json({
      data: result.rows,
      count: result.rows.length,
    });
  } catch (err) {
    console.error('Error fetching leads:', err);

    return res.status(500).json({
      error: 'Internal server error.',
    });
  }
}

module.exports = {
  createLead,
  updateLeadStatus,
  getLeads,
};