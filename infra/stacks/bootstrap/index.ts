import * as pulumi from "@pulumi/pulumi";
import * as scaleway from "@pulumiverse/scaleway";

const projectName = pulumi.getProject();

// Shared container registry for all environments (dev, staging, prod)
const containerRegistry = new scaleway.registry.Namespace("shared-registry", {
    name: `${projectName}-registry`,
    description: "Shared container registry for all environments",
    isPublic: false,
});

// Stack outputs - accessible via `pulumi stack output <name>`
// These can be referenced by other Pulumi stacks or CI/CD pipelines
export const registryNamespaceId = containerRegistry.id;
export const registryEndpoint = containerRegistry.endpoint;
export const registryNamespaceName = containerRegistry.name;

export const registryInstructions = pulumi.interpolate`
Container Registry Setup Complete!

Registry Endpoint: ${containerRegistry.endpoint}
Namespace: ${containerRegistry.name}

To push images:
1. Login: docker login ${containerRegistry.endpoint} -u nologin -p <SCW_SECRET_KEY>
2. Tag: docker tag myapp:latest ${containerRegistry.endpoint}/myapp:dev
3. Push: docker push ${containerRegistry.endpoint}/myapp:dev

Use in application stacks:
- Image URL: ${containerRegistry.endpoint}/myapp:dev
- Namespace ID: ${containerRegistry.id}
`;