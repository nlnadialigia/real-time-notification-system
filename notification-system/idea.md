**API de Notificações em Tempo Real**

A ideia é:

* 🔹 Fase 1 → MVP funcional, já com OAuth2 correto
* 🔥 Fase 2 → Evolução arquitetural nível sênior (segurança, escalabilidade, resiliência)

---

# 🚀 FASE 1 — MVP com Google Login

## 🎯 Objetivo do MVP

Construir uma API que:

* Autentica usuários via Google
* Emite JWT próprio da aplicação
* Permite conexão WebSocket autenticada
* Cria notificações
* Entrega em tempo real
* Persiste histórico

Tudo já preparado para evolução futura.

---

# 🏗 Stack MVP

* Node.js
* NestJS
* Prisma
* PostgreSQL (Neon free)
* Socket.IO
* google-auth-library
* Swagger (OpenAPI)
* Deploy: Render

---

# 🔐 Arquitetura de Autenticação (MVP)

### Fluxo oficial

```
Frontend → Google Login
Google → retorna idToken
Frontend → envia idToken para API
API → valida idToken com Google
API → cria/recupera usuário
API → emite JWT próprio
Frontend → usa JWT para:
    - REST
    - WebSocket
```

⚠️ O backend é responsável por validar o token do Google.

---

# 📦 Estrutura de Módulos (MVP)

```
src/
 ├── auth/
 │    ├── auth.controller.ts
 │    ├── auth.service.ts
 │    ├── google.strategy.ts (ou validação manual)
 │    └── jwt.strategy.ts
 │
 ├── users/
 │
 ├── notifications/
 │
 ├── websocket/
 │
 ├── prisma/
 │
 └── main.ts
```

---

# 🗄 Modelagem Prisma (MVP)

```ts
model User {
  id          String   @id @default(uuid())
  email       String   @unique
  name        String?
  picture     String?
  googleId    String   @unique
  createdAt   DateTime @default(now())
  notifications Notification[]
}

model Notification {
  id        String   @id @default(uuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  message   String
  read      Boolean  @default(false)
  createdAt DateTime @default(now())
}
```

---

# 🔑 Endpoint de Login

### `POST /auth/google`

Body:

```json
{
  "idToken": "google_id_token"
}
```

### Backend faz:

1. Verifica assinatura do token
2. Verifica audience
3. Verifica issuer
4. Extrai payload
5. Cria ou busca usuário
6. Emite JWT próprio

Resposta:

```json
{
  "accessToken": "jwt",
  "user": { ... }
}
```

---

# 🔌 WebSocket autenticado

Ao conectar:

```ts
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  // validar JWT
});
```

Associar `socket.id` ao `userId`.

---

# 🔔 Fluxo de Notificação (MVP)

`POST /notifications`

* Salva no banco
* Envia via WebSocket se usuário estiver online

---

# 🎯 Resultado do MVP

Você terá:

* OAuth2 real
* Validação de token profissional
* JWT próprio
* WebSocket autenticado
* Persistência
* Histórico

Isso já é um projeto plenamente apresentável.

---

---

# 🔥 FASE 2 — Evolução Sênior

Agora elevamos o nível arquitetural.

---

# 🧠 1️⃣ Separação de Camadas (Arquitetura limpa)

Aplicar:

* Application layer
* Domain layer
* Infrastructure layer

Separar:

```
notifications/
  ├── domain/
  ├── application/
  ├── infrastructure/
```

---

# 📡 2️⃣ Arquitetura Orientada a Eventos

Ao criar notificação:

```
NotificationCreatedEvent
        ↓
EventBus
        ↓
Handlers:
   - WebSocketHandler
   - EmailHandler
   - PushHandler
```

Inicialmente:

* EventEmitter2

Evolução:

* Redis Pub/Sub

---

# 📬 3️⃣ Multi-Canal

Adicionar:

* Email (Resend free)
* Push (Firebase free)

Criar:

```ts
model NotificationDelivery {
  id              String @id @default(uuid())
  notificationId  String
  channel         String
  status          String
  attempts        Int
  lastAttemptAt   DateTime?
}
```

Agora você tem rastreabilidade de entrega.

---

# 🔁 4️⃣ Retry com Backoff

Integrar BullMQ:

* Fila por canal
* Retry automático
* Dead letter queue

---

# 🧩 5️⃣ Preferências do Usuário

```ts
model NotificationPreference {
  userId    String @id
  email     Boolean @default(true)
  push      Boolean @default(true)
  websocket Boolean @default(true)
}
```

---

# 🛡 6️⃣ Segurança Avançada

* Refresh Token Rotation
* Blacklist de tokens
* Rate limiting
* Proteção contra replay
* Expiração curta de access token

---

# 📊 7️⃣ Observabilidade

Adicionar:

* Pino (logs estruturados)
* Endpoint `/health`
* Métricas simples
* Log de entrega por canal

---

# 📈 8️⃣ Escalabilidade Horizontal

Separar:

* API
* Worker

Arquitetura final:

```
API Instance 1
API Instance 2
        ↓
Redis
        ↓
Workers
        ↓
Channels
```

E usar:

* Redis Adapter do Socket.IO

---

# 🎓 Competências Demonstradas

Com essa versão evoluída você demonstra:

* OAuth2 / OpenID Connect
* Arquitetura orientada a eventos
* Resiliência
* Entrega multi-canal
* Escalabilidade horizontal
* Segurança moderna
* Modelagem consistente

Isso já posiciona como backend sênior em muitos contextos.

---

# 🗺 Roadmap sugerido

### Semana 1

* Login Google
* JWT
* WebSocket
* CRUD notificações
* Deploy

### Semana 2

* Event-driven interno
* Multi-canal
* Preferências

### Semana 3

* BullMQ + Retry
* Logs estruturados
* Métricas

### Semana 4

* Separação API / Worker
* Redis Adapter
* Documentação técnica robusta

---

# Próximos passos:

* [Desenhar diagrama completo de arquitetura](diagrama.md)
* [Definir requisitos não-funcionais (SLA, throughput, latência)](requisitos.md)
* [Estruturar backlog técnico detalhado](backlog.md)
* [Estruturar pastas profissionalmente](folder.md)
* [Criar README técnico modelo sênior](README.md)

# Informações adicionais

* [Como implementar Clean Architecture dentro do NestJS passo a passo](clean-arch.md)
