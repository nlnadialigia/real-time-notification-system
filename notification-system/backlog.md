**Backlog técnico completo**,

Organizado por **Épicos → Features → Tasks técnicas**, já considerando:

* Google Login (OAuth2)
* JWT próprio
* WebSocket autenticado
* Event-driven
* Worker + Redis
* Multi-canal
* Observabilidade

---

# 📦 ÉPICO 1 — Fundação do Projeto

## 🎯 Objetivo

Estruturar base sólida e padronizada.

### Feature 1.1 — Setup do Projeto

**Tasks**

* [ ] Criar projeto NestJS
* [ ] Configurar TypeScript strict
* [ ] Configurar ESLint + Prettier
* [ ] Configurar variáveis de ambiente (dotenv + validação)
* [ ] Configurar logger (Pino)
* [ ] Configurar Dockerfile multi-stage
* [ ] Criar docker-compose (Postgres + Redis local)

---

### Feature 1.2 — Banco de Dados

**Tasks**

* [ ] Instalar Prisma
* [ ] Configurar conexão Neon
* [ ] Criar schema inicial (User, Notification)
* [ ] Criar migration
* [ ] Seed opcional

---

# 🔐 ÉPICO 2 — Autenticação Google + JWT

## 🎯 Objetivo

Implementar fluxo OAuth2 seguro.

---

### Feature 2.1 — Validação de ID Token

**Tasks**

* [ ] Instalar google-auth-library
* [ ] Criar AuthService
* [ ] Implementar validação de idToken
* [ ] Validar audience
* [ ] Validar issuer
* [ ] Tratar erro de token inválido

---

### Feature 2.2 — Persistência do Usuário

**Tasks**

* [ ] Criar UserService
* [ ] Implementar findOrCreateUser
* [ ] Garantir unicidade por googleId
* [ ] Criar migration

---

### Feature 2.3 — JWT Próprio

**Tasks**

* [ ] Instalar @nestjs/jwt
* [ ] Criar JwtStrategy
* [ ] Criar guard global
* [ ] Definir expiração (15min)
* [ ] Assinar token com secret seguro

---

### Feature 2.4 — Endpoint Auth

**Tasks**

* [ ] Criar POST /auth/google
* [ ] Retornar accessToken + user
* [ ] Testar fluxo completo

---

# 🔌 ÉPICO 3 — WebSocket Autenticado

## 🎯 Objetivo

Entrega em tempo real segura.

---

### Feature 3.1 — Gateway

**Tasks**

* [ ] Instalar Socket.IO
* [ ] Criar NotificationGateway
* [ ] Implementar middleware JWT
* [ ] Associar socketId ao userId
* [ ] Gerenciar desconexão

---

### Feature 3.2 — Emissão de Evento

**Tasks**

* [ ] Criar método sendToUser
* [ ] Emitir evento "notification"
* [ ] Testar com múltiplos usuários

---

# 🔔 ÉPICO 4 — CRUD de Notificações (MVP)

---

### Feature 4.1 — Criar Notificação

**Tasks**

* [ ] Criar NotificationService
* [ ] Criar POST /notifications
* [ ] Persistir no banco
* [ ] Emitir via WebSocket

---

### Feature 4.2 — Listar Notificações

**Tasks**

* [ ] GET /notifications
* [ ] Paginação
* [ ] Filtro read/unread
* [ ] Ordenação por data

---

### Feature 4.3 — Marcar como Lida

**Tasks**

* [ ] PATCH /notifications/:id/read
* [ ] Validar ownership
* [ ] Atualizar status

---

# 📡 ÉPICO 5 — Arquitetura Orientada a Eventos

---

### Feature 5.1 — Event Bus Interno

**Tasks**

* [ ] Instalar EventEmitter2
* [ ] Criar NotificationCreatedEvent
* [ ] Criar handler WebSocket
* [ ] Remover envio direto do service

---

### Feature 5.2 — Redis Pub/Sub

**Tasks**

