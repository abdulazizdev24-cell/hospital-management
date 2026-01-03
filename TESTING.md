# Testing Guide

This document provides information about testing in the Hospital Management System.

## Test Setup

The project uses [Jest](https://jestjs.io/) as the testing framework, configured for Next.js.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Structure

Tests are organized in the `__tests__` directory:

```
__tests__/
├── lib/              # Unit tests for utility functions
│   ├── validation.test.js
│   ├── response.test.js
│   └── pagination.test.js
└── api/              # Integration tests for API routes
    ├── auth/
    │   └── register.test.js
    └── patients.test.js
```

## Writing Tests

### Unit Tests

Unit tests are for testing individual utility functions and modules in isolation.

Example:
```javascript
import { validateEmail } from "@/lib/validation";

describe("validateEmail", () => {
  test("should return true for valid email", () => {
    expect(validateEmail("test@example.com").valid).toBe(true);
  });
});
```

### Integration Tests

Integration tests are for testing API routes and their interactions with the database.

Example:
```javascript
import { POST } from "@/app/api/auth/register/route";

describe("POST /api/auth/register", () => {
  test("should register a new user", async () => {
    // Test implementation
  });
});
```

## Test Coverage

The project aims for good test coverage of:
- Utility functions (validation, response helpers, pagination)
- API route handlers
- Authentication middleware
- Database models

## Mocking

When testing API routes, we mock:
- Database connections (`@/lib/db`)
- Models (`@/models/*`)
- Authentication middleware (`@/lib/middleware`)

## Environment Variables

Test environment variables are set in `jest.setup.js`. Make sure to use test-specific values:
- `JWT_SECRET`: Test JWT secret
- `MONGODB_URI`: Test database URI
- `NODE_ENV`: Set to "test"

## Best Practices

1. **Isolation**: Each test should be independent and not rely on other tests
2. **Cleanup**: Use `beforeEach` and `afterEach` to reset mocks and state
3. **Descriptive Names**: Test names should clearly describe what they're testing
4. **AAA Pattern**: Arrange, Act, Assert
5. **Mock External Dependencies**: Mock database calls, external APIs, etc.

## Continuous Integration

Tests should pass before merging code. Consider setting up CI/CD to run tests automatically on pull requests.
