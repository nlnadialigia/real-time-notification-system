**Diagrama arquitetural completo**

Considerações:

* Google Login (OAuth2 / OIDC)
* JWT próprio
* WebSocket autenticado
* Arquitetura orientada a eventos
* Multi-canal
* Worker separado
* Redis
* PostgreSQL

Vou dividir em **3 níveis de diagrama**:

1. Diagrama de Alto Nível (Infraestrutura)
2. Diagrama de Fluxo de Autenticação
3. Diagrama de Fluxo de Notificação

---

# 1️⃣ Diagrama de Alto Nível (Infraestrutura Completa)

```
                          ┌─────────────────────┐
                          │      Frontend       │
                          │  (Next.js / SPA)    │
                          └──────────┬──────────┘
                                     │
                                     │ HTTPS
                                     ▼
                         ┌─────────────────────┐
                         │        API          │
                         │  NestJS Instance    │
                         │---------------------│
                         │ Auth Module         │
                         │ Notification Module │
                         │ WebSocket Gateway   │
                         └──────────┬──────────┘
                                    │
          ┌─────────────────────────┼─────────────────────────┐
          │                         │                         │
          ▼                         ▼                         ▼
 ┌────────────────┐       ┌────────────────┐       ┌────────────────┐
 │  PostgreSQL    │       │     Redis      │       │  Socket.IO     │
 │ (Neon Free)    │       │ (Upstash)      │       │ Redis Adapter  │
 └────────────────┘       └────────────────┘       └────────────────┘
                                    │
                                    ▼
                          ┌─────────────────────┐
                          │       Worker        │
                          │  (BullMQ Processor) │
                          └──────────┬──────────┘
                                     │
             ┌───────────────────────┼───────────────────────┐
             ▼                       ▼                       ▼
      ┌──────────────┐        ┌──────────────┐        ┌──────────────┐
      │   Email      │        │     Push     │        │   Webhook    │
      │  (Resend)    │        │ (Firebase)   │        │  External    │
      └──────────────┘        └──────────────┘        └──────────────┘
```

---

# 2️⃣ Fluxo de Autenticação (Google OAuth + JWT Próprio)

```
[1] Usuário clica "Login com Google"
        │
        ▼
Google Identity Services
        │
        ▼
Frontend recebe idToken
        │
        ▼
POST /auth/google
        │
        ▼
API valida idToken com google-auth-library
        │
        ├── Verifica assinatura
        ├── Verifica audience
        └── Verifica issuer
        │
        ▼
Cria ou busca usuário no banco
        │
        ▼
Emite JWT próprio (access token)
        │
        ▼
Frontend armazena JWT
        │
        ▼
JWT usado em:
   - REST
   - WebSocket
```

---

# 3️⃣ Fluxo de Notificação (Versão Evoluída)

### Criação da notificação

```
Admin/API externa → POST /notifications
                      │
                      ▼
              NotificationService
                      │
                      ▼
          Salva no PostgreSQL
                      │
                      ▼
        Publica NotificationCreatedEvent
                      │
                      ▼
                 Redis Pub/Sub
                      │
                      ▼
                  Worker
```

---

### Processamento por canal

```
Worker recebe evento
        │
        ├── Verifica preferências do usuário
        │
        ├── Enfileira Email Job (BullMQ)
        │
        ├── Enfileira Push Job
        │
        └── Emite WebSocket Event
```

---

### Entrega WebSocket

```
Worker → Redis Adapter
        │
        ▼
API Instance(s)
        │
        ▼
Socket.IO → Usuário conectado
```

---

# 4️⃣ Separação de Responsabilidades

## API

* Autenticação
* CRUD notificações
* Emissão de eventos
* WebSocket gateway
* Exposição REST

## Worker

* Processamento pesado
* Retry
* Backoff
* Controle de entrega
* Registro de status

---

# 5️⃣ Arquitetura Conceitual Final (Nível Sênior)

```
                ┌──────────────────────┐
                │  API Layer           │
                │  (Controllers)       │
                └──────────┬───────────┘
                           ▼
                ┌──────────────────────┐
                │ Application Layer    │
                │ (Use Cases)          │
                └──────────┬───────────┘
                           ▼
                ┌──────────────────────┐
                │ Domain Layer         │
                │ (Entities / Events)  │
                └──────────┬───────────┘
                           ▼
                ┌──────────────────────┐
                │ Infrastructure       │
                │ Prisma / Redis /     │
                │ Email / Push         │
                └──────────────────────┘
```

---

# 🔥 Complexidade Arquitetural Alcançada

Com esse desenho você cobre:

* OAuth2 / OIDC
* JWT próprio
* WebSocket autenticado
* Event-driven architecture
* Pub/Sub
* Background processing
* Retry e backoff
* Multi-channel delivery
* Horizontal scaling
* Clean architecture

