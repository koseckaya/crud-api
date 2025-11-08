A simple CRUD API implementation using in-memory database.

## Prerequisites

- Node.js version 22.x.x (22.14.0 or higher)
- npm (Node Package Manager)

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
```

2. Navigate to the project directory:

```bash
cd CRUD-API
```

3. Install dependencies:

```bash
npm install
```

4. Create .env file in the root directory and add:

```bash
PORT=4000
```

## Running the Application

The application can be run in three different modes:

### Development Mode

```bash
npm run start:dev
```

Runs the server using ts-node-dev with hot reload.

### Production Mode

```bash
npm run start:prod
```

Builds and runs the compiled application.

### Multi-Instance Mode (Horizontal Scaling)

```bash
npm run start:multi
```

Starts multiple instances with a load balancer.

## API Endpoints

### GET /api/users

Get all users.

Response:

- Status: 200 OK
- Body: Array of users

### GET /api/users/{userId}

Get user by ID.

Parameters:

- userId: UUID of the user
  Responses:

- 200 OK: User found
- 400 Bad Request: Invalid UUID format
- 404 Not Found: User not found

### POST /api/users

Create a new user.

Request Body:

```bash
{
    "username": "John Doe",
    "age": 25,
    "hobbies": ["reading", "gaming"]
}
```

Responses:

- 201 Created: User created
- 400 Bad Request: Missing required fields or invalid data types

### PUT /api/users/{userId}

Update existing user.

Parameters:

- userId: UUID of the user
  Request Body:

```bash
{
    "username": "John Doe Updated",
    "age": 26,
    "hobbies": ["reading", "gaming"]
}
```

Responses:

- 200 OK: User updated
- 400 Bad Request: Invalid UUID or data format
- 404 Not Found: User not found

### DELETE /api/users/{userId}

Delete a user.

Parameters:

- userId: UUID of the user
  Responses:

- 204 No Content: User successfully deleted
- 400 Bad Request: Invalid UUID format
- 404 Not Found: User not found

## Testing

Run tests:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```
