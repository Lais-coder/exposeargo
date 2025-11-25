# 📋 Requisitos Técnicos Detalhados

Documentação técnica completa dos requisitos do sistema ExposeArgo.

## 🖥️ Requisitos de Hardware

### Mínimos
- **CPU**: 2 cores, 2.0 GHz
- **RAM**: 4 GB
- **Disco**: 2 GB livres (SSD recomendado)
- **Rede**: Conexão à internet para envio de emails

### Recomendados (Produção)
- **CPU**: 4 cores, 2.5 GHz ou superior
- **RAM**: 8 GB ou mais
- **Disco**: 10 GB livres (SSD)
- **Rede**: Banda larga estável

## 💻 Requisitos de Software

### Sistema Operacional

#### Windows
- **Versão**: Windows 10 (build 1903+) ou Windows 11
- **Arquitetura**: x64 (64-bit)
- **WSL2**: Opcional, mas recomendado para desenvolvimento

#### macOS
- **Versão**: macOS 10.15 (Catalina) ou superior
- **Arquitetura**: Intel (x64) ou Apple Silicon (ARM64)
- **Homebrew**: Recomendado para instalação de dependências

#### Linux
- **Distribuições suportadas**:
  - Ubuntu 20.04 LTS ou superior
  - Debian 11 ou superior
  - CentOS 8+ / Rocky Linux 8+
  - Fedora 35+
- **Arquitetura**: x64 (64-bit)

### Node.js

**Versão requerida**: 18.x LTS ou superior

**Verificação:**
```bash
node --version  # Deve retornar v18.x.x ou superior
```

**Instalação:**

**Windows:**
- Download: https://nodejs.org/
- Instalar Node.js LTS (Long Term Support)
- Verificar instalação: `node --version`

**macOS:**
```bash
# Via Homebrew
brew install node@18

# Ou baixar do site oficial
# https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

**Linux (RHEL/CentOS):**
```bash
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
```

### npm (Node Package Manager)

**Versão requerida**: 9.x ou superior (vem com Node.js)

**Verificação:**
```bash
npm --version  # Deve retornar 9.x.x ou superior
```

**Atualização (se necessário):**
```bash
npm install -g npm@latest
```

### PostgreSQL

**Versão requerida**: 12.x ou superior (15.x recomendado)

**Verificação:**
```bash
psql --version  # Deve retornar versão 12.x ou superior
```

**Instalação:**

**Windows:**
1. Download: https://www.postgresql.org/download/windows/
2. Instalar PostgreSQL 15
3. Durante instalação, anotar senha do usuário `postgres`
4. Adicionar PostgreSQL ao PATH (opcional)

**macOS:**
```bash
# Via Homebrew
brew install postgresql@15
brew services start postgresql@15

# Verificar status
brew services list
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql-15 postgresql-contrib-15
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Linux (RHEL/CentOS):**
```bash
sudo dnf install postgresql15-server postgresql15
sudo postgresql-15-setup initdb
sudo systemctl enable postgresql-15
sudo systemctl start postgresql-15
```

**Configuração inicial:**
```bash
# Criar usuário e banco (se necessário)
sudo -u postgres psql
CREATE USER postgres WITH PASSWORD 'sua_senha';
CREATE DATABASE exposeargo OWNER postgres;
\q
```

### Docker (Opcional - para containerização)

**Versão requerida**: 
- Docker Engine: 20.10 ou superior
- Docker Compose: 2.0 ou superior

**Verificação:**
```bash
docker --version
docker-compose --version
```

**Instalação:**

**Windows/macOS:**
- Docker Desktop: https://www.docker.com/products/docker-desktop/
- Inclui Docker Engine e Docker Compose

**Linux:**
```bash
# Instalação via script oficial
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Adicionar usuário ao grupo docker
sudo usermod -aG docker $USER

# Instalar Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Reiniciar sessão para aplicar mudanças
```

### Git (Opcional - para clonar repositório)

**Versão requerida**: 2.30 ou superior

**Instalação:**

**Windows:**
- Download: https://git-scm.com/download/win
- Ou instalar via Git for Windows

**macOS:**
```bash
# Já vem instalado, ou via Homebrew
brew install git
```

**Linux:**
```bash
sudo apt install git  # Ubuntu/Debian
sudo yum install git   # RHEL/CentOS
```

## 🌐 Requisitos de Rede

### Portas Necessárias

| Porta | Serviço | Descrição |
|-------|---------|-----------|
| 8000 | Backend API | API REST do backend |
| 5173 | Frontend | Servidor de desenvolvimento Vite |
| 5432 | PostgreSQL | Banco de dados (padrão) |
| 80 | Frontend (Docker) | Nginx em produção |

**Verificar portas disponíveis:**

**Windows:**
```cmd
netstat -ano | findstr :8000
netstat -ano | findstr :5432
```

**macOS/Linux:**
```bash
lsof -i :8000
lsof -i :5432
```

### Firewall

Certifique-se de que as portas necessárias estão abertas:

