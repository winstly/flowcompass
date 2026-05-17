---
paths:
  - "**/*.{ts,js,go,java,py}"
---

# Code Quality Rules

Based on Refactoring, Clean Code, SOLID Principles, Building Maintainable Software

---

## 1. Refactoring Patterns

### When to Refactor

| Trigger | Description |
|---------|-------------|
| Adding features | Clean code before adding |
| Fixing bugs | Understand code before fixing |
| Code review | During review process |
| Regular review | Scheduled refactoring |

### Code Smells

| Smell | Description | Detection |
|-------|-------------|-----------|
| Duplicated Code | Same code in multiple places | Copy-paste pattern |
| Long Function | Function > 20 lines | Line count |
| Large Class | Too many responsibilities | Method count > 10 |
| Long Parameter List | Parameters > 3 | Parameter count |
| Shotgun Surgery | One change affects many classes | Ripple effect |
| Feature Envy | Method uses more data from other class | Data access pattern |
| Data Clumps | Same group of params appear together | Parameter grouping |
| Primitive Obsession | Using primitives instead of small objects | Type usage |
| Switch Statements | Repeated switch/case logic | Pattern detection |
| Parallel Inheritance | Parallel class hierarchies | Subclass pattern |

### Refactoring Techniques

| Category | Technique | When to Use |
|----------|------------|-------------|
| Extracting | Extract Function | Split long function |
| Extracting | Extract Variable | Name complex expression |
| Extracting | Inline Function | Inline trivial function |
| Moving | Move Function | Relocate to better class |
| Moving | Move Field | Relocate data member |
| Encapsulating | Encapsulate Variable | Make data private |
| Replacing | Replace Conditional with Polymorphism | Use inheritance |
| Replacing | Replace Type Code with Class | Enum substitution |
| Simplifying | Introduce Parameter Object | Group related params |
| Simplifying | Remove Dead Code | Unused code removal |

### Refactoring Process

```java
// 1. Identify the smell
// 2. Write tests first (ensure existing behavior)
// 3. Make small change
// 4. Run tests
// 5. Repeat

// ✅ Good - Small, safe refactoring steps
// Before: longMethod() with 100 lines
// After: Extract 3 sub-methods, each < 30 lines

// ❌ Bad - Big bang refactoring
// Before: longMethod()
// After: Completely rewritten method
```

---

## 2. SOLID Principles

### Single Responsibility Principle (SRP)

> A class should have only one reason to change.

| Check | Question |
|-------|----------|
| One purpose | Does class serve multiple unrelated features? |
| Single direction | Will changes come from one stakeholder/feature? |
| Single sentence | Can you describe the class in one sentence? |

```java
// ❌ Bad - Multiple responsibilities
class UserManager {
    void saveUser(User u) { ... }
    void sendEmail(User u) { ... }  // Email is separate concern
    void generateReport(User u) { ... }  // Reporting is separate
}

// ✅ Good - Single responsibility
class UserRepository { void saveUser(User u) { ... } }
class EmailService { void sendEmail(User u) { ... } }
class ReportGenerator { void generateReport(User u) { ... } }
```

### Open/Closed Principle (OCP)

> Software entities should be open for extension but closed for modification.

| Check | Question |
|-------|----------|
| Extension | Can new features be added without changing existing code? |
| Localization | Are changes localized to one area? |

```java
// ❌ Bad - Modify existing code
class DiscountCalculator {
    calculate(user, order) {
        if (type == "VIP") { ... }
        if (type == "REGULAR") { ... }
    }
}

// ✅ Good - Extend without modification
abstract class Discount {
    abstract calculate(order);
}
class VIPDiscount extends Discount { ... }
class RegularDiscount extends Discount { ... }
```

### Liskov Substitution Principle (LSP)

> Objects of a superclass should be replaceable with objects of subclass without affecting correctness.

| Check | Question |
|-------|----------|
| Contract fulfillment | Can subclass fulfill all parent contracts? |
| Invariants | Are class invariants maintained? |
| Postconditions | Are postconditions honored? |

```java
// ❌ Bad - Violates Liskov
class Rectangle {
    void setWidth(int w);
    void setHeight(int h);
}
class Square extends Rectangle {
    void setWidth(int w) { this.w = w; this.h = w; }  // Breaks Rectangle contract
}

// ✅ Good - Proper substitution
interface Shape {
    int calculateArea();
}
class Rectangle implements Shape { ... }
class Circle implements Shape { ... }
```

