const sgMail = require('@sendgrid/mail');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('🔍 DIAGNÓSTICO DE ENVIO DE EMAIL\n');
console.log('='.repeat(60));

// 1. Verificar variáveis de ambiente
console.log('\n📋 1. Verificando variáveis de ambiente...\n');

if (!process.env.SENDGRID_API_KEY) {
  console.error('❌ SENDGRID_API_KEY não encontrada no .env');
  process.exit(1);
}

if (!process.env.SENDGRID_API_KEY.startsWith('SG.')) {
  console.error('❌ SENDGRID_API_KEY inválida (deve começar com "SG.")');
  console.error('   Valor atual:', process.env.SENDGRID_API_KEY.substring(0, 10) + '...');
  process.exit(1);
}
console.log('✅ SENDGRID_API_KEY configurada');

if (!process.env.FROM_EMAIL) {
  console.error('❌ FROM_EMAIL não encontrado no .env');
  process.exit(1);
}
console.log('✅ FROM_EMAIL:', process.env.FROM_EMAIL);

if (!process.env.PORTFOLIO_URL) {
  console.warn('⚠️  PORTFOLIO_URL não encontrado (opcional)');
} else {
  console.log('✅ PORTFOLIO_URL:', process.env.PORTFOLIO_URL);
}

// 2. Configurar SendGrid
console.log('\n📋 2. Configurando SendGrid...\n');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
console.log('✅ SendGrid configurado');

// 3. Testar envio de email
console.log('\n📋 3. Testando envio de email...\n');

// Solicitar email de teste
const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Digite o email para teste (ou pressione Enter para usar o FROM_EMAIL): ', async (testEmail) => {
  const emailToTest = testEmail.trim() || process.env.FROM_EMAIL;
  
  console.log(`\n📧 Enviando email de teste para: ${emailToTest}`);
  console.log('📧 De:', process.env.FROM_EMAIL);
  
  const msg = {
    to: emailToTest,
    from: process.env.FROM_EMAIL,
    subject: 'Teste de Email - Argo Tech',
    html: `
      <div style="font-family:Arial,sans-serif">
        <h2>Email de Teste</h2>
        <p>Se você recebeu este email, o sistema está funcionando corretamente!</p>
        <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        <hr/>
        <small>Este é um email de teste do sistema exposeargo.</small>
      </div>
    `
  };
  
  try {
    console.log('\n⏳ Enviando...\n');
    const result = await sgMail.send(msg);
    
    console.log('✅ Email enviado com sucesso!');
    console.log('📧 Status Code:', result[0]?.statusCode);
    console.log('📧 Headers:', JSON.stringify(result[0]?.headers, null, 2));
    
    console.log('\n💡 IMPORTANTE:');
    console.log('   - Verifique a caixa de entrada');
    console.log('   - Verifique a pasta de SPAM/LIXO ELETRÔNICO');
    console.log('   - Pode levar alguns minutos para chegar');
    console.log('   - Se não chegar em 5 minutos, verifique:');
    console.log('     1. Se o email remetente está verificado no SendGrid');
    console.log('     2. Se a API Key tem permissões de envio');
    console.log('     3. Se o domínio está verificado no SendGrid');
    
  } catch (error) {
    console.error('\n❌ ERRO ao enviar email:\n');
    console.error('Mensagem:', error.message);
    console.error('Código:', error.code);
    
    if (error.response) {
      console.error('\n📧 Detalhes do SendGrid:');
      console.error('Status Code:', error.response.statusCode);
      console.error('Status Text:', error.response.statusText);
      
      if (error.response.body) {
        console.error('\nBody:', JSON.stringify(error.response.body, null, 2));
        
        if (error.response.body.errors) {
          console.error('\n❌ Erros encontrados:');
          error.response.body.errors.forEach(err => {
            console.error(`   - ${err.message}`);
            if (err.field) console.error(`     Campo: ${err.field}`);
            if (err.help) console.error(`     Ajuda: ${err.help}`);
          });
        }
      }
    }
    
    // Diagnósticos específicos
    if (error.code === 401 || error.response?.statusCode === 401) {
      console.error('\n🔴 PROBLEMA: API Key inválida ou não autorizada');
      console.error('💡 Solução: Verifique se a SENDGRID_API_KEY está correta no .env');
    }
    
    if (error.response?.body?.errors?.some(e => e.field === 'from')) {
      console.error('\n🔴 PROBLEMA: Email remetente não verificado');
      console.error('💡 Solução:');
      console.error('   1. Acesse https://app.sendgrid.com/settings/sender_auth');
      console.error('   2. Verifique o email:', process.env.FROM_EMAIL);
      console.error('   3. Ou configure um domínio verificado');
    }
    
    if (error.response?.statusCode === 403) {
      console.error('\n🔴 PROBLEMA: Permissões insuficientes');
      console.error('💡 Solução: Verifique se a API Key tem permissão de "Mail Send"');
    }
  }
  
  rl.close();
  process.exit(0);
});

