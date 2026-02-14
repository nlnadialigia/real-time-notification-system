**Requisitos Não-Funcionais (RNFs)**

---

# 📌 1. Escopo do Sistema

Sistema responsável por:

* Autenticação via Google OAuth2
* Emissão de JWT próprio
* Criação de notificações
* Entrega em tempo real (WebSocket)
* Entrega assíncrona multi-canal (email, push, webhook)
* Rastreamento de status de entrega

---

# 🚦 2. Performance

## 🎯 2.1 Latência

### REST API

* P95 ≤ 200ms
* P99 ≤ 400ms

### WebSocket

* Entrega em tempo real ≤ 150ms (in-memory / Redis adapter)

### Processamento assíncrono

* Primeira tentativa de envio ≤ 1s após criação

---

## 🎯 2.2 Throughput

MVP (Free tier):

* 50–100 req/s
* 1.000 notificações/dia
* 200 conexões WebSocket simultâneas

Versão evoluída:

* 500+ req/s
* 10k+ notificações/dia
* Escalável horizontalmente

---

# 📈 3. Escalabilidade

## 3.1 Horizontal

* API stateless
* JWT sem sessão em memória
* Redis para Pub/Sub
* Worker separado

## 3.2 Vertical

* CPU bound apenas em picos de serialização
* I/O bound na maior parte

---

# 🔒 4. Segurança

## 4.1 Autenticação

* Google OAuth2 (ID Token validation)
* JWT próprio com expiração curta (15 min)
* Refresh Token (fase 2)

## 4.2 Autorização

* Acesso apenas a notificações próprias
* Guards no NestJS
* Validação de ownership

## 4.3 Proteções adicionais

* Rate limiting (ex: 100 req/min por usuário)
* Helmet
* CORS restrito
* Validação com Zod ou class-validator
* Sanitização de inputs

---

# 🔐 5. Integridade de Dados

* Todas notificações persistidas antes de envio
* Controle de status por canal
* Retry com limite máximo (ex: 5 tentativas)
* Idempotência opcional via externalId

---

# 📦 6. Disponibilidade

## MVP (free tier)

* 95–98% uptime (cold starts possíveis)

## Versão evoluída

* ≥ 99.5% uptime
* Redis com failover
* Deploy com múltiplas instâncias

---

# 🔁 7. Consistência

Modelo adotado:

* Consistência forte para persistência
* Consistência eventual para entrega multi-canal

Justificativa:
Entrega pode falhar e ser reprocessada.

---

# 🧠 8. Resiliência

* Retry com backoff exponencial
* Dead letter queue
* Timeout por canal
* Circuit breaker opcional

---

# 📊 9. Observabilidade

## Logs

* Estruturados (JSON)
* correlationId por requisição
* rastreabilidade de entrega

## Métricas

* Notificações criadas
* Entregas por canal
* Falhas por canal
* Tempo médio de entrega
* Conexões WebSocket ativas

## Endpoints

* `/health`
* `/metrics` (fase evoluída)

---

# 🧪 10. Testabilidade

* Testes unitários (services)
* Testes de integração (auth + notifications)
* Mock de Google token validation
* Mock de Redis

Cobertura alvo:

* ≥ 70% MVP
* ≥ 85% versão evoluída

---

# 🧩 11. Manutenibilidade

* Separação por módulos
* Clean Architecture
* Inversão de dependência
* Domain events
* Tipagem forte (TypeScript strict)

---

# 🚀 12. Deploy & CI/CD

* Docker multi-stage
* Variáveis de ambiente seguras
* GitHub Actions
* Build + lint + test
* Migração automática Prisma

---

# 🗄 13. Limites Técnicos (Free Tier)

Documentar no README:

* Redis limitado a X req/mês
* Email limitado a Y/dia
* Cold start possível

Isso demonstra consciência arquitetural.

---

# 📌 14. SLA Interno (Projeto)

Você pode declarar no README:

* Entrega WebSocket: < 200ms P95
* Processamento async: < 2s P95
* Falhas tratadas com retry automático
* Nenhuma notificação perdida após persistência

---

# 🎯 Resultado

Com esses RNFs definidos, seu projeto passa de:

"Uma API funcional"

para:

"Um sistema distribuído com requisitos de engenharia definidos"

Isso é mentalidade sênior.

---
