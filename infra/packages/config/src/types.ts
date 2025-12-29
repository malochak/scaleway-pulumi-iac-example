export interface KapsuleConfig {
  nodeCount: number;
  nodeType: string;
  version: string;
  cni?: string;
}

export interface PostgresConfig {
  nodeType: string;
  highAvailability: boolean;
}

export interface MessagingConfig {
  type: "kafka" | "scaleway";
  nodeCount?: number;
}