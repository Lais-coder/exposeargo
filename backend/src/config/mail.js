const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
const path = require('path');

// Carregar .env da raiz do projeto
dotenv.config({ path: path.resolve(__dirname, '../../..', '.env') });

// Validar API Key
if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ ERRO: SENDGRID_API_KEY não encontrada no .env');
} else if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  console.warn('⚠️  AVISO: SENDGRID_API_KEY não começa com "SG." - pode estar incorreta');
} else {
  console.log('✅ SendGrid API Key configurada');
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
module.exports = sgMail;
