**Estrutura de pastas nível sênior**

Baseada em:

* Clean Architecture
* Separação clara de responsabilidades
* Independência entre domínio e infraestrutura
* Preparada para API + Worker
* Escalável para multi-canal

Vou estruturar pensando em **monorepo simples**, mas pode ser adaptado.

---

# 📦 Estrutura Geral do Projeto

```
notification-system/
│
├── apps/
│   ├── api/
│   └── worker/
│
├── packages/
│   ├── domain/
│   ├── application/
│   └── infrastructure/
│
├── prisma/
│
├── docker/
│
├── .github/
│
├── docker-compose.yml
├── package.json
└── tsconfig.base.json
```

Isso separa:

* API → interface externa
* Worker → processamento assíncrono
* Domain → regras de negócio puras
* Application → casos de uso
* Infrastructure → implementações técnicas

Isso é mentalidade enterprise.

---

# 🔹 apps/api

```
apps/api/src/
│
├── main.ts
├── app.module.ts
│
├── modules/
│   ├── auth/
│   ├── notifications/
│   ├── users/
│   └── preferences/
│
├── gateways/
│   └── websocket.gateway.ts
│
├── config/
│
└── shared/
    ├── guards/
    ├── interceptors/
    └── decorators/
```

API contém apenas:

* Controllers
* Gateways
* Guards
* DTOs
* Config

Não contém regra de negócio pesada.

---

# 🔹 apps/worker

```
apps/worker/src/
│
├── main.ts
│
├── processors/
│   ├── email.processor.ts
│   ├── push.processor.ts
│   └── webhook.processor.ts
│
├── queues/
│   └── notification.queue.ts
│
└── config/
```

Worker só processa filas.
Não expõe HTTP.

---

# 🔹 packages/domain

Camada mais importante.

Não depende de NestJS.
Não depende de Prisma.
Não depende de Redis.

```
packages/domain/src/
│
├── entities/
│   ├── user.entity.ts
│   ├── notification.entity.ts
│   └── delivery.entity.ts
│
├── events/
│   └── notification-created.event.ts
│
├── enums/
│   ├── notification-channel.enum.ts
│   └── delivery-status.enum.ts
│
└── value-objects/
    └── email.vo.ts
```

Aqui ficam:

* Entidades puras
* Eventos de domínio
* Enums
* Regras centrais

Zero dependência externa.

---

# 🔹 packages/application

Casos de uso.

```
packages/application/src/
│
├── use-cases/
│   ├── create-notification.usecase.ts
│   ├── mark-as-read.usecase.ts
│   ├── login-with-google.usecase.ts
│   └── update-preferences.usecase.ts
│
├── ports/
│   ├── notification.repository.ts
│   ├── user.repository.ts
│   ├── event-bus.port.ts
│   └── email.service.port.ts
│
└── dto/
```

Aqui você define:

* Interfaces (ports)
* Casos de uso
* Orquestração

Application depende de Domain.
Nunca depende de Prisma ou Redis diretamente.

---

# 🔹 packages/infrastructure

Implementações concretas.

```
packages/infrastructure/src/
│
├── prisma/
│   ├── prisma.service.ts
│   ├── user.repository.impl.ts
│   └── notification.repository.impl.ts
│
├── redis/
│   ├── redis.service.ts
│   └── redis-event-bus.impl.ts
│
├── email/
│   └── resend-email.service.ts
│
├── push/
│   └── firebase-push.service.ts
│
├── queue/
│   └── bullmq.service.ts
│
└── auth/
    └── google-token-validator.service.ts
```

Aqui ficam:

* Prisma
* Redis
* BullMQ
* Integrações externas
* Google validator

Infrastructure implementa interfaces definidas na Application.

---

# 🔥 Dependência Entre Camadas

Regra de ouro:

```
Domain ← Application ← Infrastructure
           ↑
          API
```

API depende de Application.
Application depende de Domain.
Infrastructure implementa Application Ports.
Domain não depende de nada.

---

# 📁 Prisma

```
prisma/
├── schema.prisma
└── migrations/
```

---

# 📁 Configuração de Ambientes

```
apps/api/.env
apps/worker/.env
```

---

# 🧠 Como o fluxo funciona nessa estrutura

## Criar notificação

1. Controller chama `CreateNotificationUseCase`
2. UseCase:

   * Salva via `NotificationRepository`
   * Publica evento via `EventBus`
3. EventBus (Redis impl)
4. Worker consome evento
5. Worker chama EmailService

Limpo, desacoplado, testável.

---

# 🧪 Testabilidade

Você consegue testar:

* UseCases isoladamente
* Sem banco
* Sem Redis
* Mockando apenas ports

Isso é arquitetura madura.

---

# 🎯 Se quiser simplificar (versão intermediária)

Se monorepo for complexo, você pode usar:

```
src/
 ├── domain/
 ├── application/
 ├── infrastructure/
 ├── modules/
 ├── gateways/
```

Ainda é clean architecture, mas dentro de um único app.

---

# 📌 Nível que isso demonstra

Essa estrutura mostra:

* Entendimento de DDD
* Separação de responsabilidades
* Inversão de dependência
* Arquitetura orientada a eventos
* Escalabilidade

---
