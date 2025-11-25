const { Pool } = require('pg');

// Criar uma nova conexão direta a cada vez (mais simples e confiável)
exports.insert = async (name, email, phone) => {
  const pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    max: 1, // apenas 1 conexão
    connectionTimeoutMillis: 15000
  });
  
  let client;
  
  try {
    // Conectar
    client = await pool.connect();
    
    // Executar query
    const query = `
      INSERT INTO leads (name, email, phone, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (email) DO NOTHING
    `;
    
    await client.query(query, [name, email, phone || null]);
    
  } finally {
    // Sempre fechar a conexão
    if (client) {
      client.release();
    }
    // Fechar o pool
    await pool.end();
  }
};
