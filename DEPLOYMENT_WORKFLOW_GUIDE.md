# Forge Deployment Workflow Guide

This workflow allows you to deploy your Forge app to different environments with full control over which stages to run.

## 🚀 How to Use

### 1. **Manual Trigger**
Go to GitHub Actions → "Forge Deploy" → "Run workflow"

### 2. **Environment Selection Options**
- **`dev`** - Deploy only to development
- **`test`** - Deploy only to test  
- **`production`** - Deploy only to production
- **`dev-and-test`** - Deploy to dev, then test
- **`all`** - Deploy to all environments sequentially

### 3. **Additional Options**
- **Skip Tests** - Bypass pre-deployment tests
- **Force Deploy** - Skip confirmation prompts for production

## 🔧 Workflow Features

### **Sequential Deployment**
- Dev → Test → Production (when using "all")
- Each stage waits for the previous to complete
- Failed stages stop the pipeline

### **Environment Protection**
- Uses GitHub Environment protection rules
- Can require manual approval for production
- Supports environment-specific secrets

### **Conditional Execution**
- Only runs selected environments
- Skips unnecessary steps
- Handles dependencies between jobs

## 📋 Setup Requirements

### 1. **GitHub Secrets**
Add these to your repository secrets:
- `FORGE_EMAIL` - Your Atlassian email
- `FORGE_API_TOKEN` - Your Atlassian API token

### 2. **GitHub Environments** (Optional but Recommended)
Create these environments in your repo settings:
- `development`
- `test` 
- `production`

For each environment, you can:
- Require manual approval
- Set environment-specific secrets
- Add protection rules

### 3. **Forge Environments**
Make sure you have these environments set up in Forge:
```bash
forge environments create -e development
forge environments create -e test
forge environments create -e production
```

## 🎯 Example Usage Scenarios

### **Quick Dev Deploy**
- Environment: `dev`
- Skip Tests: `true`
- Force Deploy: `true`

### **Full Pipeline Test**
- Environment: `all`
- Skip Tests: `false`
- Force Deploy: `false`

### **Emergency Production Fix**
- Environment: `production`
- Skip Tests: `true`
- Force Deploy: `true`

### **Staging Validation**
- Environment: `dev-and-test`
- Skip Tests: `false`
- Force Deploy: `false`

## 🔒 Security Features

### **Environment Protection**
```yaml
environment: production  # Requires approval
```

### **Conditional Production Deploy**
```yaml
if: needs.pre-checks.outputs.deploy-prod == 'true'
```

### **Force Deploy Safety**
Production deployments can require manual confirmation even with force deploy enabled.

## 📊 Monitoring

The workflow provides:
- ✅ Step-by-step deployment status
- 📋 Final deployment summary
- 🔔 Optional notifications (Slack, webhook, etc.)

## 🛠 Customization

### **Add More Environments**
1. Add to the choice options in `workflow_dispatch`
2. Create new job following the pattern
3. Update the environment determination logic

### **Add Notifications**
Uncomment and configure the notification section in the `notify` job:
```yaml
curl -X POST -H "Content-Type: application/json" \
  -d '{"text":"Deployment completed"}' \
  ${{ secrets.SLACK_WEBHOOK_URL }}
```

### **Add Health Checks**
Add post-deployment verification:
```yaml
- name: Health Check
  run: |
    curl -f https://your-app-url/health
```

## 🐛 Troubleshooting

### **Workflow Not Showing**
- Check YAML syntax with `yamllint`
- Ensure file is on main branch
- Verify `workflow_dispatch` is properly configured

### **Authentication Failures**
- Verify `FORGE_EMAIL` and `FORGE_API_TOKEN` secrets
- Check token permissions and expiration
- Ensure email matches Atlassian account

### **Environment Errors**
- Verify Forge environments exist: `forge environments list`
- Check environment names match exactly
- Ensure proper permissions for target environments