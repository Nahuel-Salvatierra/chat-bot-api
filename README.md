# Chat Bot API

## Descripción

Esta es una API de chat simple construida con **NestJS** siguiendo una **arquitectura hexagonal** (Clean Architecture). La aplicación permite enviar mensajes y recibir respuestas automáticas al estilo ChatGPT, integrando OpenAI en producción y un servicio mockeado en desarrollo para evitar consumo de la API real.

## Características principales

- **Arquitectura hexagonal**: separación clara entre dominio, aplicación, infraestructura e interfaces.
- **Validación de tokens con Firebase**: todos los endpoints protegidos requieren autenticación mediante Firebase.
- **Respuestas tipo ChatGPT**: la lógica de negocio responde mensajes directos simulando un chat.
- **OpenAI solo en producción**: en desarrollo se utiliza un servicio de IA mockeado para evitar costos y consumo de la API real.
- **Configuración por entorno**: el servicio de IA se decide según la variable `NODE_ENV` (`production` usa OpenAI real, cualquier otro valor usa el mock).
- **Validaciones robustas**: los mensajes se validan usando class-validator.
- **Comandos centralizados en Makefile**: los comandos principales de la app se ejecutan a través del Makefile.

## Comandos útiles

La aplicación utiliza un **Makefile** para facilitar los comandos más comunes:

```sh
make test      # Ejecuta los tests
make up-dev    # Levanta la app en modo desarrollo (hot reload)
make up-prod   # Levanta la app en modo producción usando Docker Compose
```

> **Nota:** El Makefile ejecuta los scripts definidos en `package.json` y docker-compose.

## Entornos y configuración

- **Desarrollo**: por defecto, el servicio de IA está mockeado y no consume la API de OpenAI.
- **Producción**: para usar OpenAI real, asegurate de tener `NODE_ENV=production` en tu archivo `.env`.

Ejemplo de `.env` para producción: 
```

## Estructura de carpetas (Arquitectura Hexagonal)

📁 src/
├── 📁 modules/
│   ├── 📁 message/                    # 🎯 Módulo principal de mensajes
│   │   ├── 📁 domain/                 # 🏗️ Entidades y lógica de dominio
│   │   │   └── 📄 message.entity.ts
│   │   ├── 📁 application/            # ⚙️ Casos de uso e interfaces
│   │   │   ├── 📁 dto/
│   │   │   │   └── 📄 create-message.dto.ts
│   │   │   ├── 📁 services/
│   │   │   │   └── 📄 ai.service.interface.ts
│   │   │   └── 📁 repositories/
│   │   │       └── 📄 message.repository.interface.ts
│   │   ├── 📁 infrastructure/         # 🔧 Implementaciones concretas
│   │   │   ├── 📁 persistence/
│   │   │   │   └── 📄 firebase-message.repository.ts
│   │   └── 📁 interface/              # 🌐 Controladores
│   │       ├── 📁 controllers/
│   │       │   └── 📄 message.controller.ts
│   │       └── 📁 __tests__/
│   │           └── 📄 message.e2e.spec.ts
│   └── 📁 iam/                        # 🔐 Autenticación y autorización
└── 📁 configuration/                  # ⚙️ Configuración global
```

## Nomenclatura recomendada

- **Archivos:**  
  - `kebab-case` para archivos: `create-message.use-case.ts`
  - Sufijos por tipo:
    - `.entity.ts` - Entidades de dominio
    - `.vo.ts` - Value Objects
    - `.interface.ts` - Interfaces
    - `.dto.ts` - Data Transfer Objects
    - `.use-case.ts` - Casos de uso
    - `.repository.ts` - Repositorios
    - `.service.ts` - Servicios
    - `.controller.ts` - Controladores
    - `.spec.ts` - Tests unitarios
    - `.e2e.spec.ts` - Tests de integración

- **Clases:**  
  - `PascalCase` para clases: `CreateMessageUseCase`
- **Métodos y variables:**  
  - `camelCase`: `createMessage()`, `userId`

- **Carpetas:**  
  - `kebab-case`: `use-cases/`, `repositories/`, `controllers/`
  - Agrupadas por responsabilidad

- **Consistencia:**  
  - Mantener la misma convención en todo el proyecto.

## Seguridad

- Todos los endpoints requieren autenticación con token de Firebase.
- Los tokens se validan usando el SDK de Firebase Admin.

## Lógica de negocio

- Cada mensaje enviado es respondido automáticamente por la IA (mock o OpenAI según entorno).
- El flujo es similar a un chat directo tipo ChatGPT.

---
