---
paths:
  - "**/*.{ts,js,go,java,py}"
---

# Data Pipelines Rules

Based on The Art of Software Testing, Microservices Patterns, Java Concurrency

---

## 1. Batch Processing Design

### Design Principles

| Principle | Description |
|-----------|-------------|
| Idempotency | Safe to retry |
| Recoverability | Resume from failure |
| Monitorability | Track progress |
| Traceability | Log inputs/outputs |
| Exactly-once | Process once (at-least-once with dedup) |

### Task Partitioning

| Strategy | Description |
|----------|-------------|
| Split large tasks | Reduce execution time |
| Paginate large data | Avoid OOM |
| Reasonable batch size | Balance throughput |
| Sharding | Parallel processing |

```typescript
// ✅ Good - Paginated processing
async function processLargeDataset(batchSize: number = 1000) {
  let offset = 0;

  while (true) {
    const records = await db.query(
      'SELECT * FROM orders WHERE processed = false LIMIT ? OFFSET ?',
      [batchSize, offset]
    );

    if (records.length === 0) break;

    await processBatch(records);
    await db.query('UPDATE orders SET processed = true WHERE id IN (?)',
      [records.map(r => r.id)]);

    offset += batchSize;
  }
}

// ❌ Bad - Load all at once
const allRecords = await db.query('SELECT * FROM orders');
```

### Batch Size Guidelines

| Factor | Small Batch | Large Batch |
|--------|-------------|-------------|
| Memory usage | Low | High |
| Latency | Higher | Lower |
| Throughput | Lower | Higher |
| Error recovery | Fast | Slow |
| Recommended for | High-value ops | Bulk processing |

---

## 2. Error Handling

### Retry Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| Immediate | Retry right away | Transient failures |
| Fixed delay | Wait X seconds | Non-urgent |
| Exponential backoff | Delay doubles | Rate limiting |
| Jitter | Random delay | Thundering herd |

### Retry Implementation

```typescript
// ✅ Good - Exponential backoff with jitter
async function processWithRetry(
  fn: () => Promise<void>,
  maxRetries: number = 3
) {
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await fn();
      return;
    } catch (error) {
      attempt++;
      const baseDelay = 1000;
      const maxDelay = 30000;
      const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
      const jitter = Math.random() * 1000;

      if (attempt === maxRetries) {
        await sendToDeadLetterQueue({ error, attempt });
        throw error;
      }

      await sleep(delay + jitter);
    }
  }
}
```

### Dead Letter Queue

| Pattern | Description |
|---------|-------------|
| Capture | Move failed messages to DLQ |
| Retain | Keep original message for analysis |
| Alert | Notify when messages enter DLQ |
| Retry | Periodic retry of DLQ messages |

```typescript
// ✅ Good - Dead letter queue pattern
async function processMessage(message: Message) {
  try {
    await process(message);
    await ack(message);
  } catch (error) {
    if (message.retryCount >= MAX_RETRIES) {
      await moveToDLQ(message, error);
      await ack(message);
      await alert(`DLQ: ${message.id} failed after ${MAX_RETRIES} retries`);
    } else {
      await requeue(message, { delay: calculateDelay(message.retryCount) });
    }
  }
}
```

### Error Handling Checklist

| Check | Description |
|-------|-------------|
| Log errors | Include stack trace and context |
| Preserve state | Save progress for resume |
| Limit retries | Prevent infinite loops |
| Alert on failures | Notify operations |
| Graceful degradation | Partial processing |

---

## 3. Scheduled Tasks

### Scheduling Strategies

| Strategy | Description |
|----------|-------------|
| Avoid overlap | Use distributed lock |
| Reasonable timing | Avoid peak hours |
| Distributed lock | Ensure uniqueness |
| Idempotent execution | Safe to run multiple times |

### Distributed Lock Pattern

```typescript
// ✅ Good - Distributed lock
@Scheduled(cron = "0 0 2 * * ?")
async function dailyReport() {
  const lock = await distributedLock.acquire('daily-report', 3600);

  if (!lock.acquired) {
    logger.info('Another instance running, skipping');
    return;
  }

  try {
    await generateDailyReport();
  } finally {
    await lock.release();
  }
}

// ❌ Bad - No lock, may run multiple times
async function dailyReport() {
  await generateDailyReport();  // Multiple instances may run
}
```

