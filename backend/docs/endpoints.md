# Backend API Endpoints

Base URL: `http://localhost:4001`

## Health Check
- GET `http://localhost:4001/`

## API Routes
All API routes are prefixed with `/api`.

### Blocs
- GET List all blocs: `http://localhost:4001/api/blocs`
- GET Get bloc by ID: `http://localhost:4001/api/blocs/:id`
- POST Create bloc: `http://localhost:4001/api/blocs`
- PUT Update bloc: `http://localhost:4001/api/blocs/:id`
- DELETE Delete bloc: `http://localhost:4001/api/blocs/:id`

### Tags
- GET List all tags: `http://localhost:4001/api/tags`
- GET Get tag by ID: `http://localhost:4001/api/tags/:id`
- POST Create tag: `http://localhost:4001/api/tags`
- PUT Update tag: `http://localhost:4001/api/tags/:id`
- DELETE Delete tag: `http://localhost:4001/api/tags/:id`

### Tasks
- GET List all tasks: `http://localhost:4001/api/tasks`
- GET Get task by ID: `http://localhost:4001/api/tasks/:id`
- POST Create task: `http://localhost:4001/api/tasks`
- PUT Update task: `http://localhost:4001/api/tasks/:id`
- DELETE Delete task: `http://localhost:4001/api/tasks/:id`

### WorkDays
- GET List all workdays: `http://localhost:4001/api/workdays`
- GET Get workday by ID: `http://localhost:4001/api/workdays/:id`
- POST Create workday: `http://localhost:4001/api/workdays`
- PUT Update workday: `http://localhost:4001/api/workdays/:id`
- DELETE Delete workday: `http://localhost:4001/api/workdays/:id`
