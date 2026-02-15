# Real-Time Notification System

[![pt-br](https://img.shields.io/badge/lang-pt--br-green.svg)](./docs/README.pt-br.md)
[![NestJS](https://img.shields.io/badge/NestJS-11.x-E0234E?logo=nestjs)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)](https://www.prisma.io/)
[![Swagger](https://img.shields.io/badge/Swagger-API%20Docs-85EA2D?logo=swagger)](https://real-time-notification-system-nl.up.railway.app/api)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Real-time notification system with Google OAuth2 authentication, event-driven architecture, asynchronous processing, and multi-channel delivery.

## Features

- **Google OAuth2 Authentication**: Secure user authentication using Google accounts
- **Real-Time Notifications**: WebSocket-based instant notification delivery via Socket.IO
- **RESTful API**: Complete REST API for notification management
- **Event-Driven Architecture**: Scalable notification processing
- **Swagger Documentation**: Interactive API documentation
- **Database**: PostgreSQL with Prisma ORM (v7.x with driver adapters)
- **Logging**: Structured logging with Pino

## Tech Stack

- **Framework**: NestJS 11.x
- **Database**: PostgreSQL with Prisma 7.x
- **Authentication**: Passport JWT + Google OAuth2
- **WebSocket**: Socket.IO 4.x
- **Documentation**: Swagger/OpenAPI
- **Logging**: nestjs-pino + pino-pretty

## Prerequisites

- Node.js 18+
- PostgreSQL
- Google Cloud Console account (for OAuth2 credentials)

## Installation

```bash
npm install
```

## Environment Setup

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/notifications"
JWT_SECRET="your-secret-key"
GOOGLE_CLIENT_ID="your-google-client-id"
PORT=5001
```

## Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

## Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

The application will be available at `http://localhost:5001`

## API Documentation

Access Swagger documentation at:
```
http://localhost:5001/api
```

## Live Demo

Test the application at: https://notification-app-nl.vercel.app/

## Testing Guide

For detailed testing instructions using Postman, see:
- [Testing Guide (English)](./docs/testing-guide.md)
- [Guia de Testes (Português)](./docs/guia_testes.md)

## Project Structure

```
src/
├── auth/              # Authentication module (Google OAuth2, JWT)
├── notifications/     # Notifications module (REST + WebSocket)
├── users/            # User management
├── prisma/           # Prisma service and configuration
└── main.ts           # Application entry point
```

## API Endpoints

### Authentication
- `POST /auth/google` - Authenticate with Google ID token

### Notifications
- `POST /notifications` - Create and send notification (requires Bearer token)

### WebSocket Events
- Event: `notification` - Real-time notification delivery

## ⚠️ Note about Free Environment
This project is hosted on a free infrastructure plan.
For this reason:
- The application may go into sleep mode after a period of inactivity.
- The first request after this period may experience additional latency (cold start).
- The worker may start with a delay if it is also suspended.
- This behavior is expected in the free plan and does not represent a failure in the application.
> In a production environment with a dedicated instance, this behavior does not occur.