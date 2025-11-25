#!/bin/sh
set -e

echo "⏳ Aguardando PostgreSQL estar pronto..."

# Aguardar PostgreSQL estar disponível
until pg_isready -h postgres -U postgres -p 5432; do
  echo "⏳ PostgreSQL ainda não está pronto. Aguardando..."
  sleep 2
done

echo "✅ PostgreSQL está pronto!"

# Executar setup do banco de dados (se necessário)
if [ "$RUN_SETUP" != "false" ]; then
  echo "🔄 Executando setup do banco de dados..."
  node backend/scripts/setupDatabase.js || echo "⚠️  Setup do banco pode ter falhado ou já estar configurado"
fi

echo "🚀 Iniciando servidor..."

# Executar comando passado
exec "$@"


