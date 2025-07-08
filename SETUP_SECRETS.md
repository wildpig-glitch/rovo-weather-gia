# GitHub Secrets Setup for Forge CLI

To run `forge lint` in GitHub Actions, you need to set up authentication secrets.

## Required Secrets

Add these secrets to your GitHub repository:

### 1. FORGE_EMAIL
- **Value**: Your Atlassian account email address
- **Example**: `your-email@company.com`

### 2. FORGE_API_TOKEN  
- **Value**: Your Atlassian API token
- **How to get it**:
  1. Go to https://id.atlassian.com/manage-profile/security/api-tokens
  2. Click "Create API token"
  3. Give it a name like "GitHub Actions Forge CLI"
  4. Copy the generated token

## How to Add Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add both secrets:
   - Name: `FORGE_EMAIL`, Value: your email
   - Name: `FORGE_API_TOKEN`, Value: your API token

## Alternative: Environment Variables

If you prefer, you can also set these as environment variables in the workflow:

```yaml
env:
  FORGE_EMAIL: your-email@company.com
  FORGE_API_TOKEN: your-api-token
```

**⚠️ Warning**: Don't put the actual token in your workflow file - always use secrets!

## Testing Authentication

After setting up the secrets, the workflow will:
1. Authenticate with Forge using your credentials
2. Run `forge lint` successfully
3. Send the complete output to your webhook

## Troubleshooting

If you see "Not logged in" errors:
- ✅ Check that both secrets are set correctly
- ✅ Verify your API token is valid
- ✅ Ensure your email matches your Atlassian account
- ✅ Check the GitHub Actions logs for authentication errors