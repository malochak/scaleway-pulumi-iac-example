# Scaleway Pulumi Infrastructure as Code Starter Template

## Description
A production-ready starter template for building full-stack applications on Scaleway using Pulumi for infrastructure management. This project demonstrates how to deploy and manage a complete application stack including:

- **Infrastructure**: Managed with Pulumi (TypeScript)
- **Backend**: Java/Kotlin Spring applications
- **Frontend**: Next.js/React applications
- **Scaleway Services**: Instances (VMs), Kubernetes, Object Storage, Databases, Queues & Kafka

The applications communicate with each other and utilize various Scaleway services, providing a realistic example of a multi-tier application architecture.

## Prerequisites

Before you begin, ensure you have the following installed and configured:

### Required Tools
- [Pulumi CLI](https://www.pulumi.com/docs/get-started/install/)
- [Node.js](https://nodejs.org/) - for Pulumi TypeScript and Next.js frontend
- [Java JDK](https://adoptium.net/) - for backend applications
- [Kotlin](https://kotlinlang.org/docs/getting-started.html) (if using Kotlin)

### Scaleway Setup
- [Scaleway Account](https://console.scaleway.com/register)
- Scaleway Access Key and Secret Key ([How to generate](https://www.scaleway.com/en/docs/identity-and-access-management/iam/how-to/create-api-keys/))
- Organization ID and Project ID from Scaleway Console

### Configuration
Set up your Scaleway credentials as environment variables:

```bash
export SCW_ACCESS_KEY="your-access-key"
export SCW_SECRET_KEY="your-secret-key"
export SCW_DEFAULT_ORGANIZATION_ID="your-org-id"
export SCW_DEFAULT_PROJECT_ID="your-project-id"
export SCW_DEFAULT_REGION="fr-par"  # or your preferred region
export SCW_DEFAULT_ZONE="fr-par-1"  # or your preferred zone
```

## Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd scaleway-pulumi-iac-example
```

### 2. Deploy Infrastructure (Dev Environment)
```bash
cd infra/dev
npm install
pulumi stack init dev
pulumi up
```

### 3. Deploy Backend Application
```bash
cd ../../backend
# Build and deploy instructions will be added
```

### 4. Deploy Frontend Application
```bash
cd ../frontend
# Build and deploy instructions will be added
```

## Project Structure

```
scaleway-pulumi-iac-example/
├── infra/                          # Infrastructure as Code (Pulumi)
│   ├── dev/                        # Development environment
│   │   ├── index.ts               # Main infrastructure definition
│   │   ├── Pulumi.yaml            # Pulumi project configuration
│   │   └── package.json           # TypeScript dependencies
│   ├── staging/                    # Staging environment (planned)
│   └── prod/                       # Production environment (planned)
├── backend/                        # Backend applications (Java/Kotlin Spring)
│   └── ...                        # Spring Boot application structure
├── frontend/                       # Frontend applications (Next.js/React)
│   └── ...                        # Next.js application structure
├── README.md                       # This file
└── LICENSE                         # Apache License 2.0
```

### Infrastructure Components

The `infra/dev` directory contains Pulumi code that provisions:

- **Compute**: Scaleway Instances (VMs) or Kubernetes clusters
- **Storage**: Object Storage buckets for static assets and data
- **Databases**: Managed PostgreSQL, MySQL, or Redis instances
- **Messaging**: Scaleway Messaging and Queuing (NATS/SQS-compatible) and Kafka
- **Networking**: VPC, security groups, and load balancers

### Application Architecture

- **Backend**: Java/Kotlin Spring applications that interact with Scaleway services (databases, object storage, messaging)
- **Frontend**: Next.js/React applications that communicate with backend APIs
- **Communication**: RESTful APIs between frontend and backend, event-driven communication via queues/Kafka

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