* [ ] Configurar Redis
* [ ] Implementar publisher
* [ ] Implementar subscriber
* [ ] Testar com múltiplas instâncias

---

# ⚙️ ÉPICO 6 — Worker + BullMQ

---

### Feature 6.1 — Setup Worker

**Tasks**

* [ ] Instalar BullMQ
* [ ] Criar fila notification-email
* [ ] Criar processor
* [ ] Configurar retry com backoff

---

### Feature 6.2 — Separação API / Worker

**Tasks**

* [ ] Criar entrypoint separado
* [ ] Configurar containers independentes
* [ ] Testar processamento async

---

# 📬 ÉPICO 7 — Multi-Canal

---

### Feature 7.1 — Email

**Tasks**

* [ ] Integrar Resend
* [ ] Criar EmailService
* [ ] Criar template simples
* [ ] Registrar status de envio

---

### Feature 7.2 — Push (Firebase)

**Tasks**

* [ ] Configurar Firebase
* [ ] Armazenar device token
* [ ] Criar PushService
* [ ] Implementar envio

---

### Feature 7.3 — Rastreamento de Entrega

**Tasks**

* [ ] Criar model NotificationDelivery
* [ ] Registrar tentativa
* [ ] Atualizar status (SUCCESS/FAILED)
* [ ] Incrementar attempts

---

# 🧩 ÉPICO 8 — Preferências do Usuário

---

### Feature 8.1 — Modelagem

**Tasks**

* [ ] Criar model NotificationPreference
* [ ] Criar migration

---

### Feature 8.2 — Endpoints

**Tasks**

* [ ] GET /preferences
* [ ] PATCH /preferences
* [ ] Aplicar preferências no Worker

---

# 🛡 ÉPICO 9 — Segurança Avançada

---

### Feature 9.1 — Rate Limiting

**Tasks**

* [ ] Instalar rate-limit middleware
* [ ] Aplicar globalmente
* [ ] Aplicar limite específico em /auth

---

### Feature 9.2 — Refresh Token (Evoluído)

**Tasks**

* [ ] Criar model RefreshToken
* [ ] Implementar rotação
* [ ] Blacklist de token inválido

---

# 📊 ÉPICO 10 — Observabilidade

---

### Feature 10.1 — Logs Estruturados

**Tasks**

* [ ] Implementar Pino
* [ ] Adicionar correlationId
* [ ] Logar criação de notificação
* [ ] Logar falhas de envio

---

### Feature 10.2 — Métricas

**Tasks**

* [ ] Contador de notificações criadas
* [ ] Contador por canal
* [ ] Tempo médio de entrega
* [ ] Endpoint /health

---

# 🧪 ÉPICO 11 — Testes

---

### Feature 11.1 — Unitários

**Tasks**

* [ ] Testar AuthService
* [ ] Testar NotificationService
* [ ] Testar Worker processors

---

### Feature 11.2 — Integração

**Tasks**

* [ ] Teste fluxo login completo
* [ ] Teste criação + entrega
* [ ] Teste retry

---

# 🚀 ÉPICO 12 — Deploy & CI/CD

---

### Feature 12.1 — CI

**Tasks**

* [ ] Configurar GitHub Actions
* [ ] Rodar lint
* [ ] Rodar testes
* [ ] Build Docker

---

### Feature 12.2 — Deploy

**Tasks**

* [ ] Deploy API
* [ ] Deploy Worker
* [ ] Configurar variáveis seguras
* [ ] Configurar domínio

---

# 📌 Backlog Estratégico (Ordem Recomendada)

### Sprint 1

* Épico 1
* Épico 2
* Épico 3
* Épico 4

### Sprint 2

* Épico 5
* Épico 6

### Sprint 3

* Épico 7
* Épico 8

### Sprint 4

* Épico 9
* Épico 10
* Épico 11
* Épico 12

---

# 🎯 Resultado

Esse backlog:

* Demonstra visão sistêmica
* Mostra planejamento incremental
* Mostra separação clara entre MVP e arquitetura evoluída
* É compatível com ambiente real de produto

---