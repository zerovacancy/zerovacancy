
# Code Review Guidelines

This document provides comprehensive guidelines for reviewing code in terms of quality, performance, security, and maintainability. Use these guidelines when reviewing code changes to ensure consistent, high-quality feedback.

## Code Quality

When reviewing code quality, consider the following:

### Correctness
- Does the code correctly implement the intended functionality?
- Are there any logical errors or edge cases not handled?
- Do unit tests verify the expected behavior?
- Are there any off-by-one errors or incorrect boundary conditions?

### Readability
- Is the code easy to read and understand?
- Are variable and function names descriptive and consistent?
- Is the code well-formatted and consistently styled?
- Are complex operations explained with comments?

**Example of poor readability:**
```
function x(a,b) {
  let c = 0;
  for(let i=0;i<a.length;i++) {
    if(a[i]>b) c += a[i];
  }
  return c;
}
```

**Improved readability:**
```
function sumValuesGreaterThan(values, threshold) {
  let sum = 0;
  
  for (let i = 0; i < values.length; i++) {
    if (values[i] > threshold) {
      sum += values[i];
    }
  }
  
  return sum;
}
```

### Naming Conventions
- Are variables, functions, and classes named clearly and consistently?
- Do names follow project conventions?
- Are abbreviations avoided unless they're universally understood?
- Do names reveal intent and purpose?

### Error Handling
- Is error handling comprehensive and appropriate?
- Are errors propagated correctly?
- Are error messages clear and helpful?
- Are resources properly released in error cases?

### Edge Cases
- Are edge cases handled properly?
- Is input validation thorough?
- Is the code resilient to unexpected inputs?
- Are boundary conditions tested?

### Code Duplication
- Is there any unnecessary code duplication?
- Could shared functionality be extracted into helper functions?
- Are there opportunities to use existing libraries or utilities?

### Complexity
- Is the code unnecessarily complex?
- Could complex sections be simplified or broken down?
- Are there too many nested conditions or loops?
- Would a different algorithm or data structure simplify the code?

## Performance

When reviewing code for performance, consider the following:

### Algorithmic Efficiency
- Are the algorithms and data structures appropriate for the task?
- What is the time and space complexity of the code?
- Could a more efficient algorithm be used?
- Are there any unnecessary computations or iterations?

**Example of inefficient code:**
```
// O(n²) approach to find duplicates
function hasDuplicates(array) {
  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (i !== j && array[i] === array[j]) {
        return true;
      }
    }
  }
  return false;
}
```

**More efficient approach:**
```
// O(n) approach using a Set
function hasDuplicates(array) {
  const seen = new Set();
  for (const item of array) {
    if (seen.has(item)) {
      return true;
    }
    seen.add(item);
  }
  return false;
}
```

### Resource Usage
- Does the code use memory, CPU, and other resources efficiently?
- Are there any memory leaks?
- Are resources properly released when no longer needed?
- Is the code optimized for the target environment?

### Loops and Iterations
- Are loops and iterations optimized?
- Could any loops be combined or eliminated?
- Are there any unnecessary iterations?
- Is work being repeated unnecessarily?

### Database Queries
- Are database queries optimized?
- Are indexes used effectively?
- Are queries batched where appropriate?
- Is the database connection pool managed properly?

### Network Requests
- Are network requests minimized and optimized?
- Is data cached appropriately?
- Are requests batched where possible?
- Is proper error handling in place for network failures?

### Caching
- Is caching used appropriately where beneficial?
- Is the cache invalidation strategy sound?
- Are cache sizes appropriate for the expected load?
- Is the caching layer properly abstracted?

### Asynchronous Operations
- Are operations that could block the main thread handled asynchronously?
- Is concurrency managed properly?
- Are promises or async/await used correctly?
- Are there any potential race conditions?

### Lazy Loading
- Is lazy loading used where appropriate?
- Are heavy resources loaded only when needed?
- Is there a good balance between initial load time and responsiveness?

## Security

When reviewing code for security, consider the following:

### Input Validation
- Is all user input properly validated?
- Is input sanitized before use?
- Are there any potential injection vulnerabilities?
- Is validation consistent across the application?

**Example of vulnerable code:**
```
// SQL injection vulnerability
function getUserData(userId) {
  const query = `SELECT * FROM users WHERE id = ${userId}`;
  return database.execute(query);
}
```

**Secure approach:**
```
// Using parameterized queries
function getUserData(userId) {
  const query = `SELECT * FROM users WHERE id = ?`;
  return database.execute(query, [userId]);
}
```

### Authentication and Authorization
- Are authentication and authorization implemented correctly?
- Are passwords stored securely (hashed and salted)?
- Are authentication tokens managed properly?
- Is access control enforced consistently?

### Data Encryption
- Is sensitive data encrypted appropriately?
- Are encryption keys managed securely?
- Is data encrypted both in transit and at rest?
- Are strong encryption algorithms used?

### SQL Injection
- Is the code protected against SQL injection?
- Are parameterized queries or ORM frameworks used?
- Is user input ever directly concatenated into SQL queries?

### Cross-Site Scripting (XSS)
- Is the code protected against XSS attacks?
- Is user-generated content properly escaped before rendering?
- Are Content Security Policies (CSP) in place?

### Cross-Site Request Forgery (CSRF)
- Is the code protected against CSRF attacks?
- Are CSRF tokens used for state-changing operations?
- Are cookies properly secured with appropriate flags?

### Sensitive Information
- Is sensitive information (like API keys, passwords) handled securely?
- Are secrets stored in environment variables or secure storage?
- Is sensitive data logged or exposed in error messages?

