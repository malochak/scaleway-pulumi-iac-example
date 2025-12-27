# Scaleway Pulumi IaC Setup Guide

## Prerequisites - Manual Steps

Before running Pulumi, you need to create these resources manually in Scaleway Console:

### 1. Create Object Storage Bucket for Pulumi State

**Why**: Pulumi needs a place to store state about your infrastructure.

**Steps**:
1. Go to Scaleway Console → Object Storage
2. Create a new bucket:
   - **Name**: `pulumi-state-<your-project-name>` (e.g., `pulumi-state-myapp`)
   - **Region**: Choose closest region (e.g., `fr-par`, `nl-ams`, `pl-waw`)
   - **Visibility**: **Private** (important!)
   - **Versioning**: **Enabled** (recommended for state recovery)
3. Note the bucket name and region for later

### 2. Get Scaleway API Credentials

**Steps**:
1. Go to Scaleway Console → Project Settings → API Keys
2. Generate a new API key with:
   - **Description**: "Pulumi IaC"
   - **Permissions**: Full access (or specific project access)
3. Save these values securely:
   - `Access Key`
   - `Secret Key`
   - `Project ID` (from Project Settings)
   - `Organization ID` (from Organization Settings)

### 3. Set Environment Variables

Create a `.env` file (DO NOT commit this file):

```bash
# Scaleway API Credentials
export SCW_ACCESS_KEY="SCW..."
export SCW_SECRET_KEY="..."
export SCW_DEFAULT_PROJECT_ID="..."
export SCW_DEFAULT_ORGANIZATION_ID="..."
export SCW_DEFAULT_REGION="fr-par"
export SCW_DEFAULT_ZONE="fr-par-1"

# Pulumi Backend Configuration
export PULUMI_BACKEND_URL="s3://pulumi-state-<your-project-name>?endpoint=s3.fr-par.scw.cloud&region=fr-par"
export AWS_ACCESS_KEY_ID="$SCW_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"
```

**Important**: Replace `<your-project-name>` with your actual bucket name and adjust region if different.

Load these before running Pulumi commands:
```bash
source .env
```

---

## Project Structure

```
scaleway-pulumi-iac-example/
├── .env                      # Your secrets (DO NOT COMMIT)
├── .gitignore
├── README.md
├── SETUP.md                  # This file
│
├── infra-bootstrap/          # Bootstrap resources (registry, etc.)
│   ├── Pulumi.yaml
│   ├── package.json
│   ├── tsconfig.json
│   ├── index.ts
│   └── Pulumi.shared.yaml   # Shared/bootstrap stack config
│
└── infra/                    # Main application infrastructure
    ├── Pulumi.yaml
    ├── package.json
    ├── tsconfig.json
    ├── index.ts
    ├── Pulumi.dev.yaml      # Dev environment config
    └── Pulumi.prod.yaml     # Prod environment config
```

### Why Two Projects?

1. **infra-bootstrap**: Creates shared resources that all environments use:
   - Container Registry namespace
   - Shared VPC (if needed)
   - DNS zones (if needed)
   - These are created once and rarely change

2. **infra**: Creates per-environment resources:
   - Compute instances/containers
   - Databases
   - Environment-specific configs
   - These differ per environment (dev/prod)

This separation prevents accidentally deleting shared resources when destroying a dev environment.

---

## Next Steps

1. Complete the manual steps above
2. Run the Pulumi initialization commands (provided separately)
3. Deploy bootstrap infrastructure first
4. Deploy environment-specific infrastructure

## Verification

Test your backend is working:
```bash
source .env
pulumi login
# Should show: Logged in to s3://pulumi-state-...
```