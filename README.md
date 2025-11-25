# 📋 ExposeArgo - Sistema de Captura de Leads

Sistema completo para captura de leads com envio automático de portfólio por email.

## 📑 Índice

- [Requisitos do Sistema](#-requisitos-do-sistema)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executando o Projeto](#-executando-o-projeto)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Troubleshooting](#-troubleshooting)

---

## 🖥️ Requisitos do Sistema

### Mínimos
- **Sistema Operacional**: Windows 10+, macOS 10.15+, ou Linux (Ubuntu 20.04+)
- **RAM**: 4GB mínimo (8GB recomendado)
- **Espaço em Disco**: 2GB livres
- **Processador**: Dual-core 2.0GHz ou superior

### Para Desenvolvimento
- **Node.js**: Versão 18.x ou superior
- **npm**: Versão 9.x ou superior (vem com Node.js)
- **PostgreSQL**: Versão 12.x ou superior
- **Git**: Para clonar o repositório

### Para Produção com Docker
- **Docker**: Versão 20.10 ou superior
- **Docker Compose**: Versão 2.0 ou superior

---

## 📦 Pré-requisitos

### 1. Node.js e npm

**Windows/macOS:**
- Baixe em: https://nodejs.org/
- Instale a versão LTS (Long Term Support)
- Verifique a instalação:
```bash
node --version  # Deve mostrar v18.x ou superior
npm --version   # Deve mostrar 9.x ou superior
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. PostgreSQL

**Windows:**
- Baixe em: https://www.postgresql.org/download/windows/
- Instale o PostgreSQL 15 ou superior
- Anote a senha do usuário `postgres` durante a instalação

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Verificar instalação:**
```bash
psql --version  # Deve mostrar versão 12.x ou superior
```

### 3. Docker (Opcional - para usar Docker Compose)

**Windows/macOS:**
- Instale o Docker Desktop: https://www.docker.com/products/docker-desktop/

**Linux:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

**Verificar instalação:**
```bash
docker --version
docker-compose --version
```

### 4. Conta SendGrid (Para envio de emails)

1. Crie uma conta em: https://sendgrid.com/
2. Verifique seu domínio ou email remetente
3. Gere uma API Key com permissões de "Mail Send"
4. Anote a API Key (começa com `SG.`)

---

## 🚀 Instalação

### Opção 1: Instalação Local (Sem Docker)

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd exposeargo
```

2. **Instale as dependências:**
```bash
# Instalar dependências da raiz (backend)
npm install

# Instalar dependências do frontend
cd frontend
npm install
cd ..
```

3. **Configure o banco de dados PostgreSQL:**
```bash
# Criar banco de dados (se necessário)
createdb exposeargo

# Ou via psql:
psql -U postgres
CREATE DATABASE exposeargo;
\q
```

### Opção 2: Instalação com Docker

1. **Clone o repositório:**
```bash
git clone <url-do-repositorio>
cd exposeargo
```

2. **Configure o arquivo `.env`** (veja seção de Configuração)

3. **Construa e inicie os containers:**
```bash
docker-compose up -d --build
```

---

## ⚙️ Configuração

### 1. Arquivo `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# ============================================
# CONFIGURAÇÕES DO BANCO DE DADOS
# ============================================
# URL de conexão com PostgreSQL
# Formato: postgresql://usuario:senha@host:porta/banco
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/exposeargo

# Para Docker (opcional)
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432

# ============================================
# CONFIGURAÇÕES DO BACKEND
# ============================================
# Porta do servidor backend
PORT=8000

# Ambiente (development, production)
NODE_ENV=development

# URL do frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# ============================================
# CONFIGURAÇÕES DO SENDGRID
# ============================================
# API Key do SendGrid (obrigatória)
# Obtenha em: https://app.sendgrid.com/settings/api_keys
SENDGRID_API_KEY=SG.sua_api_key_aqui

# Email remetente (deve estar verificado no SendGrid)
FROM_EMAIL=seu_email@exemplo.com

# ============================================
# CONFIGURAÇÕES DA APLICAÇÃO
# ============================================
# URL do portfólio para enviar nos emails
PORTFOLIO_URL=https://seu-portfolio.com

# ============================================
# CONFIGURAÇÕES DO FRONTEND (Docker)
# ============================================
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:8000

# ============================================
# CONFIGURAÇÕES DO DOCKER (Opcional)
# ============================================
# Executar setup do banco automaticamente (true/false)
RUN_SETUP=true
```

### 2. Configurar SendGrid

1. Acesse: https://app.sendgrid.com/
2. Vá em **Settings** → **API Keys**
3. Clique em **Create API Key**
4. Dê um nome (ex: "ExposeArgo Production")
5. Selecione **Full Access** ou apenas **Mail Send**
6. Copie a API Key e cole no `.env`

**⚠️ Importante:** A API Key só é mostrada uma vez. Salve-a com segurança!

### 3. Verificar Email Remetente no SendGrid

1. Acesse: https://app.sendgrid.com/settings/sender_auth
2. Clique em **Verify a Single Sender**
3. Preencha os dados do email que será usado como remetente
4. Verifique o email clicando no link enviado
5. Use esse email no campo `FROM_EMAIL` do `.env`

---

## 🏃 Executando o Projeto

### Opção 1: Execução Local (Sem Docker)

#### 1. Iniciar PostgreSQL

**Windows:**
- Inicie o serviço PostgreSQL pelo Gerenciador de Serviços

**macOS:**
```bash
brew services start postgresql@15
```

**Linux:**
```bash
sudo systemctl start postgresql
```

#### 2. Configurar Banco de Dados

```bash
# Executar setup do banco (cria tabelas e estrutura)
npm run setup-db
```

#### 3. Iniciar Backend

```bash
# Modo desenvolvimento (com hot-reload)
npm run dev

# Modo produção
npm start
```

O backend estará disponível em: **http://localhost:8000**

#### 4. Iniciar Frontend

Em um novo terminal:

```bash
cd frontend
npm run dev
```

O frontend estará disponível em: **http://localhost:5173**

### Opção 2: Execução com Docker

#### 1. Construir e Iniciar

```bash
# Construir imagens e iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Ver logs de um serviço específico
docker-compose logs -f backend
```

#### 2. Verificar Status

```bash
# Ver status dos containers
docker-compose ps

# Verificar health check do backend
curl http://localhost:8000/health
```

#### 3. Parar os Serviços

```bash
# Parar containers
docker-compose stop

# Parar e remover containers
docker-compose down

# Parar, remover containers e volumes (⚠️ apaga dados)
docker-compose down -v
```

---

## 📁 Estrutura do Projeto

```
exposeargo/
├── backend/                 # Backend Node.js/Express
│   ├── assets/             # Arquivos estáticos (PDFs, etc)
│   ├── migrations/          # Scripts de migração do banco
│   ├── scripts/             # Scripts utilitários
│   │   ├── setupDatabase.js # Setup inicial do banco
│   │   ├── runMigration.js  # Executar migrações
│   │   └── diagnoseEmail.js # Diagnóstico de email
│   ├── src/
│   │   ├── config/          # Configurações (DB, Mail)
│   │   ├── controllers/     # Controladores
│   │   ├── middleware/     # Middlewares
│   │   ├── models/          # Modelos de dados
│   │   ├── routes/          # Rotas da API
│   │   └── utils/           # Utilitários
│   ├── Dockerfile           # Dockerfile do backend
│   └── server.js            # Servidor principal
│
├── frontend/                # Frontend React/TypeScript
│   ├── src/
│   │   ├── App.tsx          # Componente principal
│   │   └── assets/          # Imagens e recursos
│   ├── Dockerfile           # Dockerfile do frontend
│   └── nginx.conf           # Configuração Nginx
│
├── tests/                   # Testes
├── docker-compose.yml       # Configuração Docker Compose
├── .env                     # Variáveis de ambiente (não versionado)
├── .env.example             # Exemplo de variáveis de ambiente
├── package.json             # Dependências do backend
└── README.md                # Este arquivo
```

---

## 🔐 Variáveis de Ambiente

### Variáveis Obrigatórias

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `DATABASE_URL` | URL de conexão PostgreSQL | `postgresql://postgres:senha@localhost:5432/exposeargo` |
| `SENDGRID_API_KEY` | API Key do SendGrid | `SG.xxxxxxxxxxxxx` |
| `FROM_EMAIL` | Email remetente verificado | `contato@exemplo.com` |
| `PORTFOLIO_URL` | URL do portfólio | `https://portfolio.com` |

### Variáveis Opcionais

| Variável | Descrição | Padrão |
|----------|-----------|--------|
| `PORT` | Porta do backend | `8000` |
| `NODE_ENV` | Ambiente de execução | `development` |
| `FRONTEND_URL` | URL do frontend (CORS) | `http://localhost:5173` |
| `POSTGRES_PASSWORD` | Senha do PostgreSQL (Docker) | `postgres` |
| `POSTGRES_PORT` | Porta do PostgreSQL (Docker) | `5432` |
| `FRONTEND_PORT` | Porta do frontend (Docker) | `5173` |
| `RUN_SETUP` | Executar setup automático | `true` |

---

## 🔧 Troubleshooting

### Problema: Erro ao conectar ao PostgreSQL

**Sintomas:**
```
❌ Erro: password authentication failed
❌ Erro: connection refused
```

**Soluções:**
1. Verifique se o PostgreSQL está rodando:
```bash
# Windows
# Verifique no Gerenciador de Serviços

# macOS/Linux
sudo systemctl status postgresql
# ou
brew services list
```

2. Verifique a `DATABASE_URL` no `.env`:
```env
DATABASE_URL=postgresql://postgres:SUA_SENHA@localhost:5432/exposeargo
```

3. Teste a conexão:
```bash
psql -U postgres -d exposeargo
```

### Problema: SENDGRID_API_KEY não encontrada

**Sintomas:**
```
❌ ERRO: SENDGRID_API_KEY não encontrada no .env
```

**Soluções:**
1. Verifique se o arquivo `.env` está na raiz do projeto
2. Verifique se a variável está escrita corretamente (sem espaços)
3. Reinicie o servidor após alterar o `.env`

### Problema: Email não está sendo enviado

**Sintomas:**
- Lead é salvo no banco, mas email não chega

**Soluções:**
1. Execute o diagnóstico:
```bash
npm run diagnose-email
```

2. Verifique se o email remetente está verificado no SendGrid
3. Verifique se a API Key tem permissão de "Mail Send"
4. Verifique a pasta de SPAM do destinatário

### Problema: Porta já está em uso

**Sintomas:**
```
Error: listen EADDRINUSE: address already in use :::8000
```

**Soluções:**
1. Encontre o processo usando a porta:
```bash
# Windows
netstat -ano | findstr :8000

# macOS/Linux
lsof -i :8000
```

2. Mate o processo ou altere a porta no `.env`:
```env
PORT=8001
```

### Problema: CORS Error no Frontend

**Sintomas:**
```
Access to fetch at 'http://localhost:8000/api/leads' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**Soluções:**
1. Verifique se `FRONTEND_URL` no `.env` está correto:
```env
FRONTEND_URL=http://localhost:5173
```

2. Reinicie o backend após alterar o `.env`

### Problema: Docker não inicia

**Sintomas:**
- Containers não sobem ou ficam em restart loop

**Soluções:**
1. Verifique os logs:
```bash
docker-compose logs
```

2. Verifique se todas as variáveis obrigatórias estão no `.env`
3. Reconstrua as imagens:
```bash
docker-compose build --no-cache
docker-compose up -d
```

### Problema: Banco de dados não é criado

**Soluções:**
1. Execute o setup manualmente:
```bash
# Local
npm run setup-db

# Docker
docker-compose exec backend node backend/scripts/setupDatabase.js
```

2. Verifique se o PostgreSQL está acessível
3. Verifique as permissões do usuário `postgres`

---

## 📚 Comandos Úteis

### Desenvolvimento Local

```bash
# Instalar dependências
npm install
cd frontend && npm install && cd ..

# Setup do banco
npm run setup-db

# Executar migrações
npm run migrate

# Iniciar backend (desenvolvimento)
npm run dev

# Iniciar frontend (desenvolvimento)
cd frontend && npm run dev

# Diagnóstico de email
npm run diagnose-email
```

### Docker

```bash
# Construir e iniciar
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose stop

# Remover tudo
docker-compose down -v

# Executar comando no container
docker-compose exec backend sh
docker-compose exec postgres psql -U postgres -d exposeargo
```

---

## 🧪 Testes

```bash
# Executar testes
npm test

# Testes específicos
npm test -- tests/lead.test.js
```

---

## 📞 Suporte

Para problemas ou dúvidas:
1. Verifique a seção [Troubleshooting](#-troubleshooting)
2. Consulte os logs do servidor
3. Execute o diagnóstico de email: `npm run diagnose-email`

---

## 📄 Licença

Este projeto é privado e de propriedade da Argo Tech.

---

**Última atualização:** Janeiro 2025

