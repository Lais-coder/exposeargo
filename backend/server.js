const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const leadRoutes = require('./src/routes/leadRoutes');

// Carregar .env da raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

// Validar variáveis de ambiente essenciais
const requiredEnvVars = ['DATABASE_URL', 'SENDGRID_API_KEY', 'FROM_EMAIL', 'PORTFOLIO_URL'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.error('❌ ERRO: Variáveis de ambiente faltando:');
  missingVars.forEach(varName => console.error(`   - ${varName}`));
  console.error('\nPor favor, configure o arquivo .env com todas as variáveis necessárias.');
  process.exit(1);
}

const app = express();

// Configurar CORS
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://faleconosco.grupoargo.tech'
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (ex: Postman)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));


app.use(express.json());

// Rota de health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/leads', leadRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`✅ Servidor rodando na porta ${port}`);
  console.log(`✅ CORS habilitado para: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
