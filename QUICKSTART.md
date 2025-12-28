# Quickstart Guide

Get your Scaleway infrastructure running with Pulumi in minutes.

## Prerequisites

### Required Tools
- Node.js 24+
- Pulumi CLI ([install guide](https://www.pulumi.com/docs/install/))
- Scaleway account

### Installation Check
```bash
node --version    # Should be 24.x or higher
pulumi version    # Should show Pulumi CLI version
```

## Step 1: Manual Setup in Scaleway Console

Before running any Pulumi commands, create these resources in Scaleway Console:

### 1.1 Create Object Storage Bucket for State

Pulumi needs a place to store infrastructure state.

1. Go to **Scaleway Console → Object Storage**
2. Click **Create Bucket**:
   - **Name**: `pulumi-state-<your-project-name>` (e.g., `pulumi-state-myapp`)
   - **Region**: Choose closest region (`fr-par`, `nl-ams`, `pl-waw`)
   - **Visibility**: **Private** (important!)
   - **Versioning**: **Enabled** (recommended for state recovery)
3. Save the bucket name for Step 2

### 1.2 Get API Credentials

1. Go to **Scaleway Console → Project Settings → API Keys**
2. Click **Generate API Key**:
   - **Description**: "Pulumi IaC"
   - **Permissions**: Full access or specific project access
3. Save these values securely:
   - Access Key
   - Secret Key
   - Project ID (from Project Settings)
   - Organization ID (from Organization Settings)

## Step 2: Configure Environment

Create a `.env` file in the project root:

```bash
# Scaleway API Credentials
export SCW_ACCESS_KEY="your-access-key"
export SCW_SECRET_KEY="your-secret-key"
export SCW_DEFAULT_PROJECT_ID="your-project-id"
export SCW_DEFAULT_ORGANIZATION_ID="your-org-id"
export SCW_DEFAULT_REGION="fr-par"
export SCW_DEFAULT_ZONE="fr-par-1"

# Pulumi Backend (replace with your bucket name and region)
export PULUMI_BACKEND_URL="s3://pulumi-state-<your-bucket>?endpoint=s3.fr-par.scw.cloud&region=fr-par"
export AWS_ACCESS_KEY_ID="$SCW_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"
```

**Important**: Replace `<your-bucket>` with your actual bucket name from Step 1.1.

Load the environment:
```bash
source .env
```

Verify backend connection:
```bash
pulumi login
# Should output: Logged in to s3://pulumi-state-...
```

## Step 3: Deploy Bootstrap Infrastructure

Bootstrap infrastructure contains shared resources used across all environments (dev, prod).

```bash
cd infra-bootstrap
npm install
pulumi stack init shared
pulumi up
```

Review the changes and confirm with `yes`.

Save the outputs for later:
```bash
pulumi stack output registryEndpoint
pulumi stack output registryNamespaceId
```

## Step 4: Deploy Dev Environment

```bash
cd ../infra
npm install
pulumi stack init dev
pulumi up
```

Review and confirm with `yes`.

## Step 5: Deploy Prod Environment (Optional)

```bash
pulumi stack init prod
pulumi stack select prod
pulumi up
```

## Project Structure

```
scaleway-pulumi-iac-example/
├── .env                     # Your credentials (gitignored)
├── QUICKSTART.md            # This file
├── README.md                # Project overview
├── CONTRIBUTING.md          # Contribution guidelines
│
├── infra-bootstrap/         # Shared resources (deploy once)
│   ├── Pulumi.yaml
│   ├── package.json
│   ├── tsconfig.json
│   └── index.ts             # Container registry
│
└── infra/                   # Per-environment resources
    ├── Pulumi.yaml
    ├── package.json
    ├── tsconfig.json
    ├── index.ts             # VPC, networking
    ├── Pulumi.dev.yaml      # Dev config
    └── Pulumi.prod.yaml     # Prod config
```

**Why two projects?**
- **infra-bootstrap**: Shared resources (registry, DNS zones) used by all environments
- **infra**: Per-environment resources (compute, databases) that differ between dev/prod

This separation prevents accidentally deleting shared resources when destroying dev environment.

## What Gets Deployed

### Bootstrap Stack (shared)
- Container Registry namespace for all environments
- Images tagged by environment: `myapp:dev`, `myapp:prod`

### Dev/Prod Stacks (per environment)
- VPC for network isolation
- Private Network for internal communication
- Tagged with environment name

## Common Commands

### Stack Management
```bash
pulumi stack ls                    # List all stacks
pulumi stack select dev            # Switch to dev stack
pulumi stack output                # Show stack outputs
pulumi stack export > backup.json  # Backup state
```

### Infrastructure Operations
```bash
pulumi preview                     # Preview changes (dry-run)
pulumi up                          # Apply changes
pulumi destroy                     # Destroy all resources
pulumi refresh                     # Sync state with cloud
```

### Switching Environments
```bash
pulumi stack select dev
pulumi up

pulumi stack select prod
pulumi up
```

## Using the Container Registry

After bootstrap deployment:

### Push Images
```bash
# Get registry endpoint
REGISTRY_ENDPOINT=$(cd infra-bootstrap && pulumi stack output registryEndpoint)

# Login
docker login $REGISTRY_ENDPOINT -u nologin -p $SCW_SECRET_KEY

# Tag and push
docker tag myapp:latest $REGISTRY_ENDPOINT/myapp:dev
docker push $REGISTRY_ENDPOINT/myapp:dev
```

### Use in Infrastructure Code
```typescript
import * as pulumi from "@pulumi/pulumi";
import * as scaleway from "@pulumiverse/scaleway";

const stack = pulumi.getStack();
const registryEndpoint = "<from-bootstrap-output>";

const container = new scaleway.Container("app", {
    namespaceId: containerNamespaceId,
    registryImage: `${registryEndpoint}/myapp:${stack}`,
});
```

## Troubleshooting

### Backend Login Fails
```bash
# Check environment variables are set
echo $PULUMI_BACKEND_URL
echo $AWS_ACCESS_KEY_ID

# Verify bucket exists
# Go to Scaleway Console → Object Storage

# Re-login
pulumi login
```

### "Resource Already Exists" Error
- Check Scaleway Console for existing resources
- Use `pulumi import` to import existing resources
- Or use different resource names/stack

### Stack State Corrupted
```bash
# Restore from backup
pulumi stack import < backup.json

# Or use Object Storage versioning
# Go to bucket → Select state file → Restore previous version
```

### Permission Denied
- Verify API key has correct permissions
- Check Project ID and Organization ID are correct
- Ensure API key isn't expired

## Next Steps

1. **Add more resources** to `infra/index.ts`:
   - Instances, Kubernetes clusters
   - Databases (PostgreSQL, MySQL, Redis)
   - Load balancers, object storage

2. **Configure stack-specific settings** in `Pulumi.{stack}.yaml`

3. **Set up CI/CD** for automated deployments

4. **Explore** the [Scaleway Pulumi Provider docs](https://www.pulumi.com/registry/packages/scaleway/)

## Getting Help

- GitHub Issues: [Report bugs or request features](https://github.com/YOUR_USERNAME/scaleway-pulumi-iac-example/issues)
- Pulumi Community: [Pulumi Slack](https://slack.pulumi.com/)
- Scaleway Docs: [Scaleway Documentation](https://www.scaleway.com/en/docs/)