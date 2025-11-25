const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Configuração para conectar ao PostgreSQL padrão (sem especificar banco)
const adminPool = new Pool({
  connectionString: process.env.DATABASE_URL ? 
    process.env.DATABASE_URL.replace(/\/[^\/]+$/, '/postgres') : 
    'postgresql://postgres:postgres@localhost:5432/postgres'
});

async function setupDatabase() {
  let client;
  
  try {
    console.log('🔄 Conectando ao PostgreSQL...');
    client = await adminPool.connect();
    console.log('✅ Conectado com sucesso!');
    
    // Verificar se o banco já existe
    const dbCheck = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'exposeargo'"
    );
    
    if (dbCheck.rows.length === 0) {
      console.log('🔄 Criando banco de dados "exposeargo"...');
      await client.query('CREATE DATABASE exposeargo');
      console.log('✅ Banco de dados criado com sucesso!');
    } else {
      console.log('ℹ️  Banco de dados "exposeargo" já existe.');
    }
    
    client.release();
    
    // Conectar ao banco exposeargo
    const dbUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/exposeargo';
    const exposeargoPool = new Pool({ connectionString: dbUrl });
    const dbClient = await exposeargoPool.connect();
    
    console.log('🔄 Executando migração: 001_create_leads_table.sql');
    const migration1Path = path.join(__dirname, '../migrations/001_create_leads_table.sql');
    const sql1 = fs.readFileSync(migration1Path, 'utf8');
    
    await dbClient.query('BEGIN');
    await dbClient.query(sql1);
    await dbClient.query('COMMIT');
    console.log('✅ Migração 001 executada com sucesso!');
    
    // Verificar se a coluna phone já existe
    const columnCheck = await dbClient.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='leads' AND column_name='phone'
    `);
    
    if (columnCheck.rows.length === 0) {
      console.log('🔄 Executando migração: 002_add_phone_to_leads.sql');
      const migration2Path = path.join(__dirname, '../migrations/002_add_phone_to_leads.sql');
      const sql2 = fs.readFileSync(migration2Path, 'utf8');
      
      await dbClient.query('BEGIN');
      await dbClient.query(sql2);
      await dbClient.query('COMMIT');
      console.log('✅ Migração 002 executada com sucesso!');
    } else {
      console.log('ℹ️  Coluna "phone" já existe. Pulando migração 002.');
    }
    
    dbClient.release();
    await exposeargoPool.end();
    
    console.log('\n✅ Configuração do banco de dados concluída!');
    console.log('✅ Tabela "leads" criada e pronta para uso.');
    
  } catch (error) {
    if (client) {
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        // Ignorar erro de rollback
      }
    }
    
    console.error('\n❌ Erro ao configurar banco de dados:', error.message);
    
    if (error.message.includes('password authentication failed')) {
      console.error('\n💡 Dica: Verifique se a senha no .env está correta');
      console.error('   Edite o arquivo .env e substitua SUA_SENHA pela senha do PostgreSQL');
    } else if (error.message.includes('does not exist')) {
      console.error('\n💡 Dica: Verifique se o PostgreSQL está rodando');
    } else if (error.message.includes('duplicate') || error.message.includes('already exists')) {
      console.log('\nℹ️  O banco ou tabela já existe. Nada a fazer.');
    }
    
    process.exit(1);
  } finally {
    if (client) {
      client.release();
    }
    await adminPool.end();
  }
}

setupDatabase();



