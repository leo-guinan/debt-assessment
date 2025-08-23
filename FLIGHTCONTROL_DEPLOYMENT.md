# FlightControl AWS Deployment Guide

Deploy your Debt Assessment app to AWS with FlightControl in minutes! FlightControl handles all AWS infrastructure automatically.

## Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **FlightControl Account** - Sign up at [flightcontrol.dev](https://flightcontrol.dev)
3. **AWS Account** - FlightControl will connect to your AWS account
4. **Airtable Credentials** - Your Base ID and API Key ready

## Step-by-Step Deployment

### 1. Connect AWS to FlightControl

1. Log in to [FlightControl Dashboard](https://app.flightcontrol.dev)
2. Click "Connect AWS Account"
3. Follow the CloudFormation stack creation (takes ~2 minutes)
4. FlightControl will have permission to deploy to your AWS

### 2. Connect GitHub Repository

1. In FlightControl, click "New Project"
2. Select "Connect GitHub"
3. Authorize FlightControl to access your repository
4. Select your `debt-assess` repository

### 3. Configure Secrets

Before deploying, add your Airtable credentials as secrets:

1. In FlightControl dashboard, go to your project
2. Click "Environment Variables" → "Secrets"
3. Add these secrets:
   ```
   AIRTABLE_BASE_ID = your_actual_base_id
   AIRTABLE_API_KEY = your_actual_api_key
   ```

### 4. Deploy with FlightControl Config

1. FlightControl will detect the `flightcontrol.json` file
2. Review the configuration:
   - Service: `debt-assess-backend`
   - Region: `us-east-1`
   - Instances: 1-3 (autoscaling)
   - Memory: 1GB
   - CPU: 0.5 vCPU

3. Click "Create Project" to start deployment

### 5. Monitor Deployment

1. Watch the build logs in real-time
2. Deployment typically takes 5-10 minutes
3. Once complete, you'll get a URL like:
   ```
   https://debt-assess-backend-production.flightcontrol.app
   ```

### 6. Update Frontend Configuration

After deployment, update your frontend to use the FlightControl URL:

1. Create a new `.env.production` file:
   ```env
   VITE_API_ENDPOINT=https://debt-assess-backend-production.flightcontrol.app/api/submit-quiz
   ```

2. Rebuild and redeploy the frontend

## Configuration Details

The `flightcontrol.json` includes:

```json
{
  "environments": [{
    "id": "production",
    "services": [{
      "id": "debt-assess-backend",
      "type": "web",
      "buildType": "nixpacks",
      "port": 3000,
      "healthCheckPath": "/api/health",
      "cpu": 0.5,
      "memory": 1,
      "minInstances": 1,
      "maxInstances": 3
    }]
  }]
}
```

### What FlightControl Creates in AWS

- **ECS Fargate** - Serverless container hosting
- **Application Load Balancer** - Handles traffic distribution
- **CloudWatch** - Logs and monitoring
- **Auto Scaling** - Scales 1-3 instances based on load
- **SSL Certificate** - Automatic HTTPS
- **VPC & Security Groups** - Network isolation

## Testing Your Deployment

### 1. Check Health Endpoint
```bash
curl https://your-flightcontrol-url.app/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "configured": true
}
```

### 2. Test Form Submission
1. Open your frontend app
2. Complete the quiz
3. Check Airtable for the submission

## Custom Domain (Optional)

1. In FlightControl dashboard, go to your service
2. Click "Custom Domains"
3. Add your domain (e.g., `api.yourdomain.com`)
4. Update DNS records as instructed
5. Update frontend `.env` with new domain

## Monitoring & Logs

### View Logs
1. FlightControl Dashboard → Your Service → "Logs"
2. Real-time logs from your Express server
3. Filter by time range or search

### Metrics
- CPU usage
- Memory usage
- Request count
- Response times
- Error rates

### Alerts
Set up alerts in FlightControl for:
- High error rates
- Memory/CPU thresholds
- Health check failures

## Scaling Configuration

Adjust in `flightcontrol.json`:

```json
{
  "minInstances": 1,    // Minimum running instances
  "maxInstances": 10,   // Maximum for high traffic
  "cpu": 1,            // Increase for compute-heavy tasks
  "memory": 2          // Increase for more concurrent users
}
```

## Environment-Specific Deployments

### Staging Environment
Add to `flightcontrol.json`:

```json
{
  "id": "staging",
  "name": "Staging Environment",
  "source": {
    "branch": "develop"
  }
}
```

### Preview Environments
FlightControl can create preview environments for PRs automatically.

## Cost Estimation

Based on default configuration:
- **Fargate**: ~$20-30/month (1 instance running 24/7)
- **Load Balancer**: ~$20/month
- **Data Transfer**: ~$5-10/month
- **Total**: ~$45-60/month

Auto-scaling helps control costs by scaling down during low traffic.

## Troubleshooting

### Build Fails
- Check Node version (requires 18+)
- Verify all dependencies in package.json
- Check build logs for specific errors

### Health Check Fails
- Ensure `/api/health` endpoint exists
- Check PORT environment variable
- Verify server starts correctly

### Airtable Connection Issues
- Confirm secrets are set correctly
- Check secret names match exactly
- Verify Airtable API key permissions

### High Memory Usage
- Increase memory in flightcontrol.json
- Check for memory leaks
- Implement caching strategies

## CI/CD Pipeline

FlightControl automatically deploys when you push to GitHub:

1. Push to `main` branch
2. FlightControl detects changes
3. Builds new container
4. Runs health checks
5. Deploys with zero downtime
6. Rolls back if health checks fail

## Security Notes

- Secrets are encrypted in AWS Secrets Manager
- HTTPS is enforced automatically
- Security groups limit access
- Container images are scanned for vulnerabilities
- IAM roles follow least-privilege principle

## Support

- FlightControl Docs: [docs.flightcontrol.dev](https://docs.flightcontrol.dev)
- FlightControl Support: support@flightcontrol.dev
- AWS Status: [status.aws.amazon.com](https://status.aws.amazon.com)

## Next Steps

1. ✅ Deploy to FlightControl
2. ✅ Test the endpoints
3. ✅ Set up monitoring
4. 📊 Watch your Airtable for submissions
5. 🚀 Scale as needed

Your app is now running on AWS with enterprise-grade infrastructure, all managed by FlightControl!