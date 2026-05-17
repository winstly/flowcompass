---
paths:
  - "**/*.{ts,js,go,java,py}"
---

# Backend API Development Rules

Based on Alibaba Java Specification, Java Concurrency, Microservices Patterns, Refactoring

---

## 1. Naming Conventions

### Java/Kotlin

| Rule | Level | Description |
|------|-------|-------------|
| No underscores/dollar signs at start/end | MUST | |
| No pinyin mixed with English | MUST | |
| Classes: UpperCamelCase | MUST | |
| Methods/variables: lowerCamelCase | MUST | |
| Constants: UPPER_SNAKE | MUST | |
| Abstract classes: Abstract/Base prefix | MUST | |
| Exception classes: Exception suffix | MUST | |
| Enums: PascalCase with DESC suffix for string values | MUST | |

### Python

| Rule | Level | Description |
|------|-------|-------------|
| Modules: lowercase | MUST | |
| Classes: PascalCase | MUST | |
| Functions/variables: snake_case | MUST | |
| Constants: UPPER_SNAKE | MUST | |

### Go

| Rule | Level | Description |
|------|-------|-------------|
| Files: lowercase snake_case | MUST | |
| Types/Interfaces: PascalCase | MUST | |
| Functions: PascalCase (exported) | MUST | |
| Variables: camelCase | RECOMMENDED | |

---

## 2. API Design

### RESTful Conventions

| Rule | Level | Description |
|------|-------|-------------|
| Use standard HTTP methods | MUST | GET/POST/PUT/DELETE/PATCH |
| URL uses plural nouns | MUST | `/users`, `/orders` |
| Use kebab-case | RECOMMENDED | `/user-profiles` |
| Use sub-resources for relations | RECOMMENDED | `/users/{id}/orders` |
| Versioning | RECOMMENDED | `/api/v1/users` |
| No verbs in URLs | MUST | Use HTTP methods instead |

### Request/Response Format

```json
// Success response
{
  "code": 200,
  "message": "success",
  "data": {}
}

// Paginated response
{
  "code": 200,
  "message": "success",
  "data": {
    "list": [],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 100
    }
  }
}

// Error response
{
  "code": 400,
  "message": "Invalid parameter",
  "data": null
}
```

### Validation

| Rule | Level | Description |
|------|-------|-------------|
| Required field validation | MUST | |
| String length validation | MUST | |
| Number range validation | MUST | |
| Date format validation | MUST | |
| Enum value validation | MUST | |
| Format validation (email, URL, phone) | RECOMMENDED | |

### Error Codes

| Range | Usage |
|-------|-------|
| 1000-1999 | Parameter errors |
| 2000-2999 | Business errors |
| 3000-3999 | System errors |
| 4000-4999 | Third-party errors |

### API Documentation

| Rule | Level | Description |
|------|-------|-------------|
| Use OpenAPI/Swagger | RECOMMENDED | |
| Document all endpoints | MUST | |
| Document error codes | MUST | |
| Provide request/response examples | RECOMMENDED | |

---

## 3. Java Specific

### Collections

| Rule | Level | Description |
|------|-------|-------------|
| No remove/add in foreach loop | MUST | Use Iterator |
| Use isEmpty() not size() == 0 | RECOMMENDED | |
| Prefer JDK 8+ Stream API | RECOMMENDED | |
| PECS: Producer Extends, Consumer Super | MUST | |
| Return empty collections, not null | MUST | |

### Concurrency

| Rule | Level | Description |
|------|-------|-------------|
| Thread safety for shared resources | MUST | |
| Use thread pools, not new Thread | MUST | |
| Watch for deadlock risks | MUST | |
| Volatile for simple flags | RECOMMENDED | |
| Use concurrent collections | RECOMMENDED | ConcurrentHashMap, etc. |
| Immutable objects for shared state | RECOMMENDED | |
| Avoid synchronized(this) | MUST | Use lock objects |

### Thread Pool

```java
// ✅ Good
ExecutorService executor = new ThreadPoolExecutor(
    corePoolSize,
    maxPoolSize,
    keepAliveTime,
    TimeUnit.SECONDS,
    new LinkedBlockingQueue<>(capacity),
    new ThreadFactoryBuilder().setNameFormat("pool-%d").build(),
    new ThreadPoolExecutor.CallerRunsPolicy()
);

// ❌ Bad
new Thread(new RunnableTask()).start();
```

