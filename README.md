# Scaleway Pulumi Infrastructure as Code Example

A production-ready example of managing Scaleway infrastructure using Pulumi with TypeScript. This project demonstrates best practices for multi-environment IaC with proper state management, shared resources, and environment isolation.

## Features

- **Multi-environment setup** with separate dev and prod stacks
- **Shared resource management** with dedicated bootstrap infrastructure
- **Remote state** using Scaleway Object Storage (S3-compatible)
- **Container registry** shared across all environments
- **VPC and networking** per environment with proper isolation
- **TypeScript** for type-safe infrastructure code
- **pnpm workspaces** for efficient dependency management
- **Monorepo structure** with shared components and packages
- **Production-ready** with proper .gitignore, versioning, and documentation

## Quick Start

### Prerequisites

- Node.js 24+
- pnpm 9+ ([install](https://pnpm.io/installation))
- Pulumi CLI ([install](https://www.pulumi.com/docs/install/))
- Scaleway account with API credentials

### Setup

1. **Complete manual setup** (create Object Storage bucket, get API keys):
   ```bash
   cat QUICKSTART.md
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your Scaleway credentials
   source .env
   ```

3. **Install dependencies**:
   ```bash
   cd infra
   pnpm install
   ```

4. **Deploy bootstrap infrastructure** (container registry):
   ```bash
   cd stacks/bootstrap
   pulumi login
   pulumi stack init shared
   pulumi up
   ```

5. **Deploy dev environment** (when created):
   ```bash
   cd ../app
   pulumi stack init dev
   pulumi up
   ```

6. **Deploy prod environment**:
   ```bash
   pulumi stack init prod
   pulumi stack select prod
   pulumi up
   ```

See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## Project Structure

```
scaleway-pulumi-iac-example/
├── README.md                   # This file
├── LICENSE                     # Apache License 2.0
├── QUICKSTART.md               # Complete setup and deployment guide
├── CONTRIBUTING.md             # Contribution guidelines
├── .gitignore                  # Git ignore rules
│
└── infra/                      # Infrastructure monorepo
    ├── pnpm-workspace.yaml     # pnpm workspace configuration
    ├── package.json            # Root package for workspace
    ├── pnpm-lock.yaml          # Locked dependencies
    │
    ├── components/             # Reusable Pulumi components
    │   └── (shared components)
    │
    ├── stacks/                 # Pulumi stack projects
    │   └── bootstrap/          # Bootstrap infrastructure (shared)
    │       ├── Pulumi.yaml
    │       ├── package.json
    │       ├── tsconfig.json
    │       └── index.ts        # Container registry
    │
    └── packages/               # Shared packages
        └── config/             # Shared types and constants
            ├── package.json    # @infra/config
            ├── tsconfig.json
            └── src/
                ├── types.ts
                ├── constants.ts
                └── index.ts
```

## What's Deployed

### Bootstrap Stack (shared)
- **Container Registry**: Shared namespace for all environments
- Images tagged by environment: `myapp:dev`, `myapp:prod`

### Dev/Prod Stacks (per environment)
- **VPC**: Virtual Private Cloud for network isolation
- **Private Network**: Internal networking for resources
- Resources tagged with environment name

## Extending the Infrastructure

Add resources to your stack (e.g., `infra/stacks/app/index.ts` when created):

```typescript
import * as scaleway from "@pulumiverse/scaleway";
import * as pulumi from "@pulumi/pulumi";

const stack = pulumi.getStack();

const instance = new scaleway.InstanceServer(`${stack}-web`, {
    type: "DEV1-S",
    image: "ubuntu_focal",
    tags: [stack, "web"],
});

export const instanceIp = instance.publicIp;
```

See [Scaleway Pulumi Provider](https://www.pulumi.com/registry/packages/scaleway/) documentation for available resources.

## State Management

This project uses Scaleway Object Storage as a backend for Pulumi state:

- **Versioning enabled**: Recover previous states
- **Private bucket**: State files are not publicly accessible
- **S3-compatible**: Standard S3 protocol

State is stored in: `s3://<your-bucket>/<stack-name>/.pulumi/stacks/<project>/<stack>.json`

### Stack Configuration Files

**⚠️ Important for Template Users:**

This repository ignores `Pulumi.*.yaml` files (they're not committed). These files contain:
- Encryption salts for secrets
- Stack-specific configuration values

**If you use this as a template for your own project:**

1. After running `pulumi stack init`, commit the generated `Pulumi.*.yaml` files:
   ```bash
   git add infra/stacks/bootstrap/Pulumi.shared.yaml
   git add infra/stacks/app/Pulumi.dev.yaml infra/stacks/app/Pulumi.prod.yaml
   git commit -m "Add stack configuration files"
   ```

2. Update `.gitignore` to allow them:
   ```bash
   # Remove or comment out this line in .gitignore:
   # Pulumi.*.yaml
   ```

This ensures your team can decrypt secrets and work with the same stacks. The encryption salt itself is safe to commit (the passphrase/key is what must remain secret).

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Ways to Contribute

- Add examples for different Scaleway resources
- Improve documentation
- Add CI/CD workflows
- Report issues or suggest features

## Resources

- [Pulumi Documentation](https://www.pulumi.com/docs/)
- [Scaleway Pulumi Provider](https://www.pulumi.com/registry/packages/scaleway/)
- [Scaleway Documentation](https://www.scaleway.com/en/docs/)
- [Pulumi Scaleway Examples](https://github.com/pulumi/examples)

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## Support

- **Issues**: [GitHub Issues](https://github.com/YOUR_USERNAME/scaleway-pulumi-iac-example/issues)
- **Discussions**: [GitHub Discussions](https://github.com/YOUR_USERNAME/scaleway-pulumi-iac-example/discussions)
- **Pulumi Community**: [Pulumi Slack](https://slack.pulumi.com/)