# Sistema de Notificações em Tempo Real

[![en](https://img.shields.io/badge/lang-en-red.svg)](../README.md)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?logo=swagger)](http://localhost:5001/api)
[![Licença](https://img.shields.io/badge/licença-MIT-blue.svg)](../LICENSE)

Sistema de notificações em tempo real com autenticação Google OAuth2, arquitetura orientada a eventos, processamento assíncrono e entrega multicanal.

## Funcionalidades

- **Autenticação Google OAuth2**: Autenticação segura de usuários usando contas Google
- **Notificações em Tempo Real**: Entrega instantânea de notificações via WebSocket usando Socket.IO
- **API RESTful**: API REST completa para gerenciamento de notificações
- **Arquitetura Orientada a Eventos**: Processamento escalável de notificações
- **Documentação Swagger**: Documentação interativa da API
- **Banco de Dados**: PostgreSQL com Prisma ORM (v7.x com adaptadores de driver)
- **Logging**: Logging estruturado com Pino

## Stack Tecnológica

- **Framework**: NestJS 11.x
- **Banco de Dados**: PostgreSQL com Prisma 7.x
- **Autenticação**: Passport JWT + Google OAuth2
- **WebSocket**: Socket.IO 4.x
- **Documentação**: Swagger/OpenAPI
- **Logging**: nestjs-pino + pino-pretty

## Pré-requisitos

- Node.js 18+
- PostgreSQL
- Conta no Google Cloud Console (para credenciais OAuth2)

## Instalação

```bash
npm install
```

## Configuração do Ambiente

Crie um arquivo `.env` no diretório raiz:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/notifications"
JWT_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
PORT=5001
```

## Configuração do Banco de Dados

```bash
# Gerar Prisma Client
npx prisma generate

# Executar migrations
npx prisma migrate dev
```

## Executando a Aplicação

```bash
# Modo desenvolvimento
npm run start:dev

# Modo produção
npm run build
npm run start:prod
```

A aplicação estará disponível em `http://localhost:5001`

## Documentação da API

Acesse a documentação Swagger em:
```
http://localhost:5001/api
```

## Guia de Testes

Para instruções detalhadas de testes usando Postman, veja:
- [Testing Guide (English)](./testing-guide.md)
- [Guia de Testes (Português)](./guia_testes.md)

## Estrutura do Projeto

```
src/
├── auth/              # Módulo de autenticação (Google OAuth2, JWT)
├── notifications/     # Módulo de notificações (REST + WebSocket)
├── users/            # Gerenciamento de usuários
├── prisma/           # Serviço e configuração do Prisma
└── main.ts           # Ponto de entrada da aplicação
```

## Endpoints da API

### Autenticação
- `POST /auth/google` - Autenticar com token ID do Google

### Notificações
- `POST /notifications` - Criar e enviar notificação (requer Bearer token)

### Eventos WebSocket
- Evento: `notification` - Entrega de notificação em tempo real

## ⚠️ Observação sobre Ambiente Gratuito

Este projeto está hospedado em plano gratuito de infraestrutura.

Por esse motivo:
- A aplicação pode entrar em modo de suspensão após período de inatividade.
- A primeira requisição após esse período pode apresentar latência adicional (cold start).
- O worker pode iniciar com atraso se também estiver suspenso.
- Esse comportamento é esperado no plano free e não representa falha na aplicação.

> Em ambiente de produção com instância dedicada, esse comportamento não ocorre.
