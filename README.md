# Festive Project - Event Management Platform

## Overview
A scalable, microservices-based event management platform for event planners. Built with Node.js, TypeScript, Express, PostgreSQL, and Docker.

## Architecture
- **Microservices**: Auth, Event, Vendor, Invoice, API Gateway
- **Database**: PostgreSQL
- **Containerization**: Docker Compose
- **Shared Libraries**: For common types and utilities

## Services
- **api-gateway**: Entry point, routing, authentication
- **auth**: User registration, login (Google SSO & email), roles, permissions
- **event**: Event creation, analytics, schedules, attachments
- **vendor**: Vendor management, deliverables
- **invoice**: Invoice management

## Getting Started
1. Clone the repo
2. Run `docker-compose up --build`
3. Each service will be available on its respective port (see `docker-compose.yml`)

## Tech Stack
- Node.js + Express (TypeScript)
- PostgreSQL
- Docker
- Passport.js (Google SSO, JWT)
- Prisma/TypeORM (ORM)
- Jest (Testing)

## Development
- Each service is in `services/<service-name>`
- Shared code in `libs/common`

## License
MIT 