### Interface Segregation Principle (ISP)

> Clients should not be forced to depend on methods they do not use.

| Check | Question |
|-------|----------|
| Small interfaces | Are interfaces focused on single purpose? |
| Client needs | Do classes implement only needed methods? |
| Role-based | Can clients choose interfaces? |

```java
// ❌ Bad - Fat interface
interface Worker {
    void work();
    void eat();
    void sleep();
}

// ✅ Good - Segregated interfaces
interface Workable { void work(); }
interface Eatable { void eat(); }
class Robot implements Workable { ... }
class Human implements Workable, Eatable { ... }
```

### Dependency Inversion Principle (DIP)

> High-level modules should not depend on low-level modules. Both should depend on abstractions.

| Check | Question |
|-------|----------|
| Abstractions | Does code depend on abstractions? |
| Injectable | Are dependencies injectable? |
| Loose coupling | Are there loose couplings? |

```java
// ❌ Bad - Direct dependency
class OrderService {
    private MySQLDatabase db;  // Direct dependency
}

// ✅ Good - Dependency inversion
class OrderService {
    private Database database;  // Depends on abstraction
    OrderService(Database database) {
        this.database = database;
    }
}
```

---

## 3. Function Design

### Best Practices

| Rule | Level | Description |
|------|-------|-------------|
| Do one thing | MUST | Single responsibility |
| Small size | RECOMMENDED | < 20 lines |
| Few parameters | RECOMMENDED | Max 3 parameters |
| No side effects | RECOMMENDED | Same input = same output |
| Descriptive name | MUST | Verb phrase |

### Parameter Patterns

```java
// ❌ Bad - Too many parameters
function createUser(name, email, age, role, city, country, phone) {}

// ✅ Good - Options object
function createUser({ name, email, age, role, city, country, phone }) {}

// ✅ Good - Builder pattern
function createUser()
    .withName(name)
    .withEmail(email)
    .build();
```

### Function Length Guidelines

| Length | Category | Action |
|--------|----------|--------|
| 0-10 lines | Ideal | Perfect |
| 11-20 lines | Acceptable | Consider splitting |
| 21-50 lines | Review | May need refactoring |
| 50+ lines | Problem | Must refactor |

---

## 4. Class Design

### Cohesion

| Check | Question |
|-------|----------|
| Related methods | Are related methods grouped together? |
| Focused | Is the class focused on single responsibility? |
| Field usage | Are fields used by most methods? |

### Coupling Types

| Type | Severity | Description |
|------|----------|-------------|
| Content coupling | Worst | Modifies another class's internal data |
| Common coupling | Bad | Shares global data |
| External coupling | Bad | Shares external resources |
| Stamp coupling | Moderate | Passes composite data unnecessarily |
| Data coupling | Best | Passes primitive parameters |
| Message coupling | Best | Communicates via messages only |

### Class Size Guidelines

| Metric | Guideline |
|--------|-----------|
| Methods per class | < 20 |
| Fields per class | < 10 |
| Lines per class | < 300 |
| Children inheritance depth | < 5 |

---

## 5. Error Handling

### Best Practices

| Rule | Level | Description |
|------|-------|-------------|
| Use exceptions for exceptional cases | RECOMMENDED | |
| Don't return null | RECOMMENDED | Return empty collection |
| Don't pass null | RECOMMENDED | Null causes NPE |
| Fail fast | RECOMMENDED | Validate early |
| Log and rethrow | RECOMMENDED | Preserve stack trace |
| Specific exceptions | MUST | |

```java
// ❌ Bad - Returns null
User findUser(String id) {
    return users.get(id) || null;
}

// ✅ Good - Returns empty or throws
User findUser(String id) {
    User user = users.get(id);
    if (!user) throw new UserNotFoundException(id);
    return user;
}

// ✅ Good - Empty collection
List<User> findUsersByRole(String role) {
    return users.values().stream()
        .filter(u -> u.getRole().equals(role))
        .collect(Collectors.toList());  // Empty list, not null
}
```

### Exception Hierarchy

