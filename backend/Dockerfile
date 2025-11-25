# Dockerfile para o Backend
FROM node:18-alpine

# Instalar postgresql-client para usar pg_isready
RUN apk add --no-cache postgresql-client

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências da raiz
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código do backend
COPY backend/ ./backend/

# Expor porta do backend
EXPOSE 8000

# Script de inicialização
COPY backend/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["node", "backend/server.js"]

