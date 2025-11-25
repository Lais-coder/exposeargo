# ⚡ Guia Rápido de Início

Inicie o projeto em 5 minutos!

## 🚀 Início Rápido com Docker (Recomendado)

### 1. Pré-requisitos
- Docker instalado
- Arquivo `.env` configurado

### 2. Execute
```bash
docker-compose up -d
```

### 3. Acesse
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

**Pronto!** 🎉

---

## 🛠️ Início Rápido Local

### 1. Instalar Dependências
```bash
npm install
cd frontend && npm install && cd ..
```

### 2. Configurar Banco
```bash
npm run setup-db
```

### 3. Iniciar Backend
```bash
npm run dev
```

### 4. Iniciar Frontend (novo terminal)
```bash
cd frontend
npm run dev
```

### 5. Acessar
- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## ⚙️ Configuração Mínima do `.env`

```env
DATABASE_URL=postgresql://postgres:senha@localhost:5432/exposeargo
SENDGRID_API_KEY=SG.sua_api_key
FROM_EMAIL=seu_email@exemplo.com
PORTFOLIO_URL=https://seu-portfolio.com
```

---

## ❓ Problemas?

Consulte o [README.md](README.md) para documentação completa.

---

**Tempo estimado:** 5 minutos