### Cron Expressions

| Schedule | Expression | Use Case |
|----------|------------|----------|
| Every minute | `0 * * * * ?` | High-frequency monitoring |
| Every hour | `0 0 * * * ?` | Statistics aggregation |
| Daily at 2am | `0 0 2 * * ?` | Reports, cleanup |
| Weekly Monday 3am | `0 0 3 ? * MON` | Backup, maintenance |
| Monthly 1st | `0 0 1 1 * ?` | Reports, archives |

### Monitoring Metrics

| Metric | Threshold | Action |
|--------|-----------|--------|
| Execution time | > 2x expected | Alert |
| Failure count | > 3 | Alert |
| Backlog | > 1000 items | Investigate |
| Success rate | < 95% | Alert |

---

## 4. Message Queues

### Queue Types

| Type | Use Case | Examples |
|------|----------|----------|
| Sync Queue | Wait for response | RPC |
| Async Queue | Decouple processing | Email, notifications |
| Delay Queue | Timed processing | Scheduled tasks |
| Priority Queue | Urgent processing | Alerts |
| Dead Letter Queue | Failed messages | Error handling |

### Producer Rules

| Rule | Level | Description |
|------|-------|-------------|
| Idempotent messages | MUST | Safe to resend |
| Persist messages | MUST | Prevent loss |
| Consistent format | MUST | Unified schema |
| Include trace ID | RECOMMENDED | For debugging |
| Set priority | REFERENCE | For urgency |

### Message Format

```typescript
// ✅ Good - Standardized message format
interface OrderCreatedEvent {
  eventId: string;        // UUID for idempotency
  eventType: 'OrderCreated';
  timestamp: string;      // ISO 8601
  version: string;        // Schema version
  payload: {
    orderId: string;
    userId: string;
    amount: number;
    currency: string;
  };
  metadata?: {
    correlationId: string;
    source: string;
  };
}

await messageBroker.publish('order.events', {
  eventId: uuid(),
  eventType: 'OrderCreated',
  timestamp: new Date().toISOString(),
  version: '1.0',
  payload: { orderId: order.id, userId: order.userId, amount: order.amount, currency: 'USD' }
});
```

### Consumer Rules

| Rule | Level | Description |
|------|-------|-------------|
| Idempotent processing | MUST | Repeated consumption doesn't matter |
| Retry with backoff | MUST | Exponential delay |
| Manual ACK | RECOMMENDED | Confirm when done |
| Control concurrency | MUST | Reasonable limits |
| Handle poison messages | MUST | Move to DLQ |

### Consumer Implementation

```typescript
// ✅ Good - Consumer with retry and DLQ
const consumer = messageBroker.subscribe('order.events', {
  concurrency: 5,
  retry: {
    maxAttempts: 3,
    backoff: 'exponential',
    initialDelay: 1000,
    maxDelay: 30000
  }
});

consumer.process(async (event: OrderCreatedEvent) => {
  const result = await orderService.confirm(event.payload.orderId);

  if (!result.success) {
    throw new Error(`Failed to confirm order ${event.payload.orderId}`);
  }

  return result;
});

consumer.on('error', async (error, event) => {
  logger.error('Failed to process event', { error, event });
  await moveToDLQ(event, error);
});
```

### Consumer Anti-Patterns

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| No idempotency | Duplicate processing | Idempotent operations |
| Sync processing | Blocked queue | Async processing |
| No concurrency | Low throughput | Batch processing |
| No error handling | Lost messages | Retry + DLQ |

---

## 5. Logging & Tracing

### Structured Logging

| Field | Description |
|-------|-------------|
| timestamp | ISO 8601 timestamp |
| level | DEBUG/INFO/WARN/ERROR |
| message | Human-readable message |
| context | Request/session identifiers |
| metadata | Additional structured data |

### Logging Best Practices

```typescript
// ✅ Good - Structured logging
logger.info('Batch job started', {
  jobId: 'daily-report-2024',
  startTime: new Date().toISOString(),
  params: { date: '2024-01-15' },
  correlationId: uuid()
});

logger.error('Batch job failed', {
  jobId: 'daily-report-2024',
  error: {
    message: error.message,
    code: error.code,
    stack: error.stack
  },
  processedCount: currentCount,
  failedCount: failedCount
});

logger.info('Batch job completed', {
  jobId: 'daily-report-2024',
  duration: durationMs,
  processedCount: successCount,
  failedCount: failedCount
});

// ❌ Bad - No structured data
logger.info('Job started');
logger.error('Job failed: ' + error.message);
```

