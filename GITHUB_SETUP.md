# GitHub Setup Instructions

## 1. Create GitHub Repository

```bash
# Create a new repository on GitHub with the name: boilerplate-simple-project-nodejs
# (Do NOT initialize with README, .gitignore, or license)
```

## 2. Initialize Git Locally

```bash
cd /home/guilherme-antony/Documentos/Trabalhos/boilerplate-simple-project-nodejs-main

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Microservices architecture with JWT authentication, MySQL persistence, Docker Compose, Swagger documentation, and CI/CD pipeline"

# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/boilerplate-simple-project-nodejs.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 3. Configure GitHub Secrets for CD Pipeline

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

- **AWS_ACCESS_KEY_ID**: Your AWS access key
- **AWS_SECRET_ACCESS_KEY**: Your AWS secret access key

## 4. AWS Setup Prerequisites

Before the CD pipeline can work, you need to:

1. Create an ECR repository for each service:
   ```bash
   aws ecr create-repository --repository-name microservices-auth-service --region us-east-1
   aws ecr create-repository --repository-name microservices-user-service --region us-east-1
   aws ecr create-repository --repository-name microservices-restaurant-service --region us-east-1
   ```

2. Create ECS cluster:
   ```bash
   aws ecs create-cluster --cluster-name microservices-cluster --region us-east-1
   ```

3. Create ECS services (after updating task definitions with your AWS Account ID):
   - Update `.github/ecs/*-task-definition.json` files
   - Replace `ACCOUNT_ID` with your AWS account ID
   - Create the services via AWS Console or CLI

4. Store secrets in AWS Secrets Manager:
   ```bash
   aws secretsmanager create-secret --name jwt-secret --secret-string "your-jwt-secret-here"
   aws secretsmanager create-secret --name db-password --secret-string "your-db-password-here"
   ```

## 5. CI/CD Pipeline Overview

### CI Pipeline (ci.yml)
- Runs on every push and pull request
- Lints code with ESLint
- Runs tests with Jest
- Runs for: auth-service, user-service, restaurant-service

### CD Pipeline (cd.yml)
- Triggers after successful CI or on push to main/production
- Builds Docker images for each service
- Pushes to AWS ECR
- Updates ECS task definitions
- Deploys to ECS cluster
- Supports blue-green deployment strategy for production branch

## 6. Local Development

```bash
# Start all services with Docker Compose
docker-compose up -d

# Access APIs:
# Auth Service: http://localhost:3000
# User Service: http://localhost:3001
# Restaurant Service: http://localhost:3002

# Swagger Documentation:
# Auth Service: http://localhost:3000/docs
# User Service: http://localhost:3001/docs
# Restaurant Service: http://localhost:3002/docs
```

## 7. Testing

```bash
# Run tests for all services
npm test --workspaces

# Run tests for specific service
cd auth-service && npm test
cd user-service && npm test
cd restaurant-service && npm test
```

## 8. Linting

```bash
# Lint all services
npm run lint --workspaces

# Lint specific service
cd auth-service && npm run lint
```
