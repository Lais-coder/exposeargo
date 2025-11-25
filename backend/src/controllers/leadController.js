const Lead = require('../models/leadModel');
const sgMail = require('../config/mail');
const emailTemplate = require('../utils/emailTemplates');
const fs = require('fs');
const path = require('path');

exports.createLead = async (req, res) => {
  const { name, email, phone } = req.body;
  
  try {
    // Inserir no banco de dados
    await Lead.insert(name, email, phone);

    // Enviar email
    let emailSent = false;
    let emailErrorDetails = null;
    
    try {
      // Caminho do arquivo PDF
      const pdfPath = path.join(__dirname, '../../assets/ARGO - Pitch Institucional 2025.pdf');
      
      // Ler o arquivo PDF
      let attachments = [];
      if (fs.existsSync(pdfPath)) {
        const pdfContent = fs.readFileSync(pdfPath);
        attachments = [{
          content: pdfContent.toString('base64'),
          filename: 'ARGO - Pitch Institucional 2025.pdf',
          type: 'application/pdf',
          disposition: 'attachment'
        }];
      }
      
      const msg = {
        to: email,
        from: process.env.FROM_EMAIL,
        subject: 'Portfólio • Argo Tech',
        html: emailTemplate(name),
        attachments: attachments
      };
      
      console.log('\n📧 ===== TENTANDO ENVIAR EMAIL =====');
      console.log('📧 Para:', email);
      console.log('📧 De:', process.env.FROM_EMAIL);
      console.log('📧 Anexos:', attachments.length > 0 ? 'Sim (PDF)' : 'Não');
      console.log('📧 =================================\n');
      
      const result = await sgMail.send(msg);
      emailSent = true;
      console.log('✅ Email enviado com sucesso!');
      console.log('📧 Status Code:', result[0]?.statusCode);
      console.log('📧 Message ID:', result[0]?.headers?.['x-message-id'] || 'N/A');
      console.log('📧 Data/Hora:', new Date().toLocaleString('pt-BR'));
      
    } catch (emailError) {
      emailSent = false;
      console.error('\n❌ ===== ERRO AO ENVIAR EMAIL =====');
      console.error('❌ Mensagem:', emailError.message);
      console.error('❌ Código:', emailError.code);
      
      // Log detalhado do erro
      if (emailError.response) {
        console.error('📧 Status Code:', emailError.response.statusCode);
        console.error('📧 Status Text:', emailError.response.statusText);
        
        if (emailError.response.body) {
          console.error('📧 Body:', JSON.stringify(emailError.response.body, null, 2));
          
          // Erros comuns do SendGrid
          if (emailError.response.body?.errors) {
            console.error('\n❌ Erros do SendGrid:');
            emailError.response.body.errors.forEach(err => {
              console.error(`   - ${err.message}`);
              if (err.field) console.error(`     Campo: ${err.field}`);
              if (err.help) console.error(`     Ajuda: ${err.help}`);
            });
            
            // Armazenar detalhes do erro para retornar ao frontend
            emailErrorDetails = {
              message: emailError.response.body.errors[0]?.message || emailError.message,
              field: emailError.response.body.errors[0]?.field,
              help: emailError.response.body.errors[0]?.help
            };
          }
        }
      }
      
      // Verificar se é problema de autenticação
      if (emailError.code === 401 || emailError.response?.statusCode === 401) {
        console.error('\n🔴 PROBLEMA: API Key do SendGrid inválida ou não autorizada');
        console.error('💡 Solução: Verifique se a SENDGRID_API_KEY no .env está correta');
        emailErrorDetails = {
          message: 'API Key do SendGrid inválida',
          help: 'Verifique se a SENDGRID_API_KEY no .env está correta'
        };
      }
      
      // Verificar se é problema com o remetente
      if (emailError.response?.body?.errors?.some(e => e.field === 'from')) {
        console.error('\n🔴 PROBLEMA: Email remetente não verificado no SendGrid');
        console.error('💡 Solução: Verifique se o FROM_EMAIL está verificado no SendGrid');
        console.error('   Acesse: https://app.sendgrid.com/settings/sender_auth');
        emailErrorDetails = {
          message: 'Email remetente não verificado no SendGrid',
          help: 'Verifique se o FROM_EMAIL está verificado no SendGrid'
        };
      }
      
      if (emailError.response?.statusCode === 403) {
        console.error('\n🔴 PROBLEMA: Permissões insuficientes');
        console.error('💡 Solução: Verifique se a API Key tem permissão de "Mail Send"');
        emailErrorDetails = {
          message: 'Permissões insuficientes na API Key',
          help: 'Verifique se a API Key tem permissão de "Mail Send"'
        };
      }
      
      console.error('❌ =================================\n');
    }

    // Retornar resposta com informação sobre o email
    if (emailSent) {
      res.json({ 
        ok: true,
        message: 'Lead cadastrado com sucesso! Email enviado.',
        emailSent: true
      });
    } else {
      // Lead foi salvo, mas email falhou
      res.status(207).json({ 
        ok: true,
        message: 'Lead cadastrado, mas houve um problema ao enviar o email.',
        emailSent: false,
        emailError: emailErrorDetails
      });
    }
  } catch (err) {
    console.error('Erro ao processar lead:', err);
    
    // Tratamento específico de erros
    if (err.code === '23505') { // Violação de constraint única (email duplicado)
      return res.status(409).json({ 
        error: 'Este email já está cadastrado',
        code: 'DUPLICATE_EMAIL'
      });
    }
    
    // Erros de conexão com o banco (incluindo AggregateError do pg-pool)
    const isConnectionError = err.code === 'ECONNREFUSED' || 
                              err.code === 'ENOTFOUND' || 
                              err.code === 'ETIMEDOUT' || 
                              (err.errors && err.errors.some(e => e.code === 'ECONNREFUSED')) ||
                              err.message.includes('connection') ||
                              err.message.includes('timeout') ||
                              err.message.includes('ECONNREFUSED');
    
    if (isConnectionError) {
      console.error('Erro de conexão com banco de dados:', err.message);
      if (err.errors) {
        console.error('Detalhes:', err.errors.map(e => e.message).join(', '));
      }
      return res.status(503).json({ 
        error: 'Serviço de banco de dados indisponível. Verifique se o PostgreSQL está rodando.',
        code: 'DB_CONNECTION_ERROR'
      });
    }

    // Erro genérico
    res.status(500).json({ 
      error: 'Erro ao processar solicitação',
      code: 'INTERNAL_ERROR'
    });
  }
};