### Functional Programming

| Rule | Level | Description |
|------|-------|-------------|
| Prefer immutable operations | RECOMMENDED | |
| Use Optional instead of null | RECOMMENDED | |
| Method references over lambdas for complex logic | REFERENCE | |
| Avoid side effects in streams | RECOMMENDED | |

---

## 4. Database

### Table Design

| Rule | Level | Description |
|------|-------|-------------|
| Table/column names: lowercase | MUST | |
| Table names: singular | RECOMMENDED | `user` not `users` |
| Primary key: id | MUST | |
| Index naming: idx_column | RECOMMENDED | |
| Use UUID or snowflake for distributed IDs | RECOMMENDED | |
| Created/updated timestamps | RECOMMENDED | |

### SQL

| Rule | Level | Description |
|------|-------|-------------|
| Use parameterized queries | MUST | Prevent SQL injection |
| No SELECT * | MUST | Specify columns |
| UPDATE/DELETE must have WHERE | MUST | |
| Avoid large transactions | RECOMMENDED | |
| Batch operations for bulk data | RECOMMENDED | |
| Use transactions appropriately | MUST | |

---

## 5. Security

| Rule | Level | Description |
|------|-------|-------------|
| Hide error details from client | MUST | |
| Strict input validation | MUST | |
| SQL injection prevention | MUST | Parameterized queries |
| XSS prevention | MUST | Output encoding |
| CSRF protection | MUST | Token validation |
| Encrypt sensitive data | MUST | |
| API idempotency | RECOMMENDED | |
| Rate limiting | RECOMMENDED | |
| Authentication for all endpoints | MUST | |

---

## 6. Microservices

### Service Design

| Principle | Description |
|-----------|-------------|
| Single Responsibility | Each service does one thing |
| Domain-Driven | Split by business boundaries |
| Low Coupling | Minimize dependencies |
| Database per Service | No shared databases |
| Configuration externalized | MUST | |

### Service Communication

| Method | Use Case |
|--------|----------|
| REST (sync) | Request-response, simple scenarios |
| gRPC (sync) | High performance, type-safe |
| Message Queue (async) | Event-driven, decoupling |
| Event Streaming | High throughput, real-time |

### API Gateway

| Feature | Description |
|---------|-------------|
| Unified entry point | Single endpoint for all services |
| Authentication | Token validation, OAuth |
| Authorization | Role-based access control |
| Route forwarding | Dynamic routing to services |
| Rate limiting | Prevent abuse |
| Circuit breaker | Fault tolerance |
| Logging | Request/response logging |

### Service Discovery

| Pattern | Description |
|--------|-------------|
| Client-side discovery | Client queries registry |
| Server-side discovery | Load balancer queries registry |
| Health checks | Register/unregister services |
| Circuit breaker | Prevent cascade failures |

### Saga Pattern

| Approach | Description |
|----------|-------------|
| Choreography | Services emit/listen events |
| Orchestration | Central coordinator manages |
| Compensation | Define rollback actions |

---

## 7. Error Handling

### Exception Design

| Rule | Level | Description |
|------|-------|-------------|
| Throw specific exceptions | MUST | |
| Don't swallow exceptions | MUST | |
| Log and rethrow | RECOMMENDED | |
| Use custom exceptions for business errors | RECOMMENDED | |
| Include error context | MUST | |

```java
// ✅ Good
try {
    doSomething();
} catch (SpecificException e) {
    logger.error("Failed to do something", e);
    throw new BusinessException("ERROR_CODE", "Human readable message", e);
}

// ❌ Bad
try {
    doSomething();
} catch (Exception e) {
    // Swallowed
}
```

### Error Response

| Rule | Level | Description |
|------|-------|-------------|
| Consistent error format | MUST | |
| Include error code | MUST | |
| Include human-readable message | MUST | |
| Include request ID for tracing | RECOMMENDED | |
| Don't expose stack traces | MUST | |

---

## Severity Levels

| Level | Description |
|-------|-------------|
| MUST | Will cause errors or issues if violated |
| RECOMMENDED | Improves quality and maintainability |
| REFERENCE | Adjust per project needs |