### Tracing Fields

| Field | Description |
|-------|-------------|
| traceId | Unique trace ID across request |
| spanId | Current span identifier |
| parentId | Parent span identifier |
| source | Service name |
| operation | Operation name |

### Progress Logging

| Phase | Log Level | Content |
|-------|-----------|--------|
| Start | INFO | Job ID, parameters, start time |
| Progress | DEBUG | Batch number, processed count |
| Completion | INFO | Total processed, duration, errors |
| Failure | ERROR | Error details, partial progress |

---

## 6. Pipeline Patterns

### Pipeline Components

| Component | Description | Example |
|-----------|-------------|---------|
| Source | Data origin | Database, API, file |
| Filter | Transform/filter data | Validation, mapping |
| Router | Route data | Split by type |
| Buffer | Data buffer | Queue, cache |
| Sink | Data output | Database, file, API |

### Pipeline Implementation

```typescript
// ✅ Good - Pipeline pattern
interface PipelineConfig {
  source: () => Promise<SourceData[]>;
  filter: (item: SourceData) => boolean;
  transform: (item: SourceData) => TargetData;
  batchSize: number;
  sink: (batch: TargetData[]) => Promise<void>;
}

async function executePipeline(config: PipelineConfig) {
  const sourceData = await config.source();
  logger.info('Pipeline source completed', { count: sourceData.length });

  const filteredData = sourceData.filter(config.filter);
  logger.info('Pipeline filter completed', { filtered: filteredData.length });

  const batches = chunk(filteredData, config.batchSize);

  for (let i = 0; i < batches.length; i++) {
    const batch = batches[i];
    const transformed = batch.map(config.transform);
    await config.sink(transformed);
    logger.debug('Pipeline batch completed', {
      batch: i + 1,
      total: batches.length,
      count: batch.length
    });
  }

  logger.info('Pipeline completed', { total: filteredData.length });
}
```

### Error Recovery in Pipelines

| Strategy | Description |
|----------|-------------|
| Skip and continue | Log error, continue processing |
| Retry batch | Retry failed batch |
| Stop on error | Stop pipeline, alert |
| Partial success | Continue with valid items |

---

## 7. Concurrency

### Thread Safety

| Concern | Solution |
|---------|----------|
| Shared state | Immutable objects |
| Mutable state | Synchronization |
| Race conditions | Locks, atomic operations |
| Deadlocks | Lock ordering, timeouts |

### Java Concurrency Best Practices

```java
// ✅ Good - Thread-safe design
public class OrderProcessor {
    private final ConcurrentHashMap<String, Order> cache;
    private final ExecutorService executor;

    public OrderProcessor(int threadCount) {
        this.cache = new ConcurrentHashMap<>();
        this.executor = new ThreadPoolExecutor(
            threadCount,
            threadCount,
            0L, TimeUnit.MILLISECONDS,
            new LinkedBlockingQueue<>(1000),
            new ThreadFactoryBuilder().setNameFormat("order-%d").build(),
            new ThreadPoolExecutor.CallerRunsPolicy()
        );
    }

    public void processOrders(List<Order> orders) {
        orders.parallelStream()
            .filter(this::shouldProcess)
            .forEach(order -> executor.submit(() -> processOrder(order)));
    }
}

// ❌ Bad - Not thread-safe
public class UnsafeCache {
    private Map<String, Object> cache = new HashMap<>();  // Not thread-safe
}
```

### Concurrency Patterns

| Pattern | Use Case |
|---------|----------|
| Producer-Consumer | Work queue |
| Read-Write Lock | Read-heavy workloads |
| Semaphore | Rate limiting |
| CountDownLatch | Waiting for tasks |
| CompletableFuture | Async composition |

---

## Severity Levels

| Level | Description |
|-------|-------------|
| MUST | Will cause errors or issues if violated |
| RECOMMENDED | Improves quality and maintainability |
| REFERENCE | Adjust per project needs |