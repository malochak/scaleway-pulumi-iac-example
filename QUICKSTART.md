# Quickstart Guide

Get your Scaleway infrastructure running with Pulumi in minutes.

## Prerequisites

See [README Prerequisites](README.md#prerequisites).

### Installation Check
```bash
node --version    # Should be 24.x or higher
pnpm --version    # Should be 9.x or higher
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

1. Click your **profile icon (top-right corner)** → **IAM & API keys**
2. Click the **API keys** tab
3. Note your **Organization ID** displayed at the top of the page (you'll need this later)
4. Click **+ Generate an API key**:
   - **API key bearer**: Select "Myself (IAM user)"
   - **Description**: "Pulumi IaC" (optional but recommended)
   - **Expiration**: Choose based on your security requirements (default: 1 year)
   - **Object Storage**: Select **"Yes, set up preferred Project"** (required for Pulumi state backend)
   - Click **Generate API key** button
5. On the "Credentials Usage" page, save these values securely:
   - **Access Key** (SCW_ACCESS_KEY)
   - **Secret Key** (SCW_SECRET_KEY)
   - **Project ID** (visible in your Project Dashboard or during key setup)
   - **Organization ID** (from step 3 above)

⚠️ **Important**: The Secret Key is only shown once. Save it immediately!

## Step 2: Configure Environment

Create a `.env` file in the project root:

```bash
# Scaleway API Credentials (for Pulumi Scaleway provider)
export SCW_ACCESS_KEY="your-access-key"
export SCW_SECRET_KEY="your-secret-key"
export SCW_DEFAULT_PROJECT_ID="your-project-id"
export SCW_DEFAULT_ORGANIZATION_ID="your-org-id"
export SCW_DEFAULT_REGION="fr-par"
export SCW_DEFAULT_ZONE="fr-par-1"

# Pulumi Backend - Choose ONE format below:

# Option 1: HTTPS format (simpler, recommended)
export PULUMI_BACKEND_URL="https://your-bucket-name.s3.fr-par.scw.cloud"

# Option 2: S3 protocol format (more explicit)
# export PULUMI_BACKEND_URL="s3://your-bucket-name?endpoint=s3.fr-par.scw.cloud&region=fr-par"

# AWS credentials (required for S3-compatible Object Storage access)
# These use the same values as your Scaleway credentials
export AWS_ACCESS_KEY_ID="$SCW_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"
export AWS_REGION="$SCW_DEFAULT_REGION"  # Must match your bucket region
```

**Important replacements:**
- `your-access-key`, `your-secret-key`: From Step 1.2
- `your-project-id`, `your-org-id`: From Step 1.2
- `your-bucket-name`: Your actual bucket name from Step 1.1 (e.g., `pulumi-state-myapp`)
- `fr-par`: Your bucket's region (e.g., `fr-par`, `nl-ams`, `pl-waw`)

**Why AWS credentials?**
Scaleway Object Storage is S3-compatible. Pulumi uses the AWS SDK to access the state backend, which requires `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`. These should be set to your Scaleway credentials.

Load the environment:
```bash
source .env
```

Verify backend connection:
```bash
pulumi login
# Should output: Logged in to s3://pulumi-state-...
```

## Step 3: Install Dependencies

Install all infrastructure workspace dependencies:

```bash
cd infra
pnpm install
```

## Step 4: Deploy Bootstrap Infrastructure

Bootstrap infrastructure contains shared resources used across all environments (dev, prod).

```bash
cd stacks/bootstrap
pulumi stack init shared
pulumi up
```

Review the changes and confirm with `yes`.

Save the outputs for later:
```bash
pulumi stack output registryEndpoint
pulumi stack output registryNamespaceId
```

## Step 5: Deploy Dev Environment (Optional - when app stack is created)

```bash
cd ../app
pulumi stack init dev
pulumi up
```

Review and confirm with `yes`.

## Step 6: Deploy Prod Environment (Optional)

```bash
pulumi stack init prod
pulumi stack select prod
pulumi up
```

## Project Structure

The project uses a **monorepo structure** under `infra/`:

- **`infra/stacks/bootstrap/`** - Bootstrap infrastructure (container registry)
- **`infra/components/`** - Reusable Pulumi components (for future use)
- **`infra/packages/config/`** - Shared types and constants

All infrastructure packages share dependencies through pnpm workspace.

See [README.md](README.md#project-structure) for the complete structure diagram.

## What Gets Deployed

**Bootstrap Stack (shared):** Container Registry for all environments

**App Stacks (when created):** VPC, networking, and application resources per environment

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
REGISTRY_ENDPOINT=$(cd infra/stacks/bootstrap && pulumi stack output registryEndpoint)

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

1. **Create app stack** and add resources to `infra/stacks/app/index.ts`:
   - Instances, Kubernetes clusters
   - Databases (PostgreSQL, MySQL, Redis)
   - Load balancers, object storage

2. **Create reusable components** in `infra/components/`

3. **Configure stack-specific settings** in `Pulumi.{stack}.yaml` files

4. **Set up CI/CD** for automated deployments

5. **Explore** the [Scaleway Pulumi Provider docs](https://www.pulumi.com/registry/packages/scaleway/)
