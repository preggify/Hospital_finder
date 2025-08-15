# Environment Configuration Documentation

## Environment Files
The application uses environment-specific configuration files to manage settings like API endpoints.

### Files Structure
- `src/environments/environment.ts` - Development environment settings
- `src/environments/environment.prod.ts` - Production environment settings

### Local Development
1. Copy `.env.example` to `.env` for any local overrides:
   ```
   cp .env.example .env
   ```

2. Update the values in `.env` file as needed.

### Environment Variables
- `apiUrl`: Base URL for the backend API

### Adding New Environment Variables
1. Add the variable to the environment files:
   ```typescript
   // environment.ts and environment.prod.ts
   export const environment = {
     production: false, // or true for prod
     apiUrl: 'https://api-example.com',
     newVariable: 'value'
   };
   ```

2. Add the variable to `.env.example` to document it:
   ```
   API_URL=https://api-example.com
   NEW_VARIABLE=value
   ```

### Using Environment Variables in Code
Import the environment file and use its properties:

```typescript
import { environment } from '../../environments/environment';

// Then use it in your code
const apiUrl = environment.apiUrl;
```
