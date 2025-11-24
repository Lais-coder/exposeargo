const pool = require('../config/db');

exports.insert = async (name, email) => {
  const query = `
    INSERT INTO leads (name, email, created_at)
    VALUES ($1, $2, NOW())
    ON CONFLICT (email) DO NOTHING
  `;
  await pool.query(query, [name, email]);
};
