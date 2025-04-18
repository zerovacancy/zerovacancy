# Code Review Guidelines

This document provides guidelines for reviewing code in terms of quality, performance, security, and maintainability.

## Code Quality

When reviewing code quality, consider the following:

- **Correctness**: Does the code correctly implement the intended functionality?
- **Readability**: Is the code easy to read and understand?
- **Naming**: Are variables, functions, and classes named clearly and consistently?
- **Comments**: Are comments helpful, necessary, and up-to-date?
- **Error Handling**: Is error handling comprehensive and appropriate?
- **Edge Cases**: Are edge cases handled properly?
- **Duplication**: Is there any unnecessary code duplication?
- **Complexity**: Is the code unnecessarily complex?

## Performance

When reviewing code for performance, consider the following:

- **Algorithmic Efficiency**: Are the algorithms and data structures appropriate for the task?
- **Resource Usage**: Does the code use memory, CPU, and other resources efficiently?
- **Loops and Iterations**: Are loops and iterations optimized?
- **Database Queries**: Are database queries optimized (if applicable)?
- **Network Requests**: Are network requests minimized and optimized (if applicable)?
- **Caching**: Is caching used appropriately where beneficial?
- **Asynchronous Operations**: Are operations that could block the main thread handled asynchronously?
- **Lazy Loading**: Is lazy loading used where appropriate?

## Security

When reviewing code for security, consider the following:

- **Input Validation**: Is all user input properly validated?
- **Authentication and Authorization**: Are authentication and authorization implemented correctly?
- **Data Encryption**: Is sensitive data encrypted appropriately?
- **SQL Injection**: Is the code protected against SQL injection (if applicable)?
- **Cross-Site Scripting (XSS)**: Is the code protected against XSS attacks (if applicable)?
- **Cross-Site Request Forgery (CSRF)**: Is the code protected against CSRF attacks (if applicable)?
- **Sensitive Information**: Is sensitive information (like API keys, passwords) handled securely?
- **Error Messages**: Do error messages reveal sensitive information?
- **Dependencies**: Are dependencies up-to-date and free from known vulnerabilities?

## Maintainability

When reviewing code for maintainability, consider the following:

- **Modularity**: Is the code modular and well-organized?
- **Coupling**: Is coupling between components minimized?
- **Cohesion**: Is cohesion within components maximized?
- **Testability**: Is the code easily testable?
- **Documentation**: Is the code well-documented?
- **Consistency**: Is the code consistent with the rest of the codebase?
- **Standards Compliance**: Does the code comply with project coding standards?
- **Extensibility**: Is the code designed to be easily extended?
- **Refactorability**: Can the code be easily refactored if needed?
- **Technical Debt**: Does the code introduce technical debt?

## Providing Recommendations

When providing recommendations:

1. Be specific about what needs to be changed
2. Explain why the change is necessary
3. Provide examples of how to implement the change if possible
4. Prioritize recommendations (critical, important, minor)
5. Focus on the most impactful changes first