### Error Messages
- Do error messages reveal sensitive information?
- Are stack traces hidden in production environments?
- Are errors logged securely?

### Dependencies
- Are dependencies up-to-date and free from known vulnerabilities?
- Is there a process for updating dependencies?
- Are dependencies from trusted sources?

## Maintainability

When reviewing code for maintainability, consider the following:

### Modularity
- Is the code modular and well-organized?
- Are responsibilities clearly separated?
- Does each component have a single responsibility?
- Can components be tested in isolation?

### Coupling
- Is coupling between components minimized?
- Are dependencies explicit and necessary?
- Is the code loosely coupled with clear interfaces?
- Would changes in one component require changes in many others?

### Cohesion
- Is cohesion within components maximized?
- Do functions and classes have a clear, focused purpose?
- Are related functions grouped together logically?

### Testability
- Is the code easily testable?
- Are dependencies injectable for testing?
- Are side effects minimized or isolated?
- Is the code structured to allow unit testing?

### Documentation
- Is the code well-documented?
- Are complex algorithms or business rules explained?
- Are public APIs documented?
- Would a new developer understand the code's purpose and usage?

**Example of poor documentation:**
```
/**
 * Process data
 */
function process(data) {
  // Implementation
}
```

**Improved documentation:**
```
/**
 * Processes customer data to calculate loyalty points
 * 
 * @param {Object} data - Customer transaction data
 * @param {string} data.customerId - Unique customer identifier
 * @param {number} data.amount - Transaction amount in dollars
 * @returns {number} The number of loyalty points earned
 * @throws {Error} If data is invalid or customer not found
 */
function processLoyaltyPoints(data) {
  // Implementation
}
```

### Consistency
- Is the code consistent with the rest of the codebase?
- Are naming conventions followed consistently?
- Is the code style consistent?
- Are similar problems solved in similar ways?

### Standards Compliance
- Does the code comply with project coding standards?
- Are linting rules followed?
- Does the code follow language-specific best practices?

### Extensibility
- Is the code designed to be easily extended?
- Can new features be added without major refactoring?
- Are extension points clearly defined?
- Is the code open for extension but closed for modification?

### Refactorability
- Can the code be easily refactored if needed?
- Are dependencies clear and manageable?
- Is the code well-tested to support safe refactoring?

### Technical Debt
- Does the code introduce technical debt?
- Are there TODO comments or temporary solutions?
- Is there a plan to address technical debt?
- Is the debt documented and tracked?

## Providing Recommendations

When providing recommendations:

1. **Be specific about what needs to be changed**
   - Point to exact lines or functions
   - Describe the issue clearly
   - Suggest concrete alternatives

2. **Explain why the change is necessary**
   - Describe the benefits of making the change
   - Explain the risks of not making the change
   - Reference best practices or standards when applicable

3. **Provide examples of how to implement the change if possible**
   - Show code snippets of the suggested implementation
   - Reference similar patterns elsewhere in the codebase
   - Link to documentation or resources that explain the recommended approach

4. **Prioritize recommendations**
   - **Critical**: Must be fixed before merging (security issues, bugs, broken functionality)
   - **Important**: Should be fixed soon (performance issues, maintainability concerns)
   - **Minor**: Nice-to-have improvements (style issues, minor optimizations)

5. **Focus on the most impactful changes first**
   - Address security issues before style issues
   - Focus on correctness before optimization
   - Prioritize user-facing issues over internal concerns

## Conducting Effective Code Reviews

### Review Process

1. **Understand the context**
   - What problem is the code trying to solve?
   - What are the requirements and constraints?
   - How does this change fit into the larger system?

2. **First pass: High-level review**
   - Does the overall approach make sense?
   - Is the architecture appropriate?
   - Are there any major design issues?

3. **Second pass: Detailed review**
   - Go through the code line by line
   - Check for issues in each of the categories above
   - Look for edge cases and potential bugs

4. **Provide constructive feedback**
   - Be respectful and professional
   - Focus on the code, not the person
   - Explain the reasoning behind your suggestions
   - Offer solutions, not just criticisms

5. **Follow up**
   - Verify that critical issues have been addressed
   - Be available to discuss and clarify feedback
   - Acknowledge improvements and good solutions

### Review Etiquette

- **Be timely**: Review code promptly to avoid blocking others
- **Be thorough**: Take the time to understand the code and provide valuable feedback
- **Be constructive**: Offer solutions and alternatives, not just criticisms
- **Be respectful**: Remember that code reviews are about improving the code, not criticizing the author
- **Be open-minded**: Be willing to discuss alternative approaches and solutions
- **Be clear**: Communicate your concerns and suggestions clearly and concisely
- **Be collaborative**: Work with the author to improve the code, not against them

## Review Template

```markdown
# Code Review for [File Name]

## Quality
- Correctness: 
- Readability: 
- Naming: 
- Error Handling: 
- Edge Cases: 

## Performance
- Algorithmic Efficiency: 
- Resource Usage: 
- Optimization Opportunities: 

## Security
- Input Validation: 
- Authentication/Authorization: 
- Data Protection: 
- Vulnerability Checks: 

## Maintainability
- Code Organization: 
- Documentation: 
- Test Coverage: 
- Technical Debt: 

## Recommendations
- Critical Issues: 
- Important Improvements: 
- Minor Suggestions: 

## Code Snippets
```
[Add relevant code snippets with line numbers and suggested changes]
```
```
1. Be specific about what needs to be changed
2. Explain why the change is necessary
3. Provide examples of how to implement the change if possible
4. Prioritize recommendations (critical, important, minor)
5. Focus on the most impactful changes first
