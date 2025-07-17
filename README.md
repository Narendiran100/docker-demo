# Docker Demo Project

A simple Node.js application with MySQL database using Docker Compose.

## Project Structure

```
docker-demo/
├── src/
│   └── index.js        # Node.js web server with MySQL integration
├── Dockerfile          # Instructions for building Docker image
├── docker-compose.yml  # Multi-container Docker configuration
├── .dockerignore       # Files to exclude from Docker build
└── README.md          # Project documentation
```

## Prerequisites

- Docker and Docker Compose installed on your system
- Node.js (for local development)

## Building and Running the Application

1. Start the application using Docker Compose:

```bash
docker-compose up
```

This command will:

- Build the Node.js application image
- Pull the MySQL image
- Create and start both containers
- Set up the network between them
- Configure the database with environment variables
- Mount the database volume for persistence

2. Access the application:
   Open your browser and visit `http://localhost:3001`

3. To stop the application:

```bash
docker-compose down
```

## Understanding Docker Compose

### Why Docker Compose?

We use Docker Compose in this project for several reasons:

1. **Multi-Container Management**:

   - Manages multiple containers (Node.js app and MySQL database)
   - Defines their relationships and dependencies
   - Ensures they can communicate with each other

2. **Configuration Management**:

   - Centralizes all container configurations in one file
   - Makes it easy to modify settings
   - Ensures consistent environment setup

3. **Service Orchestration**:
   - Handles startup order (database starts before the app)
   - Manages network creation
   - Provides volume persistence

### Docker Compose Configuration Explained

Our `docker-compose.yml` breakdown:

```yaml
version: '3.8' # Docker Compose file format version

services: # Define the application services
  app: # Node.js application service
    build: . # Build from local Dockerfile
    ports: # Port mapping
      - '3001:3000' # Host:Container
    environment: # Environment variables
      - MYSQL_HOST=mysql # Use service name as hostname
    depends_on: # Startup order
      - mysql # Start MySQL before app

  mysql: # MySQL database service
    image: mysql:8.0 # Use official MySQL image
    environment: # Database configuration
      - MYSQL_DATABASE=mydatabase
      - MYSQL_USER=user
    ports: # Expose MySQL port
      - '3306:3306'
    volumes: # Persistent storage
      - mysql_data:/var/lib/mysql

volumes: # Named volume for data persistence
  mysql_data: # MySQL data storage
```

### Docker Compose vs Kubernetes

While both Docker Compose and Kubernetes handle container orchestration, they serve different purposes:

1. **Scale and Complexity**:

   - Docker Compose: Simple, single-host deployments
   - Kubernetes: Complex, multi-host cluster management

2. **Features**:

   - Docker Compose:
     - Basic container orchestration
     - Simple networking
     - Local development
     - Single-host deployment
   - Kubernetes:
     - Advanced orchestration
     - Auto-scaling
     - Load balancing
     - Rolling updates
     - Multi-host clustering
     - Production-grade features

3. **Use Cases**:
   - Docker Compose:
     - Development environments
     - Simple applications
     - Single-server deployments
     - Quick prototypes
   - Kubernetes:
     - Production deployments
     - Microservices architecture
     - High-availability requirements
     - Complex applications

In our project, Docker Compose is the perfect choice because:

- We have a simple two-service architecture
- We're running everything on a single host
- We need basic orchestration features
- We want a simple development setup

## Docker Compose Commands

- `docker-compose up`

  - Starts all services defined in docker-compose.yml
  - `-d` flag runs in detached mode (background)
  - `--build` flag forces rebuilding of images

- `docker-compose down`

  - Stops and removes all containers
  - Also removes networks created by up
  - `--volumes` flag also removes volumes

- `docker-compose ps`

  - Lists all containers managed by docker-compose
  - Shows their status and ports

- `docker-compose logs`

  - View output from containers
  - `-f` flag to follow log output
  - `--tail=100` show last 100 lines

- `docker-compose exec`
  - Run commands in running containers
  - Example: `docker-compose exec mysql mysql -u user -p`

## Docker Commands Explained

- `docker build -t docker-demo .`

  - Builds a Docker image from the Dockerfile
  - `-t docker-demo` tags the image with the name "docker-demo"
  - `.` uses the current directory as the build context

- `docker run -p 3000:3000 docker-demo`
  - Creates and starts a container from the image
  - `-p 3000:3000` maps port 3000 from the container to port 3000 on your host machine
  - `docker-demo` is the name of the image to run

## Interacting with the Database

### Using the API Endpoints

1. View all items:

```bash
curl http://localhost:3001/items
```

2. Add a new item:

```bash
curl -X POST http://localhost:3001/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Test Item"}'
```

### Direct Database Access

1. Using Docker Compose to access MySQL CLI:

```bash
docker-compose exec mysql mysql -u user -p mydatabase
```

When prompted, enter the password: `password`

2. Using MySQL Client Tools:
   - Host: localhost
   - Port: 3306
   - Database: mydatabase
   - Username: user
   - Password: password

Common MySQL Commands:

```sql
-- Show all tables
SHOW TABLES;

-- View items table
SELECT * FROM items;

-- Add a test item
INSERT INTO items (name) VALUES ('Test Item');
```

## Additional Useful Commands

- List running containers:

```bash
docker ps
```

- Stop a running container:

```bash
docker stop <container_id>
```

- List all Docker images:

```bash
docker images
```

- Remove a Docker image:

```bash
docker rmi docker-demo
```
