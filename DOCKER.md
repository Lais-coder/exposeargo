# 🐳 Guia de Uso do Docker

Este projeto está configurado para rodar com Docker e Docker Compose.

## 📋 Pré-requisitos

- Docker instalado ([Download Docker](https://www.docker.com/get-started))
- Docker Compose instalado (geralmente vem com o Docker Desktop)

## 🚀 Início Rápido

### 1. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Banco de Dados
POSTGRES_PASSWORD=sua_senha_aqui
DATABASE_URL=postgresql://postgres:sua_senha_aqui@postgres:5432/exposeargo

# SendGrid
SENDGRID_API_KEY=SG.sua_api_key_aqui
FROM_EMAIL=seu_email@exemplo.com

# Aplicação
PORTFOLIO_URL=https://seu-portfolio.com
FRONTEND_URL=http://localhost:5173
```

### 2. Construir e Iniciar os Containers

```bash
# Construir as imagens e iniciar todos os serviços
docker-compose up -d

# Ou para ver os logs em tempo real
docker-compose up
```

### 3. Verificar Status dos Serviços

```bash
# Ver status dos containers
docker-compose ps

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

## 🛠️ Comandos Úteis

### Parar os Serviços

```bash
# Parar todos os serviços
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar, remover containers e volumes (⚠️ apaga dados do banco)
docker-compose down -v
```

### Reconstruir as Imagens

```bash
# Reconstruir todas as imagens
docker-compose build

# Reconstruir sem cache
docker-compose build --no-cache

# Reconstruir e reiniciar
docker-compose up -d --build
```

### Executar Comandos nos Containers

```bash
# Executar comando no backend
docker-compose exec backend node backend/scripts/setupDatabase.js

# Executar comando no banco de dados
docker-compose exec postgres psql -U postgres -d exposeargo

# Acessar shell do backend
docker-compose exec backend sh
```

## 📦 Serviços

O `docker-compose.yml` configura os seguintes serviços:

### 🗄️ PostgreSQL (postgres)
- **Porta**: 5432 (configurável via `POSTGRES_PORT`)
- **Banco de dados**: `exposeargo`
- **Usuário**: `postgres`
- **Senha**: Configurada via `POSTGRES_PASSWORD` no `.env`
- **Volume**: Dados persistem em `postgres_data`

### 🔧 Backend (backend)
- **Porta**: 8000 (configurável via `PORT`)
- **URL**: http://localhost:8000
- **Health Check**: http://localhost:8000/health
- **Setup automático**: Executa migrações na inicialização

### 🎨 Frontend (frontend)
- **Porta**: 5173 (configurável via `FRONTEND_PORT`)
- **URL**: http://localhost:5173
- **Build**: Produção otimizada com Nginx

## 🔍 Troubleshooting

### Problema: Backend não consegue conectar ao PostgreSQL

**Solução**: Verifique se o `DATABASE_URL` no `.env` está correto:
```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@postgres:5432/exposeargo
```
Note que o host é `postgres` (nome do serviço no docker-compose), não `localhost`.

### Problema: Erro ao executar setup do banco

**Solução**: O setup é executado automaticamente na primeira inicialização. Se precisar executar manualmente:
```bash
docker-compose exec backend node backend/scripts/setupDatabase.js
```

### Problema: Porta já está em uso

**Solução**: Altere as portas no `.env`:
```env
PORT=8001
POSTGRES_PORT=5433
FRONTEND_PORT=5174
```

### Problema: Variáveis de ambiente não estão sendo carregadas

**Solução**: Certifique-se de que o arquivo `.env` está na raiz do projeto e que todas as variáveis necessárias estão definidas.

### Ver logs de erro

```bash
# Todos os logs
docker-compose logs

# Logs do backend
docker-compose logs backend

# Últimas 100 linhas
docker-compose logs --tail=100
```

## 🔄 Desenvolvimento

Para desenvolvimento com hot-reload, você pode usar volumes para montar o código:

```yaml
# Já configurado no docker-compose.yml
volumes:
  - ./backend:/app/backend
```

Para reiniciar apenas um serviço após mudanças:

```bash
docker-compose restart backend
```

## 📝 Notas

- O banco de dados é inicializado automaticamente na primeira execução
- As migrações são executadas automaticamente pelo script de setup
- Os dados do PostgreSQL são persistidos em um volume Docker
- O frontend é servido via Nginx em modo de produção


