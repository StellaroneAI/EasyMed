# Deployment Guide

This guide covers different deployment options for the EasyMed AI Healthcare Platform.

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/StellaroneAI/EasyMed.git
cd EasyMed
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment configuration**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Start development server**
```bash
npm run dev
```

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose (optional)

### Build and Run

1. **Build the Docker image**
```bash
docker build -t easymed .
```

2. **Run the container**
```bash
docker run -p 3000:3000 --env-file .env easymed
```

### Docker Compose

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  easymed:
    build: .
    ports:
      - "3000:3000"
    env_file:
      - .env
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    volumes:
      - /tmp/uploads:/tmp/uploads
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Run with:
```bash
docker-compose up -d
```

## AWS ECS Deployment

The repository includes GitHub Actions workflow for AWS ECS deployment.

### Prerequisites
1. AWS Account with ECS setup
2. ECR repository created
3. ECS cluster, service, and task definition
4. GitHub secrets configured

### GitHub Secrets Required
```
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AI4BHARAT_API_KEY
HUGGINGFACE_API_KEY
```

### ECS Task Definition

Example task definition (`task-definition.json`):
```json
{
  "family": "easymed-task",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::ACCOUNT:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "easymed",
      "image": "ACCOUNT.dkr.ecr.REGION.amazonaws.com/easymed:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        },
        {
          "name": "PORT",
          "value": "3000"
        }
      ],
      "secrets": [
        {
          "name": "AI4BHARAT_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:easymed/ai4bharat-key"
        },
        {
          "name": "HUGGINGFACE_API_KEY",
          "valueFrom": "arn:aws:secretsmanager:REGION:ACCOUNT:secret:easymed/huggingface-key"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/easymed",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### Deployment Steps

1. **Update GitHub workflow variables** in `.github/workflows/aws.yml`
2. **Push to main branch** to trigger deployment
3. **Monitor deployment** in AWS ECS console

## Environment Variables

### Required for Production

```bash
# Server
NODE_ENV=production
PORT=3000

# AI Services
AI4BHARAT_API_KEY=your_actual_api_key
HUGGINGFACE_API_KEY=your_actual_api_key

# Optional configurations
CACHE_TTL=3600
RATE_LIMIT_MAX=100
AI_RATE_LIMIT_MAX=20
```

### Security Considerations

1. **Never commit API keys** to version control
2. **Use environment variables** or secure secret management
3. **Enable HTTPS** in production
4. **Configure CORS** appropriately
5. **Set up monitoring** and logging

## Health Checks

The application provides health check endpoints:

- **Basic health**: `GET /health`
- **AI services health**: `GET /api/ai/health`

Configure your load balancer or container orchestration to use these endpoints.

## Monitoring and Logging

### Application Logs
- Request/response logging via Morgan
- Error logging with stack traces
- Cache statistics
- AI service performance metrics

### Recommended Monitoring
1. **Application Performance Monitoring** (APM)
2. **Log aggregation** (ELK stack, CloudWatch)
3. **Metrics collection** (Prometheus, CloudWatch)
4. **Alerting** on errors and performance

## Scaling Considerations

### Horizontal Scaling
- The application is stateless (except for in-memory cache)
- Can run multiple instances behind a load balancer
- Consider Redis for shared caching in multi-instance deployments

### Vertical Scaling
- Monitor memory usage for cache
- CPU usage depends on AI processing load
- Consider GPU instances for heavy AI workloads

### Database Integration
For production use, consider adding:
- PostgreSQL for user data and analytics
- Redis for distributed caching
- MongoDB for storing conversation history

## Performance Optimization

1. **Enable caching** with appropriate TTL values
2. **Use CDN** for static assets
3. **Implement connection pooling** for external APIs
4. **Monitor API rate limits** and implement backoff strategies
5. **Use compression** for API responses

## Backup and Recovery

1. **Configuration backup**: Store environment variables securely
2. **Application backup**: Use container images and infrastructure as code
3. **Data backup**: If using databases, implement regular backups
4. **Disaster recovery**: Document recovery procedures

## Troubleshooting

### Common Issues

1. **API Key errors**: Check environment variables and API key validity
2. **Rate limiting**: Monitor API usage and implement retry logic
3. **Memory issues**: Monitor cache size and implement cleanup
4. **Network timeouts**: Configure appropriate timeout values

### Debug Mode

Set environment variables for debugging:
```bash
NODE_ENV=development
LOG_LEVEL=debug
ENABLE_REQUEST_LOGGING=true
```

### Log Analysis

Monitor these log patterns:
- "Translation error"
- "Rate limit exceeded"
- "Cache MISS/HIT"
- "AI service error"

## Security Checklist

- [ ] API keys stored securely
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Input validation implemented
- [ ] Rate limiting enabled
- [ ] Security headers configured (Helmet.js)
- [ ] File upload restrictions in place
- [ ] Error messages don't leak sensitive information

## Post-Deployment Verification

1. **Health check**: Verify `/health` endpoint
2. **API functionality**: Test key endpoints
3. **Performance**: Monitor response times
4. **Logs**: Check for errors or warnings
5. **Monitoring**: Verify metrics collection