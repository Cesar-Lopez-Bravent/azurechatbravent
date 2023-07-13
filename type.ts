const azureEnvVars = [
  "AZURE_OPENAI_API_KEY",
  "AZURE_OPENAI_API_INSTANCE_NAME",
  "AZURE_OPENAI_API_DEPLOYMENT_NAME",
  "AZURE_OPENAI_API_VERSION",
  "AZURE_OPENAI_API_EMBEDDINGS_DEPLOYMENT_NAME",
  "AZURE_COSMOSEDB_URI",
  "AZURE_COSMOSEDB_KEY",
  "AZURE_SEARCH_API_KEY",
  "AZURE_SEARCH_NAME",
  "AZURE_SEARCH_INDEX_NAME",
  "AZURE_SEARCH_API_VERSION",
  "AUTH_GITHUB_ID",
  "AUTH_GITHUB_SECRET",
  "AZURE_AD_CLIENT_ID",
  "AZURE_AD_CLIENT_SECRET",
  "AZURE_AD_TENANT_ID",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
] as const;

type RequiredServerEnvKeys = (typeof azureEnvVars)[number];

declare global {
  namespace NodeJS {
    interface ProcessEnv extends Record<RequiredServerEnvKeys, string> {}
  }
}

export {};