**Windows:**
- Firewall do Windows → Permitir aplicativo
- Ou via PowerShell:
```powershell
New-NetFirewallRule -DisplayName "ExposeArgo Backend" -Direction Inbound -LocalPort 8000 -Protocol TCP -Action Allow
```

**Linux (UFW):**
```bash
sudo ufw allow 8000/tcp
sudo ufw allow 5432/tcp
```

**Linux (firewalld):**
```bash
sudo firewall-cmd --permanent --add-port=8000/tcp
sudo firewall-cmd --permanent --add-port=5432/tcp
sudo firewall-cmd --reload
```

## 🔐 Requisitos de Serviços Externos

### SendGrid

**Conta**: Conta gratuita ou paga no SendGrid
- **Plano gratuito**: 100 emails/dia
- **API Key**: Necessária com permissão "Mail Send"
- **Email verificado**: Email remetente deve estar verificado

**Configuração:**
1. Criar conta: https://sendgrid.com/
2. Verificar domínio ou email único
3. Gerar API Key: https://app.sendgrid.com/settings/api_keys
4. Configurar no `.env`:
```env
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FROM_EMAIL=seu_email@exemplo.com
```

## 📦 Dependências do Projeto

### Backend (Node.js)

Principais dependências:
- `express`: ^5.1.0 - Framework web
- `pg`: ^8.16.3 - Cliente PostgreSQL
- `@sendgrid/mail`: ^8.1.6 - SDK SendGrid
- `dotenv`: ^17.2.3 - Gerenciamento de variáveis de ambiente
- `cors`: ^2.8.5 - Middleware CORS

**Instalação:**
```bash
npm install
```

### Frontend (React/TypeScript)

Principais dependências:
- `react`: ^19.2.0 - Biblioteca React
- `react-dom`: ^19.2.0 - React DOM
- `vite`: ^7.2.4 - Build tool
- `typescript`: ~5.9.3 - TypeScript

**Instalação:**
```bash
cd frontend
npm install
```

## 🗄️ Requisitos de Banco de Dados

### PostgreSQL

**Banco de dados**: `exposeargo`
**Usuário**: `postgres` (ou customizado)
**Tabelas principais**:
- `leads` - Armazena os leads capturados

**Estrutura mínima:**
```sql
CREATE DATABASE exposeargo;
```

**Migrações:**
- `001_create_leads_table.sql` - Cria tabela de leads
- `002_add_phone_to_leads.sql` - Adiciona campo telefone

**Executar migrações:**
```bash
npm run setup-db  # Executa todas as migrações
```

## 🐳 Requisitos Docker (Opcional)

### Imagens Docker Utilizadas

| Imagem | Versão | Uso |
|--------|--------|-----|
| `node:18-alpine` | 18-alpine | Backend |
| `postgres:15-alpine` | 15-alpine | Banco de dados |
| `nginx:alpine` | alpine | Frontend (produção) |

### Recursos Docker

**Mínimos:**
- CPU: 2 cores
- RAM: 4 GB
- Disco: 5 GB

**Recomendados:**
- CPU: 4 cores
- RAM: 8 GB
- Disco: 20 GB

## ✅ Checklist de Instalação

### Pré-instalação
- [ ] Sistema operacional compatível
- [ ] Node.js 18.x instalado
- [ ] npm 9.x instalado
- [ ] PostgreSQL 12+ instalado e rodando
- [ ] Portas 8000, 5173, 5432 disponíveis
- [ ] Conta SendGrid criada
- [ ] API Key do SendGrid gerada
- [ ] Email remetente verificado no SendGrid

### Instalação
- [ ] Repositório clonado
- [ ] Dependências do backend instaladas (`npm install`)
- [ ] Dependências do frontend instaladas (`cd frontend && npm install`)
- [ ] Arquivo `.env` criado e configurado
- [ ] Banco de dados criado
- [ ] Migrações executadas (`npm run setup-db`)

### Verificação
- [ ] Backend inicia sem erros (`npm run dev`)
- [ ] Frontend inicia sem erros (`cd frontend && npm run dev`)
- [ ] Health check responde (`curl http://localhost:8000/health`)
- [ ] Teste de email funciona (`npm run diagnose-email`)

## 🔍 Verificação de Requisitos

Execute o script de verificação (criar se necessário):

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar PostgreSQL
psql --version

# Verificar Docker (se usando)
docker --version
docker-compose --version

# Verificar portas
# Windows
netstat -ano | findstr ":8000 :5173 :5432"

# macOS/Linux
lsof -i :8000
lsof -i :5173
lsof -i :5432
```

## 📝 Notas Adicionais

### Desenvolvimento
- Editor de código recomendado: VS Code
- Extensões úteis:
  - ESLint
  - Prettier
  - Docker
  - PostgreSQL

### Produção
- Use variável `NODE_ENV=production`
- Configure HTTPS para produção
- Use variáveis de ambiente seguras
- Configure backup do banco de dados
- Monitore logs e performance

---

**Última atualização:** Janeiro 2025