```
Throwable
├── Error (system errors - don't catch)
│   ├── OutOfMemoryError
│   └── StackOverflowError
└── Exception
    ├── RuntimeException (unchecked)
    │   ├── IllegalArgumentException
    │   ├── NullPointerException
    │   └── BusinessException
    └── IOException (checked)
```

### Exception Design Rules

| Rule | Level | Description |
|------|-------|-------------|
| Create specific exceptions | MUST | |
| Include error context | MUST | |
| Log before throwing | RECOMMENDED | |
| Don't swallow exceptions | MUST | |
| Clean up resources | MUST | Use try-finally or try-with-resources |

---

## 6. Naming Conventions

### General Rules

| Rule | Level | Description |
|------|-------|-------------|
| Intent-revealing names | MUST | Name reveals intent |
| No single letters (except counters) | RECOMMENDED | Except i, j for loops |
| No abbreviations | REFERENCE | Except widely accepted ones |
| No Hungarian notation | RECOMMENDED | Modern IDEs provide types |
| Consistent naming | MUST | Same pattern throughout |

### Java/Kotlin Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `UserService` |
| Methods | camelCase | `getUserById` |
| Variables | camelCase | `userName` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| Enum values | UPPER_SNAKE | `VIP_MEMBER` |
| Boolean | is/has/can prefix | `isActive` |

### Python Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `UserService` |
| Functions | snake_case | `get_user_by_id` |
| Variables | snake_case | `user_name` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| Boolean | is/has/can prefix | `is_active` |

### JavaScript/TypeScript Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Classes | PascalCase | `UserService` |
| Functions/variables | camelCase | `getUserById` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT` |
| Components (React) | PascalCase | `UserProfile` |
| Files | kebab-case | `user-profile.ts` |

---

## 7. Comments

### When to Comment

| Type | Use | Example |
|------|-----|---------|
| Why | Intent explanation | `// Retry 3x per spec` |
| Contracts | Pre/post conditions | `// Pre: array sorted` |
| Performance | Optimization notes | `// O(n) for large n` |
| Complex algorithms | Algorithm explanation | `// Binary search` |
| API docs | Public interfaces | JSDoc/Javadoc |

### When NOT to Comment

| Type | Why | Solution |
|------|-----|----------|
| What | Code already shows | Clean code |
| Obvious | Readable anyway | Delete |
| Obsolete | Misleading | Remove |
| TODO (permanent) | Technical debt | Fix or track |

### Comment Style

```java
// ✅ Good - Explains WHY, not WHAT
// Using binary search per sorted array assumption
int index = binarySearch(items, target);

// ❌ Bad - Explains WHAT (obvious)
// Loop through items
for (Item item : items) { ... }
```

---

## 8. Clean Code Principles

### General Guidelines

| Principle | Description |
|-----------|-------------|
| Keep it simple | Simple is better than complex |
| Keep it readable | Code is read more than written |
| Keep it testable | Testable code is good code |
| Keep it small | Small units are easier to understand |
| Keep it focused | Single responsibility |

### Code Organization

| Layer | Responsibility |
|-------|----------------|
| Presentation | UI, user interaction |
| Application | Use cases, orchestration |
| Domain | Business rules, entities |
| Infrastructure | DB, external services |

### DRY (Don't Repeat Yourself)

```java
// ❌ Bad - Duplicated logic
void processVIP(Order o) {
    double discount = o.getAmount() * 0.2;
    o.applyDiscount(discount);
    notifyUser(o.getUser());
}
void processRegular(Order o) {
    double discount = o.getAmount() * 0.1;
    o.applyDiscount(discount);
    notifyUser(o.getUser());
}

// ✅ Good - DRY
void process(Order o, double rate) {
    double discount = o.getAmount() * rate;
    o.applyDiscount(discount);
    notifyUser(o.getUser());
}
```

### YAGNI (You Aren't Gonna Need It)

| Avoid | Why |
|-------|-----|
| Speculative features | Wasted effort |
| Unused abstraction | Complexity |
| Future-proofing | Usually wrong |
| Gold plating | Scope creep |

---

## Severity Levels

| Level | Description |
|-------|-------------|
| MUST | Will cause errors or issues if violated |
| RECOMMENDED | Improves quality and maintainability |
| REFERENCE | Adjust per project needs |