const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Verificar se DATABASE_URL está configurada
if (!process.env.DATABASE_URL) {
  console.error('❌ ERRO: DATABASE_URL não encontrada no arquivo .env');
  console.error('\nPor favor, configure o arquivo .env na raiz do projeto com:');
  console.error('DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/exposeargo');
  process.exit(1);
}

// Validar formato da DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl.includes('postgresql://') && !dbUrl.includes('postgres://')) {
  console.error('❌ ERRO: DATABASE_URL deve começar com postgresql:// ou postgres://');
  process.exit(1);
}

// Verificar se a senha está presente na URL
const urlMatch = dbUrl.match(/postgres(ql)?:\/\/([^:]+):([^@]+)@/);
if (!urlMatch || !urlMatch[3] || urlMatch[3].trim() === '') {
  console.error('❌ ERRO: Senha do PostgreSQL não encontrada na DATABASE_URL');
  console.error('\nFormato esperado:');
  console.error('postgresql://postgres:SUA_SENHA@localhost:5432/exposeargo');
  console.error('\nSua URL atual (sem senha):', dbUrl.replace(/:[^:@]+@/, ':***@'));
  process.exit(1);
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function runMigration() {
  let client;
  
  try {
    console.log('🔄 Conectando ao banco de dados...');
    client = await pool.connect();
    console.log('✅ Conectado com sucesso!');
    
    console.log('🔄 Executando migração: 002_add_phone_to_leads.sql');
    
    const migrationPath = path.join(__dirname, '../migrations/002_add_phone_to_leads.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');
    
    await client.query('BEGIN');
    await client.query(sql);
    await client.query('COMMIT');
    
    console.log('✅ Migração executada com sucesso!');
    console.log('✅ Campo "phone" adicionado à tabela "leads"');
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        // Ignorar erro de rollback
      }
    }
    
    console.error('\n❌ Erro ao executar migração:');
    console.error('   Mensagem:', error.message);
    if (error.code) {
      console.error('   Código:', error.code);
    }
    
    // Erros específicos
    if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Dica: Verifique se a senha no .env está correta');
      console.error('   Execute: npm run fix-password');
      console.error('   Ou edite o .env manualmente removendo espaços da senha');
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 Dica: Verifique se o banco de dados "exposeargo" existe');
      console.error('   Execute: npm run setup-db');
      console.error('   Ou crie manualmente no pgAdmin');
    } else if (error.message.includes('duplicate column') || error.message.includes('already exists')) {
      console.log('\nℹ️  A coluna "phone" já existe na tabela. Nada a fazer.');
      process.exit(0);
    } else if (error.message.includes('connection') || error.message.includes('ECONNREFUSED') || error.message.includes('timeout')) {
      console.error('\n💡 Dica: Verifique se o PostgreSQL está rodando');
      console.error('   Execute: npm run check-port');
    } else if (error.message.includes('SASL')) {
      console.error('\n💡 Problema com autenticação - senha pode ter espaços ou formato incorreto');
      console.error('   Execute: npm run fix-password');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

runMigration();

