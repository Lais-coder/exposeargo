const { Pool } = require('pg');
const dotenv = require('dotenv');
const path = require('path');

// Carregar .env da raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '../../..', '.env') });

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 20, // máximo de conexões no pool
  idleTimeoutMillis: 30000, // fecha conexões inativas após 30s
  connectionTimeoutMillis: 15000, // timeout de conexão de 15s (aumentado)
  // Configurações para melhor tratamento de erros
  allowExitOnIdle: false,
  // Tentar reconectar automaticamente
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000
});

// Tratamento de erros do pool
pool.on('error', (err) => {
  console.error('❌ Erro inesperado no pool de conexões PostgreSQL:', err.message);
  console.error('💡 Verifique se o PostgreSQL está rodando');
});

// Não testar conexão na inicialização - conectar apenas quando necessário
// Isso evita problemas de timing quando o PostgreSQL ainda está iniciando

module.exports = pool;
