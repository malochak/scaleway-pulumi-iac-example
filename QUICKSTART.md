# Quickstart Guide

## Prerequisites Checklist

- [ ] Node.js 24+ installed
- [ ] Pulumi CLI installed (`brew install pulumi` or see https://www.pulumi.com/docs/install/)
- [ ] Scaleway account with API credentials
- [ ] Object Storage bucket created for Pulumi state (see SETUP.md)

## Initial Setup

### 1. Configure Environment Variables

Create a `.env` file in the project root:

```bash
export SCW_ACCESS_KEY="your-access-key"
export SCW_SECRET_KEY="your-secret-key"
export SCW_DEFAULT_PROJECT_ID="your-project-id"
export SCW_DEFAULT_ORGANIZATION_ID="your-org-id"
export SCW_DEFAULT_REGION="fr-par"
export SCW_DEFAULT_ZONE="fr-par-1"

export PULUMI_BACKEND_URL="s3://pulumi-state-<your-bucket>?endpoint=s3.fr-par.scw.cloud&region=fr-par"
export AWS_ACCESS_KEY_ID="$SCW_ACCESS_KEY"
export AWS_SECRET_ACCESS_KEY="$SCW_SECRET_KEY"
```

Load the environment:
```bash
source .env
```

### 2. Deploy Bootstrap Infrastructure

Bootstrap resources are shared across all environments (container registry, etc.):

```bash
cd infra-bootstrap
npm install
pulumi login
pulumi stack init shared
pulumi up
```

Save the outputs (registry endpoint, namespace ID) for later use.

### 3. Deploy Dev Environment

```bash
cd ../infra
npm install
pulumi stack init dev
pulumi up
```

### 4. Deploy Prod Environment

```bash
pulumi stack init prod
pulumi stack select prod
pulumi up
```

## Project Structure

```
.
├── .env                     # Your credentials (gitignored)
├── SETUP.md                 # Detailed setup instructions
├── QUICKSTART.md            # This file
├── README.md                # Project overview
│
├── infra-bootstrap/         # Shared resources
│   ├── Pulumi.yaml
│   ├── package.json
│   ├── index.ts             # Container registry
│   └── Pulumi.shared.yaml   # Bootstrap stack config
│
└── infra/                   # Per-environment resources
    ├── Pulumi.yaml
    ├── package.json
    ├── index.ts             # VPC, networking, compute
    ├── Pulumi.dev.yaml      # Dev config
    └── Pulumi.prod.yaml     # Prod config
```

## Common Commands

### Stack Management

```bash
pulumi stack ls                    # List all stacks
pulumi stack select dev            # Switch to dev stack
pulumi stack output                # Show stack outputs
```

### Infrastructure Changes

```bash
pulumi preview                     # Preview changes
pulumi up                          # Apply changes
pulumi destroy                     # Destroy resources
pulumi refresh                     # Sync state with cloud
```

### State Management

```bash
pulumi stack export > backup.json  # Export state
pulumi stack import < backup.json  # Import state
```

## What's Deployed

### Bootstrap Stack (shared)
- Container Registry namespace
- Available to all environments

### Dev/Prod Stacks (per environment)
- VPC
- Private Network
- Tagged with environment name

## Next Steps

1. Add compute resources (instances, containers, functions) to `infra/index.ts`
2. Add databases, object storage, or other services
3. Reference the shared registry from bootstrap stack
4. Configure stack-specific settings in `Pulumi.{stack}.yaml`

## Using the Container Registry

After bootstrap deployment, push images:

```bash
REGISTRY_ENDPOINT=$(cd infra-bootstrap && pulumi stack output registryEndpoint)

docker login $REGISTRY_ENDPOINT -u nologin -p $SCW_SECRET_KEY
docker tag myapp:latest $REGISTRY_ENDPOINT/myapp:dev
docker push $REGISTRY_ENDPOINT/myapp:dev
```

Reference in your infrastructure code:

```typescript
const container = new scaleway.Container("app", {
    namespaceId: containerNamespaceId,
    registryImage: `${registryEndpoint}/myapp:${stack}`,
});
```

## Troubleshooting

### Backend login fails
- Verify `PULUMI_BACKEND_URL` is set correctly
- Check bucket exists and credentials are valid
- Ensure `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are set

### "Resource already exists"
- Check if resources exist in Scaleway console
- Use `pulumi import` to import existing resources

### Stack state is corrupted
- Restore from backup: `pulumi stack import < backup.json`
- Or use object storage versioning to recover previous state