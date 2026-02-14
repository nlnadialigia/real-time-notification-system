# 📡 Real-Time Notification System

Sistema de notificações em tempo real com autenticação via Google OAuth2, arquitetura orientada a eventos, processamento assíncrono e entrega multi-canal.

---

## 📌 Visão Geral

Este projeto implementa uma API distribuída responsável por:

* Autenticação via Google (OAuth2 / OpenID Connect)
* Emissão de JWT próprio
* Entrega de notificações em tempo real (WebSocket)
* Processamento assíncrono via filas
* Entrega multi-canal (WebSocket, Email, Push, Webhook)
* Rastreamento de status de entrega
* Arquitetura limpa e escalável

O objetivo é demonstrar boas práticas de engenharia backend em nível pleno → sênior.

---

# 🏗 Arquitetura

## High-Level Architecture

```
Client (Frontend)
        │
        ▼
API (NestJS)
        │
        ├── PostgreSQL (persistência)
        ├── Redis (Pub/Sub + Queue)
        │
        ▼
Worker (BullMQ)
        │
        ├── Email (Resend)
        ├── Push (Firebase)
        └── Webhook
```

---

## Arquitetura em Camadas

O sistema segue princípios de Clean Architecture e DDD leve:

```
Domain
↑
Application (Use Cases)
↑
Infrastructure (Prisma, Redis, Email, Firebase)
↑
API (Controllers, Gateways)
```

### Domain

* Entidades
* Eventos
* Enums
* Regras de negócio puras

### Application

* Casos de uso
* Ports (interfaces)
* Orquestração de fluxo

### Infrastructure

* Implementações concretas
* Prisma
* Redis
* BullMQ
* Google Token Validator
* Email/Push providers

### API

* Controllers REST
* WebSocket Gateway
* Guards
* DTOs

---

# 🔐 Autenticação

O sistema utiliza **Google OAuth2 (OpenID Connect)**.

### Fluxo

1. Frontend realiza login com Google
2. Recebe `idToken`
3. Envia `idToken` para a API
4. API valida assinatura e audience
5. Usuário é criado ou recuperado
6. API emite JWT próprio

### Segurança

* Validação de issuer
* Validação de audience
* JWT com expiração curta
* Guards de autorização
* Rate limiting

---

# 🔔 Notificações

## Fluxo de Criação

1. Requisição `POST /notifications`
2. Persistência em PostgreSQL
3. Publicação de evento `NotificationCreated`
4. Worker consome evento
5. Entrega por canal
6. Registro de status de entrega

---

## Canais Suportados

* WebSocket (tempo real)
* Email
* Push Notification
* Webhook externo

---

# ⚙️ Requisitos Não Funcionais

## Performance

* P95 REST ≤ 200ms
* Entrega WebSocket ≤ 150ms
* Processamento assíncrono ≤ 2s

## Escalabilidade

* API stateless
* Redis Pub/Sub
* Worker separado
* Suporte a múltiplas instâncias

## Consistência

* Persistência forte
* Entrega eventual

## Resiliência

* Retry com backoff exponencial
* Dead letter queue
* Rastreamento de tentativas

---

# 🧠 Decisões Arquiteturais

### Por que separar API e Worker?

Evitar bloqueio da thread principal e permitir escalabilidade independente.

### Por que Event-Driven?

Desacoplamento entre criação e entrega.

### Por que JWT próprio?

Independência do provedor externo e controle de sessão.

### Por que Clean Architecture?

Testabilidade, manutenção e evolução sem alto acoplamento.

---

# 🗄 Modelagem Principal

### User

* id
* email
* googleId
* createdAt

### Notification

* id
* userId
* title
* message
* read
* createdAt

### NotificationDelivery

* id
* notificationId
* channel
* status
* attempts
* lastAttemptAt

---

# 🚀 Como Rodar Localmente

## 1. Clonar

```bash
git clone <repo>
cd notification-system
```

## 2. Instalar dependências

```bash
npm install
```

## 3. Subir infraestrutura local

```bash
docker-compose up -d
```

## 4. Rodar migrations

```bash
npx prisma migrate dev
```

## 5. Rodar API

```bash
npm run start:api
```

## 6. Rodar Worker

```bash
npm run start:worker
```

---

# 🧪 Testes

```bash
npm run test
```

Cobertura alvo:

* MVP ≥ 70%
* Evoluído ≥ 85%

---

# 📊 Observabilidade

* Logs estruturados (JSON)
* Correlation ID por requisição
* Métricas de entrega
* Endpoint `/health`

---

# 📦 Deploy

Recomendado:

* API: Render / Fly.io
* Worker: mesma plataforma
* PostgreSQL: Neon
* Redis: Upstash
* Email: Resend
* Push: Firebase

Todos possuem free tier.

---

# 📈 Evoluções Futuras

* Refresh Token Rotation
* Rate limiting por plano
* Dashboard administrativo
* Feature flags
* Multi-tenant
* Métricas Prometheus
* Tracing distribuído (OpenTelemetry)

---

# 🎯 Objetivo do Projeto

Demonstrar:

* Domínio de OAuth2 / OIDC
* Arquitetura orientada a eventos
* Processamento assíncrono
* Entrega multi-canal
* Escalabilidade horizontal
* Separação clara de camadas
* Maturidade em design backend

---

# 👩‍💻 Autor

Desenvolvido como projeto de engenharia backend focado em arquitetura moderna, escalável e resiliente.

---