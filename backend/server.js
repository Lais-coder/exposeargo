const express = require('express');
const dotenv = require('dotenv');
const leadRoutes = require('./src/routes/leadRoutes');

dotenv.config();
const app = express();
app.use(express.json());

app.use('/api/leads', leadRoutes);

const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`Servidor rodando na porta ${port}`));
