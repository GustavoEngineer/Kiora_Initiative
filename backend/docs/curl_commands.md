# Curl Commands for Testing Endpoints

Base URL: `http://localhost:4001`

Use these commands in your terminal (PowerShell) to test the API.

## Health Check
```powershell
curl -v http://localhost:4001/
```

## Blocs
### Get all blocs
```powershell
curl -v http://localhost:4001/api/blocs
```

### Create a bloc
```powershell
curl -v -X POST http://localhost:4001/api/blocs `
  -H "Content-Type: application/json" `
  -d '{"name": "Morning Shift"}'
```

### Update a bloc (Replace :id)
```powershell
curl -v -X PUT http://localhost:4001/api/blocs/1 `
  -H "Content-Type: application/json" `
  -d '{"name": "Evening Shift"}'
```

### Delete a bloc (Replace :id)
```powershell
curl -v -X DELETE http://localhost:4001/api/blocs/1
```

## Tags
### Get all tags
```powershell
curl -v http://localhost:4001/api/tags
```

### Create a tag
```powershell
curl -v -X POST http://localhost:4001/api/tags `
  -H "Content-Type: application/json" `
  -d '{"name": "Urgent", "importance_level": 5}'
```

### Update a tag (Replace :id)
```powershell
curl -v -X PUT http://localhost:4001/api/tags/1 `
  -H "Content-Type: application/json" `
  -d '{"name": "Low Priority", "importance_level": 1}'
```

## WorkDays
### Get all workdays
```powershell
curl -v http://localhost:4001/api/workdays
```

### Create a workday
```powershell
curl -v -X POST http://localhost:4001/api/workdays `
  -H "Content-Type: application/json" `
  -d '{"available_hours": 8}'
```

### Update a workday (Replace :id)
```powershell
curl -v -X PUT http://localhost:4001/api/workdays/1 `
  -H "Content-Type: application/json" `
  -d '{"available_hours": 4}'
```

## Tasks
**Note:** Ensure `bloc_id` and `tag_id` exist before creating a task.

### Get all tasks
```powershell
curl -v http://localhost:4001/api/tasks
```

### Create a task
```powershell
curl -v -X POST http://localhost:4001/api/tasks `
  -H "Content-Type: application/json" `
  -d '{"title": "Complete Documentation", "due_date": "2023-12-31", "completed": false, "estimated_hours": 2, "bloc_id": 1, "tag_id": 1}'
```

### Update a task (Replace :id)
```powershell
curl -v -X PUT http://localhost:4001/api/tasks/1 `
  -H "Content-Type: application/json" `
  -d '{"title": "Update Documentation", "completed": true}'
```

### Delete a task (Replace :id)
```powershell
curl -v -X DELETE http://localhost:4001/api/tasks/1
```
