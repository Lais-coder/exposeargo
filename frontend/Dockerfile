# Dockerfile para o Frontend
FROM node:18-alpine AS builder

# Argumentos de build
ARG VITE_API_URL=http://localhost:8000

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências
COPY frontend/package*.json ./

# Instalar dependências
RUN npm install

# Copiar código do frontend
COPY frontend/ ./

# Definir variáveis de ambiente para o build
ENV VITE_API_URL=$VITE_API_URL

# Build da aplicação
RUN npm run build

# Stage de produção com Nginx
FROM nginx:alpine

# Copiar arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuração customizada do Nginx
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Expor porta 80
EXPOSE 80

# Iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]

